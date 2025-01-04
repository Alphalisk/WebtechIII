# Login en krijg de JWT
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/login_check" -Method POST -ContentType "application/json" -Body '{"username":"Chantal","password":"chantal"}'

# Haal de JWT uit de JSON-reactie
$jwt = ($response.Content | ConvertFrom-Json).token

# Sla de JWT op in een bestand genaamd "player_token"
"Authorization: Bearer $jwt" | Set-Content -Path "create\player_token"

# Bevestig dat het token is opgeslagen
Write-Output "Token opgeslagen in player_token bestand: Authorization: Bearer $jwt"
