# --- Cấu hình các Repository và Nhánh ---
$monorepoUrl = "https://github.com/finnduc/Do_an_Cong_nghe_phan_mem_2025.git"
$backendBranch = "backend"
$aiBackendBranch = "ai_backend"
$frontendBranch = "frontend"

# --- Kiểm tra yêu cầu hệ thống ---
Write-Host "--- Checking system requirements ---"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not found in PATH."
    exit 1
}
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not found in PATH."
    exit 1
}
if (-not (Test-Path "docker-compose.yml")) {
    Write-Error "docker-compose.yml not found in current directory."
    exit 1
}

# --- Dọn dẹp thư mục cũ (nếu có) ---
Write-Host "--- Cleaning up previous project directories (if any) ---"
Remove-Item -Path ".\backend", ".\ai_backend", ".\frontend" -Recurse -Force -ErrorAction SilentlyContinue

# --- Hàm kiểm tra nhánh Git ---
function Test-GitBranch($url, $branch) {
    $branches = git ls-remote --heads $url $branch
    return $branches -match $branch
}

# --- Clone các nhánh vào thư mục tương ứng ---
Write-Host "--- Cloning Git branches into service directories ---"

# Clone Backend branch
Write-Host "Cloning backend branch..."
if (-not (Test-GitBranch $monorepoUrl $backendBranch)) {
    Write-Error "Branch $backendBranch does not exist in $monorepoUrl"
    exit 1
}
try {
    git clone -b $backendBranch $monorepoUrl ".\backend"
    if ($LASTEXITCODE -ne 0) {
        throw "Git clone failed for backend branch."
    }
    Write-Host "Successfully cloned backend branch."
} catch {
    Write-Error "Error cloning backend branch: $_"
    exit 1
}

# Clone AI Backend branch
Write-Host "Cloning AI backend branch..."
if (-not (Test-GitBranch $monorepoUrl $aiBackendBranch)) {
    Write-Error "Branch $aiBackendBranch does not exist in $monorepoUrl"
    exit 1
}
try {
    git clone -b $aiBackendBranch $monorepoUrl ".\ai_backend"
    if ($LASTEXITCODE -ne 0) {
        throw "Git clone failed for AI backend branch."
    }
    Write-Host "Successfully cloned AI backend branch."
} catch {
    Write-Error "Error cloning AI backend branch: $_"
    exit 1
}

# Clone Frontend branch
Write-Host "Cloning frontend branch..."
if (-not (Test-GitBranch $monorepoUrl $frontendBranch)) {
    Write-Error "Branch $frontendBranch does not exist in $monorepoUrl"
    exit 1
}
try {
    git clone -b $frontendBranch $monorepoUrl ".\frontend"
    if ($LASTEXITCODE -ne 0) {
        throw "Git clone failed for frontend branch."
    }
    Write-Host "Successfully cloned frontend branch."
} catch {
    Write-Error "Error cloning frontend branch: $_"
    exit 1
}

# --- Kiểm tra sự tồn tại của các thư mục ---
if (-not (Test-Path ".\backend") -or -not (Test-Path ".\ai_backend") -or -not (Test-Path ".\frontend")) {
    Write-Error "One or more service directories (backend, ai_backend, frontend) are missing."
    exit 1
}

# --- Thông báo hoàn tất ---
Write-Host "--- Cloning completed successfully. Please run 'docker compose up --build -d' to start the services. ---"
Write-Host "--- Use 'docker compose ps' to check status or 'docker compose logs -f' to view logs. ---"