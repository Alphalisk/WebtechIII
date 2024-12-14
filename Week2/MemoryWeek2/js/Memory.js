// Variabelen voor spel
let boardSize = 36;  // Het aantal kaarten (6x6 grid)
let letters = [];
let openedCards = [];
let foundPairs = 0;
let startTime;
let timerInterval;

// HTML-elementen
const grid = document.querySelector('.grid-container');
const timerElement = document.querySelector('.timer');
const scoreElement = document.querySelector('.score');
const startButton = document.querySelector('.start-button');

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
        card.style.backgroundColor = '#0d793c'; // Gesloten kaartkleur
        card.textContent = '';  // Geen letter aan het begin
        card.addEventListener('click', handleCardClick);
        grid.appendChild(card);
    }
}

// Timer-functie
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timerElement.textContent = `${elapsedTime} seconden`;
    }, 1000);
}

// Functie voor het klikken op een kaart
function handleCardClick(event) {
    const card = event.target;

    // Negeer klikken op reeds geopende of gevonden kaarten
    if (card.textContent !== '' || openedCards.length === 2) return;

    const cardIndex = card.dataset.index;

    // Toon letter
    card.textContent = letters[cardIndex];
    card.style.backgroundColor = '#1deb76'; // Open kaartkleur

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
        card1.style.backgroundColor = '#c026a9';
        card2.style.backgroundColor = '#c026a9';
        foundPairs++;
    } else {
        // Als de kaarten niet overeenkomen, draai ze weer om
        card1.style.backgroundColor = '#0d793c';
        card2.style.backgroundColor = '#0d793c';
        card1.textContent = '';
        card2.textContent = '';
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
    alert(`Gefeliciteerd! Je hebt het spel in ${Math.floor((Date.now() - startTime) / 1000)} seconden voltooid.`);
}

// Functie om het spel opnieuw te starten
function resetGame() {
    foundPairs = 0;
    openedCards = [];
    letters = [];
    generateRandomLetters();
    buildBoard();
    clearInterval(timerInterval);
    timerElement.textContent = '0 seconden';
    startTimer();
}

// Start het spel als de speler op de startknop klikt
startButton.addEventListener('click', resetGame);

// Initialiseer het spel
generateRandomLetters();
buildBoard();
