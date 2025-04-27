from fastapi import Depends, HTTPException, Request
from fastapi import APIRouter
import mysql.connector
import jwt
from jwt.exceptions import InvalidTokenError

# Database connection configuration
def get_db():
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="your_username",
            password="your_password",
            database="your_database"
        )
        yield db
    finally:
        db.close()

async def authenticate(request: Request, db: mysql.connector.MySQLConnection = Depends(get_db)):
    # Extract user_id from 'x-client-id' header
    user_id = request.headers.get('x-client-id')
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user ID")

    # Query the api_keys table for the user's public key
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT public_key FROM api_keys WHERE user_id = %s", (user_id,))
        api_key = cursor.fetchone()
        if not api_key:
            raise HTTPException(status_code=404, detail="API key not found for this user")
    finally:
        cursor.close()

    # Extract access token from 'authorization' header
    auth_header = request.headers.get('authorization')
    if not auth_header:
        raise HTTPException(status_code=403, detail="Missing access token")

    try:
        scheme, token = auth_header.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=403, detail="Invalid authorization scheme")
    except ValueError:
        raise HTTPException(status_code=403, detail="Invalid authorization header")

    # Verify the token using the public key
    try:
        decoded = jwt.decode(token, api_key['public_key'], algorithms=["RS256"])
        if decoded.get('ID') != user_id:
            raise HTTPException(status_code=403, detail="Invalid user")
    except InvalidTokenError:
        raise HTTPException(status_code=403, detail="Invalid or expired token")

    # If all checks pass, return user_id for use in route handlers
    return {'user_id': user_id}

# Example router with authentication applied to all endpoints
router = APIRouter(dependencies=[Depends(authenticate)])

@router.get("/protected-endpoint")
async def protected_endpoint(auth: dict = Depends(authenticate)):
    user_id = auth['user_id']
    return {"message": f"Welcome, user {user_id}"}