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
const boardSizeSelector = getElement('#boardSize');
const boardSizeMessage = getElement('#boardSizeMessage');

let timeBarInterval = null; // Interval voor de tijdsbalk
const timeBarElement = getElement('.time-bar'); // De tijdsbalk
const maxShowTime = 10000; // Maximale toontijd in milliseconden (3 seconden)
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

    // Bereken het aantal rijen en kolommen op basis van de bordgrootte
    const dimension = Math.sqrt(boardSize);
    grid.style.gridTemplateRows = `repeat(${dimension}, 1fr)`;
    grid.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`;

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
    if (card.classList.contains('open') || card.classList.contains('found')) return;

    // Als er al twee kaarten geopend zijn, draai ze terug, tenzij ze een paar vormen
    if (openedCards.length === 2) {
        closeOpenedCards(); // Draai de twee eerder geopende kaarten terug
    }

    // Toon de afbeelding en voeg de kaart toe aan geopende kaarten
    cardImage.style.display = 'block';
    card.classList.add('open');
    setCardColor(card, 'open', getCardColors());
    openedCards.push(card);

    // Controleer of er twee kaarten zijn geopend
    if (openedCards.length === 2) {
        startTimeBar(); // Start de tijdsbalk na het openen van twee kaarten
        checkForMatch();
        
        // Controleer of het spel voorbij is
        if (foundPairs === images.length / 2) {
            endGame();
        }
    }
}

function closeOpenedCards() {
    clearInterval(timeBarInterval); // Stop de tijdsbalk
    timeBarElement.style.width = '0%'; // Reset de balk
    openedCards.forEach(card => {
        if (!card.classList.contains('found')) {
            const cardImage = card.querySelector('img');
            cardImage.style.display = 'none'; // Verberg de afbeelding
            card.classList.remove('open');
            setCardColor(card, 'closed', getCardColors()); // Reset kleur naar gesloten
        }
    });
    openedCards = []; // Reset de geopende kaarten
}

function checkForMatch() {
    const [card1, card2] = openedCards;
    const img1 = card1.querySelector('img').src;
    const img2 = card2.querySelector('img').src;

    if (img1 === img2) {
        // Markeer als gevonden
        clearInterval(timeBarInterval); // Stop de tijdsbalk
        timeBarElement.style.width = '0%'; // Reset de balk
        card1.classList.add('found');
        card2.classList.add('found');
        setCardColor(card1, 'found', getCardColors());
        setCardColor(card2, 'found', getCardColors());
        foundPairs++;
        updateFoundPairsDisplay();
        openedCards = []; // Reset geopende kaarten
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

// Resterende Tijdbar
function startTimeBar() {
    clearInterval(timeBarInterval); // Stop vorige interval als die bestaat
    timeBarElement.style.width = '0%'; // Reset de balk

    let elapsedTime = 0;
    timeBarInterval = setInterval(() => {
        elapsedTime += 100; // Tel 100ms op
        const percentage = (elapsedTime / maxShowTime) * 100;
        timeBarElement.style.width = `${percentage}%`;

        if (elapsedTime >= maxShowTime) {
            clearInterval(timeBarInterval);
            closeOpenedCards(); // Draai kaarten om na maximale tijd
        }
    }, 100); // Update elke 100ms
}

// Reset het spel
function resetGame() {
    foundPairs = 0;
    openedCards = [];
    resetTimer(); // Reset de timer
    updateFoundPairsDisplay();
    clearInterval(timeBarInterval); // Stop de tijdsbalk
    timeBarElement.style.width = '0%'; // Reset de balk

    // Update de grootte van het bord
    const pairCount = boardSize / 2; // Helften voor paren
    initializeImages(imageSourceSelector.value, pairCount).then(() => {
        buildBoard(); // Bouw het bord opnieuw
    });

    // Verberg de bordgrootte-melding
    boardSizeMessage.style.display = 'none';
}

// Eventlistener voor afbeeldingstype
imageSourceSelector.addEventListener('change', async (event) => {
    const source = event.target.value;
    const pairCount = boardSize / 2;

    await initializeImages(source, pairCount);
    resetGame();
});

// Eventlistener voor het starten van een nieuw spel
startButton.addEventListener('click', () => {
    resetGame(); // Reset het spel
    startTimer(); // Start de timer
});

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

// Eventlistener voor bordgrootte aanpassingen
boardSizeSelector.addEventListener('change', (event) => {
    boardSize = parseInt(event.target.value, 10); // Sla de nieuwe bordgrootte op
    boardSizeMessage.style.display = 'block'; // Toon de melding
});

// Voeg een event listener toe voor de sluitknop
document.querySelector('.close-btn').addEventListener('click', closeModal);

// Voeg een event listener toe om het modaal te sluiten als de gebruiker ergens buiten het modaal klikt
window.addEventListener('click', function(event) {
    const modal = document.getElementById('winModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Initialisatie van het spel
(async function init() {
    const pairCount = boardSize / 2;
    await initializeImages('picsum', pairCount); // Standaard bron is Picsum
    resetGame();
})();
