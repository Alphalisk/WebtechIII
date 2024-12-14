/*
Hier worden alle variabelen gedeclareerd en eventueel geinitialiseerd.
*/

// Variabelen voor spel
let boardSize = 36;  // Het aantal kaarten (6x6 grid)
let letters = [];
let openedCards = [];
let foundPairs = 0;
let startTime;
let timerInterval;

// Verkrijg de kleurkeuzers uit de DOM
const kaartkleurInput = document.getElementById('kaartkleur');
const openKleurInput = document.getElementById('open');
const gevondenKleurInput = document.getElementById('gevonden');

// HTML-elementen
const grid = document.querySelector('.grid-container');
const timerElement = document.querySelector('.timer');
const scoreElement = document.querySelector('.score');
const startButton = document.querySelector('.start-button');


/*
Hier is een verzameling van alle gebruikte functies.
*/

// Functie om willekeurige letters te genereren
function generateRandomLetters() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let pickedLetters = [];
    
    // Bepaal hoeveel letters we nodig hebben (helft van het aantal kaarten)
    let halfSize = boardSize / 2;

    // Kies willekeurige letters zonder herhaling
    while (pickedLetters.length < halfSize) {
        let letter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!pickedLetters.includes(letter)) {
            pickedLetters.push(letter);
        }
    }

    // Verdubbel de letters om paren te maken
    letters = [...pickedLetters, ...pickedLetters];
    // Schud de letters
    letters.sort(() => Math.random() - 0.5);
}

// Functie om het bord te bouwen
function buildBoard() {
    grid.innerHTML = ''; // Leeg het bord

    // Maak de kaarten aan
    for (let i = 0; i < boardSize; i++) {
        const card = document.createElement('div');
        card.classList.add('grid-item');
        card.dataset.index = i;
        card.style.backgroundColor = kaartkleurInput.value || '#0d793c'; // Gesloten kaartkleur
        card.textContent = '◆';  // Geen letter aan het begin
        card.addEventListener('click', handleCardClick);
        grid.appendChild(card);
    }

    // Pas de kleuren van de kaarten aan zodra ze zijn toegevoegd
    applyCardColors();
}

// Timer-functie
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `${elapsedTime} seconden`;
    }, 1000);
}

// Functie om het aantal gevonden kaartparen weer te geven
function updateFoundPairsDisplay() {
    const foundPairsDisplay = document.getElementById('foundPairsDisplay');
    foundPairsDisplay.textContent = foundPairs;  // Update de display met de nieuwe waarde
}

// Functie om de kleuren toe te passen
function applyCardColors() {
    // Verkrijg de geselecteerde kleuren
    const kaartkleur = kaartkleurInput.value;
    const openKleur = openKleurInput.value;
    const gevondenKleur = gevondenKleurInput.value;

    // Verkrijg alle grid-items (de kaarten)
    const gridItems = grid.querySelectorAll('.grid-item');

    gridItems.forEach(item => {
        // Stel de kleur van de gesloten kaarten in
        if (!item.classList.contains('open') && !item.classList.contains('gevonden')) {
            item.style.backgroundColor = kaartkleur;
        }

        // Stel de kleur van de open kaarten in
        if (item.classList.contains('open')) {
            item.style.backgroundColor = openKleur;
        }

        // Stel de kleur van de gevonden kaarten in
        if (item.classList.contains('gevonden')) {
            item.style.backgroundColor = gevondenKleur;
        }
    });
}

// Functie voor het klikken op een kaart
function handleCardClick(event) {
    const card = event.target;

    // Negeer klikken op reeds geopende of gevonden kaarten
    if (card.textContent !== '◆' || openedCards.length === 2) return;

    const cardIndex = card.dataset.index;

    // Toon letter
    card.textContent = letters[cardIndex];
    card.style.backgroundColor = openKleurInput.value || '#1deb76'; // Open kaartkleur

    // Voeg de kaart toe aan de lijst van geopende kaarten
    openedCards.push(card);

    // Als dit de eerste kaart is, start de timer
    if (openedCards.length === 1 && !timerInterval) {
        startTimer();
    }

    // Als er twee kaarten zijn geopend, vergelijk ze
    if (openedCards.length === 2) {
        setTimeout(compareCards, 500);
    }
}

// Vergelijk de twee geopende kaarten
function compareCards() {
    const [card1, card2] = openedCards;

    if (card1.textContent === card2.textContent) {
        // Als de kaarten overeenkomen, markeer ze als gevonden
        card1.style.backgroundColor = gevondenKleurInput.value || '#c026a9';
        card2.style.backgroundColor = gevondenKleurInput.value || '#c026a9';
        card1.classList.add('gevonden');
        card2.classList.add('gevonden');
        foundPairs++;
        updateFoundPairsDisplay();
    } else {
        // Als de kaarten niet overeenkomen, draai ze weer om
        card1.style.backgroundColor = kaartkleurInput.value || '#0d793c';
        card2.style.backgroundColor = kaartkleurInput.value || '#0d793c';
        card1.textContent = '◆';
        card2.textContent = '◆';
    }

    // Reset de geopende kaarten
    openedCards = [];

    // Controleer of het spel voorbij is
    if (foundPairs === boardSize / 2) {
        endGame();
    }
}

// Eindig het spel
function endGame() {
    clearInterval(timerInterval);

    // Haal de tijd op
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    // Toon het tijdstip in het modale venster
    document.getElementById('final-time').textContent = timeTaken;

    // Zet het modaal venster in de "zichtbaar" status
    const modal = document.getElementById('winModal');
    modal.style.display = 'block'; // Maak het modaal zichtbaar
}

// Functie om het modale venster te sluiten wanneer de gebruiker op de sluitknop klikt
function closeModal() {
    const modal = document.getElementById('winModal');
    modal.style.display = 'none'; // Verberg het modaal
}

// Functie om het spel opnieuw te starten
function resetGame() {
    foundPairs = 0;
    updateFoundPairsDisplay();
    openedCards = [];
    letters = [];
    generateRandomLetters();
    buildBoard();
    clearInterval(timerInterval);
    timerElement.textContent = '0 seconden';
    startTimer();
}



/*
Hier is een verzameling van eventlisteners.
*/

// Voeg event listeners toe om de kleuren toe te passen wanneer ze worden gewijzigd
kaartkleurInput.addEventListener('input', applyCardColors);
openKleurInput.addEventListener('input', applyCardColors);
gevondenKleurInput.addEventListener('input', applyCardColors);

// Roep de functie aan bij het laden van de pagina om de initiële kleuren toe te passen
window.addEventListener('load', applyCardColors);

// Voeg een event listener toe voor de sluitknop
document.querySelector('.close-btn').addEventListener('click', closeModal);

// Voeg een event listener toe om het modaal te sluiten als de gebruiker ergens buiten het modaal klikt
window.addEventListener('click', function(event) {
    const modal = document.getElementById('winModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Start het spel als de speler op de startknop klikt
startButton.addEventListener('click', resetGame);



/*
Dit zijn de initialisaties voor het javascript zelf.
*/

// Initialiseer het spel
generateRandomLetters();
buildBoard();
