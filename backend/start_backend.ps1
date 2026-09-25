# FraudShield AI - Backend Startup Script
# Uses the C:\FraudShieldVenv virtual environment (outside OneDrive to avoid file-lock issues)

$env:TF_ENABLE_ONEDNN_OPTS = "0"
$env:TF_CPP_MIN_LOG_LEVEL = "3"

$PythonExe = Join-Path $PSScriptRoot "venv\Scripts\python.exe"

Write-Host "Starting FraudShield AI Backend..." -ForegroundColor Cyan
Write-Host "Python: $PythonExe" -ForegroundColor Gray

& $PythonExe run.py
