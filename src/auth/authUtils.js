const jwt = require('jsonwebtoken');
const  asyncHandler  = require('../helpers/asyncHandle');
const keyTokenService = require('../services/ApiKey.service');
const { BadRequestError, NotFoundError, ForbiddenError, UnauthorizedError } = require('../core/error');


const HEADERS = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
};

const creatTokenPair = async ( payload , publicKey , privateKey) => {

    try {
        const accessToken = await jwt.sign(
            payload,
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '2 days'
            }
        );

        const refreshToken = await jwt.sign(
            payload,
            privateKey,
            {
                algorithm: 'RS256',
                expiresIn: '7 days'
            }
        );

        // verify token
        jwt.verify( accessToken, publicKey, (err, decode) => {
            if(err) {
                console.log(`Error verify::`, err);
            } else {
                console.log(`Decode verify::`, decode);
            };
        });

        return { accessToken, refreshToken };

    } catch (error) {
        return {
            status: 'ERR',
            message: error
        }
    }
};

const authentication = asyncHandler ( async (req, res, next) => {
    /*
    1 - check userName misssing ???
    2 - get accessToken ???
    3 - verifyToken ???
    4 - check user in dbs ???
    5 - check keyStore with this userName ???
    6 - OK all => return next()
     */
    try {
        const user_id = req.headers[HEADERS.CLIENT_ID];
      
        if(!user_id) {
            throw new BadRequestError('Missing userName!');
        }

        const keyStore = await keyTokenService.findByUserId(user_id);

        if(!keyStore[0]) {
            throw new UnauthorizedError('Unauthorized!');
        }

        const accessToken = req.headers[HEADERS.AUTHORIZATION].split(' ')[1];

        if(!accessToken) {
            throw new ForbiddenError('Missing access token!');
        }

        const decodeUser = jwt.verify( accessToken, keyStore[0].public_key, (err, decode) => {
            if(err) {
                console.log(`Error verify::`, err);
            } else {
                console.log(`Decode verify::`, decode);
                return decode;
            };
        });

        req.user_id = decodeUser.ID;
        if(decodeUser.ID !== user_id ) {
            throw new ForbiddenError('Invalid user!');
        }
    
        req.keyStore = keyStore;

        return next();
    } catch (error) {
        throw error;
    }
});

module.exports = {
    creatTokenPair,
    authentication
}