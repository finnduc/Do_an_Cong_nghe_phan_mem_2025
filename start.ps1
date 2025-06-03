# --- Cấu hình các Repository và Nhánh ---
# URL của Git repo chung chứa tất cả các nhánh dịch vụ
$monorepoUrl = "https://github.com/finnduc/NHOM.git"

# Tên các nhánh tương ứng với từng dịch vụ trong monorepo
$backendBranch = "backend"      # Nhánh cho phần backend
$aiBackendBranch = "ai_backend"  # Nhánh cho phần AI backend
$frontendBranch = "frontend"    # Nhánh cho phần frontend

# --- Dọn dẹp thư mục cũ (nếu có) ---
Write-Host "--- Cleaning up previous project directories (if any) ---"
Remove-Item -Path ".\backend", ".\ai_backend", ".\frontend" -Recurse -Force -ErrorAction SilentlyContinue

# --- Clone các nhánh vào thư mục tương ứng ---
Write-Host "--- Cloning Git branches into service directories ---"

# Clone Backend branch
Write-Host "Cloning backend branch..."
try {
    git clone -b $backendBranch $monorepoUrl ".\backend" -ErrorAction Stop
    Write-Host "Successfully cloned backend branch."
} catch {
    Write-Error "Error cloning backend branch: $_"
    exit 1
}

# Clone AI Backend branch
Write-Host "Cloning AI backend branch..."
try {
    git clone -b $aiBackendBranch $monorepoUrl ".\ai_backend" -ErrorAction Stop
    Write-Host "Successfully cloned AI backend branch."
} catch {
    Write-Error "Error cloning AI backend branch: $_"
    exit 1
}

# Clone Frontend branch
Write-Host "Cloning frontend branch..."
try {
    git clone -b $frontendBranch $monorepoUrl ".\frontend" -ErrorAction Stop
    Write-Host "Successfully cloned frontend branch."
} catch {
    Write-Error "Error cloning frontend branch: $_"
    exit 1
}

# --- Chạy Docker Compose ---
Write-Host "--- Starting Docker Compose services ---"
# Sử dụng 'docker compose' cho Docker Compose V2 trở lên.
# Nếu bạn dùng Docker Compose V1 cũ hơn, hãy thay bằng 'docker-compose'.
docker compose up --build -d

Write-Host "--- All services are starting up. Use 'docker compose ps' to check status. ---"
Write-Host "--- You can view logs with 'docker compose logs -f' ---"