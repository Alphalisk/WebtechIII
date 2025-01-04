try {
    # Verzoek om in te loggen met verkeerde credentials
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/login_check" -Method POST -ContentType "application/json" -Body '{"username":"Maximiliaan de Grote","password":"ome Henk"}'
    
    # Controleer of de reactie een foutmelding bevat
    if ($response.StatusCode -eq 401) {
        Write-Output "Login mislukt: Ongeldige credentials."
    } else {
        Write-Output "Onverwachte respons: $($response.Content)"
    }
} catch [System.Net.WebException] {
    # Afhandelen van een HTTP 401-fout
    $httpResponse = $_.Exception.Response
    if ($httpResponse.StatusCode -eq 401) {
        Write-Output "Login mislukt: Ongeldige credentials (401 Unauthorized)."
    } else {
        Write-Output "Er is een fout opgetreden: $($_.Exception.Message)"
    }
} catch {
    Write-Output "Onverwachte fout: $($_.Exception.Message)"
}
