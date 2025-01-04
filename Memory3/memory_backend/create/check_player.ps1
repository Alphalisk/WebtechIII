# Lees de inhoud van het bestand player_token
$playerTokenRaw = Get-Content -Path "create\player_token" -Raw

# Haal alleen het token uit de header (na "Bearer ")
$playerToken = $playerTokenRaw -replace "Authorization: Bearer\s*", ""

# Voeg "Bearer" toe aan het token voor de Authorization-header
$authHeader = "Bearer $playerToken"

# Voer de aanvraag uit
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/player/1/games" -Method GET -Headers @{
    Authorization = $authHeader
    Accept = "application/json"
}

# Bekijk de inhoud van de reactie
$response.Content
