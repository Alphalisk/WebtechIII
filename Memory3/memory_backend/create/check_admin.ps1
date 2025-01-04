# Lees het token uit het bestand admin_token
$adminTokenRaw = Get-Content -Path "create\admin_token" -Raw

# Haal alleen het token uit de header (na "Bearer ")
$adminToken = $adminTokenRaw -replace "Authorization: Bearer\s*", ""

# Voeg "Bearer" toe aan het token voor de Authorization-header
$authHeader = "Bearer $adminToken"

# Voer de aanvraag uit om de admin-gegevens op te halen
$response = Invoke-WebRequest -Uri "http://localhost:8000/api/admin/aggregate" -Method GET -Headers @{
    Authorization = $authHeader
    Accept = "application/json"
}

# Bekijk de inhoud van de reactie
$response.Content
