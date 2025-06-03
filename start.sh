#!/bin/bash

# --- Cấu hình các Repository và Nhánh ---
# URL của Git repo chung chứa tất cả các nhánh dịch vụ
MONOREPO_URL="https://github.com/finnduc/NHOM.git"

# Tên các nhánh tương ứng với từng dịch vụ trong monorepo
BACKEND_BRANCH="backend"      # Nhánh cho phần backend
AI_BACKEND_BRANCH="ai_backend"  # Nhánh cho phần AI backend
FRONTEND_BRANCH="frontend"    # Nhánh cho phần frontend

# --- Dọn dẹp thư mục cũ (nếu có) ---
echo "--- Cleaning up previous project directories (if any) ---"
rm -rf ./backend ./ai_backend ./frontend

# --- Clone các nhánh vào thư mục tương ứng ---
echo "--- Cloning Git branches into service directories ---"

# Clone Backend branch
echo "Cloning backend branch..."
if ! git clone -b ${BACKEND_BRANCH} ${MONOREPO_URL} ./backend; then
    echo "Error cloning backend branch. Exiting."
    exit 1
fi

# Clone AI Backend branch
echo "Cloning AI backend branch..."
if ! git clone -b ${AI_BACKEND_BRANCH} ${MONOREPO_URL} ./ai_backend; then
    echo "Error cloning AI backend branch. Exiting."
    exit 1
fi

# Clone Frontend branch
echo "Cloning frontend branch..."
if ! git clone -b ${FRONTEND_BRANCH} ${MONOREPO_URL} ./frontend; then
    echo "Error cloning frontend branch. Exiting."
    exit 1
fi

# --- Chạy Docker Compose ---
echo "--- Starting Docker Compose services ---"
# Sử dụng 'docker compose' cho Docker Compose V2 trở lên.
# Nếu bạn dùng Docker Compose V1 cũ hơn, hãy thay bằng 'docker-compose'.
docker compose up --build -d

echo "--- All services are starting up. Use 'docker compose ps' to check status. ---"
echo "--- You can view logs with 'docker compose logs -f' ---"