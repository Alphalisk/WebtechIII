# Login als admin
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/login_check" -Method POST -ContentType "application/json" -Body '{"username":"Henk","password":"henk"}'

# Haal de JWT uit de JSON-reactie
$jwt = ($response.Content | ConvertFrom-Json).token

# Sla de JWT op in een bestand genaamd "admin_token"
"Authorization: Bearer $jwt" | Set-Content -Path "create\admin_token"

# Bevestig dat het token is opgeslagen
Write-Output "Token opgeslagen in admin_token bestand: Authorization: Bearer $jwt"
