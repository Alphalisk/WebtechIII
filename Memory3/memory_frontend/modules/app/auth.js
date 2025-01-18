function isTokenExpired(token) {
    if (!token) return true;

    try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        const currentTime = Math.floor(Date.now() / 1000);

        return payload.exp < currentTime;
    } catch (error) {
        console.error('Fout bij het controleren van het token:', error);
        return true; // Beschouw het token als verlopen bij fouten
    }
}

export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('jwt');

    // Controleer of het token verlopen is
    if (isTokenExpired(token)) {
        alert('Je sessie is verlopen. Log opnieuw in.');
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        window.location.href = 'inlog.html';
        return;
    }

    // Voeg de Authorization-header toe
    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${token}`;

    // Maak de fetch-aanroep
    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Als de response een 401 Unauthorized bevat, leid de gebruiker om
    if (response.status === 401) {
        alert('Je sessie is verlopen. Log opnieuw in.');
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        window.location.href = 'inlog.html';
        return;
    }

    return response;
}