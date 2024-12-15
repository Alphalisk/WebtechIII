import { fetchImages } from './api.js';
import { setCardColor, shuffleArray, getElement, resetCards, formatTime  } from './utilities.js';

// DOM-elementen en globale variabelen
const grid = getElement('.grid-container');
const kaartkleurInput = getElement('#kaartkleur');
const openKleurInput = getElement('#open');
const gevondenKleurInput = getElement('#gevonden');
const imageSourceSelector = getElement('#imageSource');
const foundPairsDisplay = getElement('#foundPairsDisplay');
const startButton = getElement('.start-button');

let timerInterval = null;
let startTime = null;
let boardSize = 36; // Standaard 6x6
let openedCards = [];
let foundPairs = 0;
let images = [];

// Start de timer
function startTimer() {
    if (timerInterval) return; // Timer al gestart

    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const timerElement = document.querySelector('.timer');
        timerElement.textContent = formatTime(elapsedTime);
    }, 1000);
}

// Stop de timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Reset de timer
function resetTimer() {
    stopTimer();
    const timerElement = document.querySelector('.timer');
    timerElement.textContent = '00:00';
}

// Functie om afbeeldingen te laden
async function initializeImages(source, pairCount) {
    try {
        const fetchedImages = await fetchImages(source, pairCount);
        images = shuffleArray([...fetchedImages, ...fetchedImages]); // Verdubbel en schud
    } catch (error) {
        console.error('Fout bij het ophalen van afbeeldingen:', error);
    }
}

// Functie om het bord te bouwen
function buildBoard() {
    grid.innerHTML = ''; // Leeg het bord

    images.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('grid-item');
        card.dataset.index = index;

        // Stel de standaardkleur in
        setCardColor(card, 'closed', getCardColors());

        // Voeg afbeelding toe (verborgen)
        card.innerHTML = `<img src="${image}" alt="Memory card" style="display: none; width: 100%; height: 100%;">`;

        // Voeg klikfunctionaliteit toe
        card.addEventListener('click', () => handleCardClick(card));

        grid.appendChild(card);
    });
}

// Functie om kleuren op te halen uit de inputs
function getCardColors() {
    return {
        closed: kaartkleurInput.value || '#0d793c',
        open: openKleurInput.value || '#1deb76',
        found: gevondenKleurInput.value || '#c026a9',
    };
}

// Klikhandler voor een kaart
function handleCardClick(card) {
    startTimer(); // Timer starten bij eerste klik
    
    const cardImage = card.querySelector('img');

    // Controleer of de kaart al geopend is
    if (card.classList.contains('open') || card.classList.contains('found') || openedCards.length === 2) return;

    // Toon de afbeelding en voeg de kaart toe aan geopende kaarten
    cardImage.style.display = 'block';
    card.classList.add('open');
    setCardColor(card, 'open', getCardColors());
    openedCards.push(card);

    // Controleer of er twee kaarten zijn geopend
    if (openedCards.length === 2) {
        setTimeout(compareCards, 500);
    }
}

// Vergelijk de geopende kaarten
function compareCards() {
    const [card1, card2] = openedCards;
    const img1 = card1.querySelector('img').src;
    const img2 = card2.querySelector('img').src;

    if (img1 === img2) {
        // Markeer als gevonden
        card1.classList.add('found');
        card2.classList.add('found');
        setCardColor(card1, 'found', getCardColors());
        setCardColor(card2, 'found', getCardColors());
        foundPairs++;
        updateFoundPairsDisplay();
    } else {
        // Draai kaarten terug
        card1.classList.remove('open');
        card2.classList.remove('open');
        card1.querySelector('img').style.display = 'none';
        card2.querySelector('img').style.display = 'none';
        setCardColor(card1, 'closed', getCardColors());
        setCardColor(card2, 'closed', getCardColors());
    }

    openedCards = [];

    // Controleer of het spel voorbij is
    if (foundPairs === images.length / 2) {
        endGame();
    }
}

// Update de gevonden paren in de UI
function updateFoundPairsDisplay() {
    foundPairsDisplay.textContent = foundPairs;
}

// Eindig het spel
function endGame() {
    stopTimer(); // Stop de timer
    alert(`Gefeliciteerd! Je hebt het spel voltooid met ${foundPairs} paren.`);
    resetGame();
}

// Reset het spel
function resetGame() {
    foundPairs = 0;
    openedCards = [];
    resetTimer(); // Reset de timer
    updateFoundPairsDisplay();
    buildBoard();
}

// Eventlistener voor afbeeldingstype
imageSourceSelector.addEventListener('change', async (event) => {
    const source = event.target.value;
    const pairCount = boardSize / 2;

    await initializeImages(source, pairCount);
    resetGame();
});

// Eventlistener voor het starten van een nieuw spel
startButton.addEventListener('click', resetGame);

// Eventlistener voor kleuraanpassingen
[kaartkleurInput, openKleurInput, gevondenKleurInput].forEach(input => {
    input.addEventListener('input', () => {
        const cards = Array.from(grid.querySelectorAll('.grid-item'));
        cards.forEach(card => {
            if (!card.classList.contains('open') && !card.classList.contains('found')) {
                setCardColor(card, 'closed', getCardColors());
            }
        });
    });
});

// Initialisatie van het spel
(async function init() {
    const pairCount = boardSize / 2;
    await initializeImages('picsum', pairCount); // Standaard bron is Picsum
    resetGame();
})();
