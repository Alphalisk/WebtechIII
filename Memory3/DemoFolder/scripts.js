document.getElementById('submit').addEventListener('click', function (event) {
    event.preventDefault(); // Voorkomt standaard formulierverzending

    // Haal formuliergegevens op
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');

    // Verstuur login verzoek naar de backend
    fetch('http://localhost:8000/api/login_check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // JWT ontvangen
            } else if (response.status === 401) {
                // Voeg een groene balk toe aan de bovenkant van de pagina
                const messageBar = document.createElement('div');
                messageBar.textContent = 'Foute Gegevens Jonguh!';
                messageBar.style.position = 'fixed';
                messageBar.style.top = '0';
                messageBar.style.left = '0';
                messageBar.style.width = '100%';
                messageBar.style.backgroundColor = 'red';
                messageBar.style.color = 'white'; // Witte tekst
                messageBar.style.textAlign = 'center';
                messageBar.style.padding = '10px';
                messageBar.style.zIndex = '1000';
                document.body.appendChild(messageBar);

                // Verwijder de balk na 3 seconden
                setTimeout(() => {
                    messageBar.remove();
                }, 3000);
                throw new Error('Ongeldige gebruikersnaam of wachtwoord.');
            } else {
                throw new Error('Er is een fout opgetreden bij het inloggen.');
            }
        })
        .then(data => {
            console.log('JWT ontvangen:', data.token);

            // Sla het token op in de localStorage
            localStorage.setItem('jwt', data.token);

            // Voeg een groene balk toe aan de bovenkant van de pagina
            const messageBar = document.createElement('div');
            messageBar.textContent = 'U bent ingelogd!';
            messageBar.style.position = 'fixed';
            messageBar.style.top = '0';
            messageBar.style.left = '0';
            messageBar.style.width = '100%';
            messageBar.style.backgroundColor = '#04AA6D'; // Groen
            messageBar.style.color = 'white'; // Witte tekst
            messageBar.style.textAlign = 'center';
            messageBar.style.padding = '10px';
            messageBar.style.zIndex = '1000';
            document.body.appendChild(messageBar);

            // Verwijder de balk na 3 seconden
            setTimeout(() => {
                messageBar.remove();
            }, 3000);

            // Haal spellen op voor een specifieke speler (ID handmatig instellen)
            const playerId = 1; // Zet hier een bestaande speler-ID
            return fetch(`http://localhost:8000/api/player/${playerId}/games`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.token}`,
                    'Accept': 'application/json',
                },
            });
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Ontvang spellen
            } else {
                throw new Error('Kon spellen niet ophalen.');
            }
        })
        .then(games => {
            // Toon spellen onder het login-formulier
            const table = document.getElementById('players');
            table.style.display = 'table'; // Maak de tabel zichtbaar
            const template = document.getElementById('scores');

            games.forEach((game, index) => {
                const clone = template.content.cloneNode(true);
                clone.querySelector('th').textContent = index + 1;
                clone.querySelector('.naam').textContent = game.username || 'Onbekend'; // Zet username als beschikbaar
                clone.querySelector('.score').textContent = game.score;

                // Formatteer de datum
                const formattedDate = new Date(game.date).toLocaleDateString('nl-NL', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                const dateCell = document.createElement('td');
                dateCell.textContent = formattedDate;
                clone.appendChild(dateCell);

                table.appendChild(clone);
            });
        })
        .catch(error => {
            console.error('Fout:', error.message);
            alert(error.message);
        });
});

// Rode lijnen verwijderen bij nieuwe invoer
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
        input.classList.remove('error');
    });
});
