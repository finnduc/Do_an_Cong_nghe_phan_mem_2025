# Stockly - Warehouse Management Website

## Overview
Stockly is a web application designed for efficient warehouse management, built with modern technologies including FastAPI, Express, Next.js, and MySQL.

## Prerequisites
- Docker
- Docker Compose
- Git

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd stockly
```

### 2. Set Up Environment Variables
Create a `.env` file by copying the `.env.example` file and configure it with your settings:
```bash
cp .env.example .env
```

Edit the `.env` file with the following variables:
```
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=YOUR-ROOT-MYSQL-PASSWORD
DB_NAME=YOUR-DATABASE-NAME
DB_APP_USER_PASSWORD=YOUR-RESTRICTED-MYSQL-PASSWORD
MYSQL_PORT=3307
FASTAPI_PORT=8000
EXPRESS_PORT=4000
NEXTJS_PORT=3000
GOOGLE_API_KEY=YOUR-GOOGLE-API-KEY
```

Replace `YOUR-ROOT-MYSQL-PASSWORD`, `YOUR-DATABASE-NAME`, `YOUR-RESTRICTED-MYSQL-PASSWORD`, and `YOUR-GOOGLE-API-KEY` with your actual values.

### 3. Start the Application
#### On Windows
Run the startup script:
```bash
./start.ps1
```

#### On macOS/Linux
Run the startup script:
```bash
./start.sh
```

### 4. Build and Run with Docker
Launch the application using Docker Compose:
```bash
docker compose up --build
```

## Services
- **FastAPI**: Backend API running on port `8000`
- **Express**: Backend service running on port `4000`
- **Next.js**: Frontend running on port `3000`
- **MySQL**: Database running on port `3307`

## Notes
- Ensure all ports specified in the `.env` file are available.
- The Google API key is required for specific features (e.g., maps, authentication). Obtain it from the Google Cloud Console.

## Contributing
Feel free to submit issues or pull requests to improve Stockly. Follow the standard fork-and-pull workflow.

## License
This project is licensed under the MIT License.