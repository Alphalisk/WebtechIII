# Lees het token uit het bestand player_token
$playerTokenRaw = Get-Content -Path "create\player_token" -Raw

# Haal alleen het token uit de header (na "Bearer ")
$playerToken = $playerTokenRaw -replace "Authorization: Bearer\s*", ""

# Voeg "Bearer" toe aan het token voor de Authorization-header
$authHeader = "Bearer $playerToken"

# Voer de aanvraag uit om de voorkeuren te wijzigen
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/player/1/preferences" -Method POST -ContentType "application/json" -Headers @{
    Authorization = $authHeader
    Accept = "application/json"
} -Body '{"id":1,"api":"dogs","color_found":"#ff0","color_closed":"#0ff"}'

# Bekijk de inhoud van de reactie
$response.Content