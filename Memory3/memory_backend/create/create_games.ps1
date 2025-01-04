# Haal de JWT op
$jwt = Get-Content -Path "create/admin_token" -Raw | Out-String
$jwt = $jwt -replace "Authorization: Bearer ", ""

# Headers instellen
$headers = @{
    "Authorization" = "Bearer $jwt";
    "Content-Type" = "application/json"
}

# Game-aanvragen
$games = @(
    '{"id":1,"score":123}',
    '{"id":2,"score":312}',
    '{"id":3,"score":412}',
    '{"id":4,"score":231}',
    '{"id":1,"score":321,"api":"dogs","color_found":"red","color_closed":"rebeccapurple"}',
    '{"id":2,"score":312,"api":"cats","color_found":"green","color_closed":"yellow"}',
    '{"id":3,"score":131,"api":"clouds","color_found":"blue","color_closed":"black"}',
    '{"id":4,"score":412,"api":"people","color_found":"rebeccapurple","color_closed":"white"}'
)

# Verstuur de requests
foreach ($game in $games) {
    try {
        Write-Output "Versturen van game: $game"
        $response = Invoke-WebRequest -Uri "http://localhost:8000/game/save" -Method POST -Headers $headers -Body $game
        Write-Output "Game succesvol opgeslagen: $($response.Content)"
    } catch {
        Write-Error "Fout bij opslaan van game: $game"
        Write-Error $_.Exception.Message
        if ($_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            if ($errorStream) {
                $errorContent = (New-Object IO.StreamReader $errorStream).ReadToEnd()
                Write-Error "Server reactie: $errorContent"
            }
        }
    }
}
