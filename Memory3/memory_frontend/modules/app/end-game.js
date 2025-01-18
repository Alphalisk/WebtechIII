import { fetchWithAuth } from './auth.js';
import { refreshTopFive } from './scores.js';

// Eindig het spel
export async function endGame(startTime) {

    // Bereken de speeltijd
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('final-time').textContent = timeTaken;

    // Haal de token en de gebruikers-ID uit localStorage
    const token = localStorage.getItem('jwt');
    const username = localStorage.getItem('username');

    if (!token || !username) {
        alert('Je moet ingelogd zijn om het spel op te slaan.');
        return;
    }

    // Vraag API en kaartkleuren op uit de DOM
    const api = document.getElementById('imageSource').value;
    const colorClosed = document.getElementById('kaartkleur').value;
    const colorFound = document.getElementById('gevonden').value;

    // Maak het payload object voor de game
    const gameData = {
        id: localStorage.getItem('userId'), // Vervang door echte speler-ID indien nodig
        score: timeTaken,
        api: api,
        color_closed: colorClosed,
        color_found: colorFound,
    };

    try {
        const response = await fetchWithAuth('http://localhost:8000/game/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(gameData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Game succesvol opgeslagen:', result);
            alert('Je spel is succesvol opgeslagen!');

            // Ververs de top 5 scores en gemiddelde score
            await refreshTopFive();
        } else {
            console.error('Fout bij het opslaan van de game:', await response.text());
            alert('Er is een probleem opgetreden bij het opslaan van je spel.');
        }
    } catch (error) {
        console.error('Fout tijdens het opslaan van de game:', error);
        alert('Er is een probleem opgetreden bij het opslaan van je spel.');
    }

    // Toon het modale venster
    const modal = document.getElementById('winModal');
    modal.style.display = 'block';

    // Voeg een event listener toe om het modaal te sluiten als de gebruiker ergens buiten het modaal klikt
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('winModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Voeg een event listener toe voor de sluitknop
    document.querySelector('.close-btn').addEventListener('click', closeModal);
}

// Functie om het modale venster te sluiten wanneer de gebruiker op de sluitknop klikt
function closeModal() {
    const modal = document.getElementById('winModal');
    modal.style.display = 'none'; // Verberg het modaal
}