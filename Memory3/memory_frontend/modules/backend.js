document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Haal de top 5 scores op vanuit de backend
        const scoresResponse = await fetch('http://localhost:8000/scores', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (scoresResponse.ok) {
            const scores = await scoresResponse.json();
            updateTopFive(scores);
        } else {
            console.error('Kon de top 5 scores niet ophalen.');
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

function updateTopFive(scores) {
    const highscoreList = document.querySelector('aside ol'); // Verwijzing naar de lijst in de HTML
    highscoreList.innerHTML = ''; // Wis de huidige lijst

    scores
        .sort((a, b) => b.score - a.score) // Sorteer op score, aflopend
        .slice(0, 5) // Pak de top 5
        .forEach(score => {
            const listItem = document.createElement('li');
            listItem.textContent = `${score.username}: ${score.score}`;
            highscoreList.appendChild(listItem);
        });
}
