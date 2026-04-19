# PostgreSQL Installation Script for Windows
# This script downloads and installs PostgreSQL

param(
    [string]$Version = "16",
    [string]$InstallDir = "C:\Program Files\PostgreSQL",
    [string]$DataDir = "C:\Program Files\PostgreSQL\$Version\data",
    [string]$Password = "postgres",
    [int]$Port = 5432
)

Write-Host "=== PostgreSQL $Version Installation for Windows ===" -ForegroundColor Green

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Warning "This script should be run as Administrator for best results."
    Write-Host "Attempting to continue anyway..." -ForegroundColor Yellow
}

# Check if PostgreSQL is already installed
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService) {
    Write-Host "PostgreSQL service already exists. Checking version..." -ForegroundColor Yellow
    $existingPath = (Get-ItemProperty -Path "HKLM:\SOFTWARE\PostgreSQL\Installations\*" -ErrorAction SilentlyContinue).BaseDirectory
    if ($existingPath) {
        Write-Host "PostgreSQL found at: $existingPath" -ForegroundColor Green
        Write-Host "Skipping installation. To reinstall, uninstall the existing version first." -ForegroundColor Yellow
        exit 0
    }
}

# Download URL
$arch = if ([Environment]::Is64BitOperatingSystem) { "x64" } else { "x86" }
$downloadUrl = "https://get.enterprisedb.com/postgresql/postgresql-$Version.0-1-windows-$arch.exe"
$installerPath = "$env:TEMP\postgresql-$Version-installer.exe"

Write-Host "Downloading PostgreSQL $Version..." -ForegroundColor Cyan
Write-Host "URL: $downloadUrl" -ForegroundColor Gray

try {
    # Download with progress
    $ProgressPreference = 'Continue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download complete: $installerPath" -ForegroundColor Green
} catch {
    Write-Error "Failed to download PostgreSQL. Error: $_"
    Write-Host "Please download manually from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Run installer
Write-Host "Running PostgreSQL installer..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Gray

$installArgs = @(
    "--mode unattended",
    "--unattendedmodeui minimal",
    "--prefix `"$InstallDir\$Version`"",
    "--datadir `"$DataDir`"",
    "--superpassword `"$Password`"",
    "--serverport $Port",
    "--locale en_US.UTF-8"
) -join " "

try {
    $process = Start-Process -FilePath $installerPath -ArgumentList $installArgs -Wait -PassThru
    if ($process.ExitCode -ne 0) {
        Write-Error "Installation failed with exit code: $($process.ExitCode)"
        exit 1
    }
} catch {
    Write-Error "Failed to run installer. Error: $_"
    exit 1
}

# Add to PATH
Write-Host "Adding PostgreSQL to PATH..." -ForegroundColor Cyan
$pgBinPath = "$InstallDir\$Version\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
if ($currentPath -notlike "*$pgBinPath*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$pgBinPath", "Machine")
    Write-Host "Added to system PATH: $pgBinPath" -ForegroundColor Green
} else {
    Write-Host "Already in PATH" -ForegroundColor Gray
}

# Also add to current session
$env:PATH = "$env:PATH;$pgBinPath"

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

try {
    $pgVersion = & "$pgBinPath\psql.exe" --version 2>&1
    Write-Host "PostgreSQL installed successfully!" -ForegroundColor Green
    Write-Host "Version: $pgVersion" -ForegroundColor Green
} catch {
    Write-Warning "Could not verify installation. You may need to restart your terminal."
}

# Create tcpo_local database
Write-Host "Creating tcpo_local database..." -ForegroundColor Cyan
$env:PGPASSWORD = $Password
try {
    & "$pgBinPath\createdb.exe" -U postgres -h localhost -p $Port tcpo_local 2>&1
    Write-Host "Database 'tcpo_local' created successfully!" -ForegroundColor Green
} catch {
    Write-Warning "Could not create database. It may already exist or PostgreSQL is still starting."
}

# Cleanup
Remove-Item $installerPath -ErrorAction SilentlyContinue

Write-Host "" 
Write-Host "=== Installation Complete ===" -ForegroundColor Green
Write-Host "PostgreSQL $Version installed at: $InstallDir\$Version" -ForegroundColor Green
Write-Host "Data directory: $DataDir" -ForegroundColor Green
Write-Host "Port: $Port" -ForegroundColor Green
Write-Host "Superuser password: $Password" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor White
Write-Host "2. Run: node scripts/setup-local-postgres.cjs" -ForegroundColor White
Write-Host ""
Write-Host "To connect to PostgreSQL:" -ForegroundColor Cyan
Write-Host "  psql -U postgres -h localhost -p $Port" -ForegroundColor White
