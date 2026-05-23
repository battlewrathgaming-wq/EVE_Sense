$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$tmpRoot = Join-Path $projectRoot ".tmp"
$cacheRoot = Join-Path $tmpRoot "cache"
$smokeRoot = Join-Path $tmpRoot "electron-visual-smoke"
$smokeUserData = Join-Path $smokeRoot "user-data"

New-Item -ItemType Directory -Force -Path $tmpRoot, $cacheRoot, $smokeRoot | Out-Null

Get-ChildItem -LiteralPath $smokeRoot -Force | Remove-Item -Recurse -Force
New-Item -ItemType Directory -Force -Path $smokeUserData | Out-Null

$env:AURA_SENSE_ELECTRON_VISUAL_SMOKE = "1"
$env:AURA_SENSE_VISUAL_SMOKE_DIR = $smokeRoot
$env:AURA_SENSE_USER_DATA_DIR = $smokeUserData
$env:AURA_SENSE_TEST_TMP = $tmpRoot
$env:npm_config_cache = Join-Path $cacheRoot "npm"

Set-Location -LiteralPath $projectRoot

@{
  status = "launched"
  launched_at = (Get-Date).ToUniversalTime().ToString("o")
  project_root = "$projectRoot"
  smoke_dir = "$smokeRoot"
  user_data_dir = "$smokeUserData"
  smoke_flag = $env:AURA_SENSE_ELECTRON_VISUAL_SMOKE
} | ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $smokeRoot "visual-smoke-launch.json")

npm.cmd run start -- "--aura-sense-electron-visual-smoke" "--aura-sense-visual-smoke-dir=$smokeRoot"

$startExitCode = $LASTEXITCODE
$resultPath = Join-Path $smokeRoot "visual-smoke-result.json"
if (-not (Test-Path -LiteralPath $resultPath)) {
  @{
    status = "failed"
    checked_at = (Get-Date).ToUniversalTime().ToString("o")
    message = "Electron smoke exited without visual-smoke-result.json"
    start_exit_code = $startExitCode
    smoke_dir = "$smokeRoot"
  } | ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath $resultPath
  exit 1
}

exit $startExitCode
