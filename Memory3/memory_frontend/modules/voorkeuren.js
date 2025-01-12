document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId'); // Zorg dat dit is ingesteld bij inloggen

    if (!token || !userId) {
        alert('Je moet ingelogd zijn om voorkeuren te bekijken.');
        window.location.href = 'inlog.html';
        return;
    }

    // Haal bestaande voorkeuren op
    try {
        const response = await fetch(`http://localhost:8000/api/player/${userId}/preferences`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('api').value = data.preferred_api || 'picsum';
            document.getElementById('kaartkleur').value = data.color_closed || '#1deb76';
            document.getElementById('color_found').value = data.color_found || '#c026a9';
        } else {
            console.error('Fout bij ophalen van voorkeuren.');
        }
    } catch (error) {
        console.error('Fout:', error.message);
    }
});

document.getElementById('preferences-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId');

    const api = document.getElementById('api').value;
    const color_closed = document.getElementById('kaartkleur').value;
    const color_found = document.getElementById('color_found').value;

    try {
        const response = await fetch(`http://localhost:8000/api/player/${userId}/preferences`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId,
                api: api,
                color_closed: color_closed,
                color_found: color_found,
            }),
        });

        const messageElement = document.getElementById('message');

        if (response.ok) {
            messageElement.textContent = 'Voorkeuren succesvol opgeslagen! Je wordt teruggebracht naar de hoofdpagina...';
            messageElement.className = 'message success';

            // Wacht 2 seconden en navigeer naar index.html
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            messageElement.textContent = 'Er is een fout opgetreden bij het opslaan van voorkeuren.';
            messageElement.className = 'message error';
        }

        messageElement.style.display = 'block';
    } catch (error) {
        console.error('Fout:', error.message);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Er is een fout opgetreden bij het opslaan van voorkeuren.';
        messageElement.className = 'message error';
        messageElement.style.display = 'block';
    }
});