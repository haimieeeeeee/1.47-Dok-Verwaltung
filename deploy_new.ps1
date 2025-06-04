# PowerShell Deployment Script für Google Apps Script
# Dok-Verwaltung Optimized Version

Write-Host "🚀 Deploying optimized Dok-Verwaltung to Google Apps Script..." -ForegroundColor Green

# Prüfe ob clasp installiert ist
$claspExists = Get-Command clasp -ErrorAction SilentlyContinue
if (-not $claspExists) {
    Write-Host "❌ clasp ist nicht installiert. Installiere mit: npm install -g @google/clasp" -ForegroundColor Red
    exit 1
}

# Prüfe Login-Status
$loginStatus = clasp login --status 2>&1
if ($loginStatus -match "not logged in") {
    Write-Host "❌ Nicht bei Google Apps Script angemeldet. Führe 'clasp login' aus." -ForegroundColor Red
    exit 1
}

Write-Host "✅ clasp Login-Status OK" -ForegroundColor Green

# Push zum Google Apps Script
Write-Host "📤 Pushing files to Google Apps Script..." -ForegroundColor Yellow

clasp push --force
$success = $?

if ($success) {
    Write-Host "✅ Files erfolgreich gepusht!" -ForegroundColor Green
    
    # Öffne das Projekt im Browser
    Write-Host "🌐 Öffne Google Apps Script Editor..." -ForegroundColor Yellow
    clasp open
    
    Write-Host "`n🎉 Deployment abgeschlossen!" -ForegroundColor Green
    Write-Host "📋 Script ID: 1xcIzHliDMXBz3-rUugxHretJdbfnlBjITa3xvjfg6YrYeUKa4XC2zbpj" -ForegroundColor Cyan
    Write-Host "🔗 Apps Script: https://script.google.com/u/0/home/projects/1xcIzHliDMXBz3-rUugxHretJdbfnlBjITa3xvjfg6YrYeUKa4XC2zbpj/edit" -ForegroundColor Cyan
    Write-Host "📊 Sheet: https://docs.google.com/spreadsheets/d/1lJ_wyyJuGAMQDbtmvBn9mtzwbGOPpnBbaFgOTQp_Z84/edit" -ForegroundColor Cyan
} 
else {
    Write-Host "❌ Fehler beim Push!" -ForegroundColor Red
    exit 1
}
