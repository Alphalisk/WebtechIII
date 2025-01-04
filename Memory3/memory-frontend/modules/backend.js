document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Voorkomt standaard formulierverzending

    // Haal formuliergegevens op
    const form = event.target;
    const username = form.querySelector('input[name="username"]').value;
    const password = form.querySelector('input[name="password"]').value;

    try {
        // Verstuur login verzoek naar de backend
        const response = await fetch('http://localhost:8000/api/login_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                displayMessage('Ongeldige gebruikersnaam of wachtwoord.', 'error');
            } else {
                displayMessage('Er is een fout opgetreden bij het inloggen.', 'error');
            }
            throw new Error(`HTTP-fout: ${response.status}`);
        }

        const data = await response.json();

        // Sla JWT op in localStorage
        localStorage.setItem('jwt', data.token);

        // Succesmelding
        displayMessage('Succesvol ingelogd!', 'success');

        // Optioneel: Haal spellen op voor de ingelogde speler
        const playerId = 1; // Vervang dit met een daadwerkelijke speler-ID
        const gamesResponse = await fetch(`http://localhost:8000/api/player/${playerId}/games`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${data.token}`,
                'Accept': 'application/json',
            },
        });

        if (gamesResponse.ok) {
            const games = await gamesResponse.json();
            displayGames(games);
        } else {
            displayMessage('Kon spellen niet ophalen.', 'error');
        }
    } catch (error) {
        console.error('Fout:', error.message);
    }
});

function displayMessage(message, type) {
    const messageBar = document.createElement('div');
    messageBar.textContent = message;
    messageBar.style.position = 'fixed';
    messageBar.style.top = '0';
    messageBar.style.left = '0';
    messageBar.style.width = '100%';
    messageBar.style.padding = '10px';
    messageBar.style.color = 'white';
    messageBar.style.textAlign = 'center';
    messageBar.style.zIndex = '1000';

    if (type === 'success') {
        messageBar.style.backgroundColor = '#04AA6D';
    } else if (type === 'error') {
        messageBar.style.backgroundColor = 'red';
    }

    document.body.appendChild(messageBar);

    setTimeout(() => {
        messageBar.remove();
    }, 3000);
}

function displayGames(games) {
    const gamesContainer = document.getElementById('games');
    gamesContainer.innerHTML = ''; // Wis bestaande spellen

    games.forEach((game, index) => {
        const gameElement = document.createElement('div');
        gameElement.textContent = `Spel ${index + 1}: Score - ${game.score}, Datum - ${new Date(game.date).toLocaleDateString('nl-NL')}`;
        gamesContainer.appendChild(gameElement);
    });
}
