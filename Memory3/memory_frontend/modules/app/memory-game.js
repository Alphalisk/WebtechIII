// Imports
import { fetchImages } from './api.js';
import { endGame } from './end-game.js';
import { checkLoginStatus } from './user-login.js';
import { applyUserPreferences } from './user-preferences.js';
import { setCardColor, shuffleArray, getElement, formatTime  } from './utilities.js';

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

// Variabelen
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
let timeBarInterval = null; // Interval voor de tijdsbalk
const timeBarElement = getElement('.time-bar'); // De tijdsbalk
const maxShowTime = 3000; // Maximale toontijd in milliseconden (3 seconden)
let boardSize = 36; // Standaard 6x6
let openedCards = [];
let foundPairs = 0;
let images = [];
let startTime = null;
let timerInterval = null;

// Functie om afbeeldingen te laden
async function initializeImages(source, pairCount) {
    try {
        const fetchedImages = await fetchImages(source, pairCount);
        images = shuffleArray([...fetchedImages, ...fetchedImages]); // Verdubbel en schud
    } catch (error) {
        console.error('Fout bij het ophalen van afbeeldingen:', error);
    }
}

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
            clearInterval(timerInterval);
            endGame(startTime);
            updateAverageTimeUI();
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

// Update de gevonden paren in de UI
function updateFoundPairsDisplay() {
    foundPairsDisplay.textContent = foundPairs;
}

// gemiddelde speeltijd van gebruiker berekenen
function calculateAverageTime() {
    const playtimes = JSON.parse(localStorage.getItem('playtimes')) || [];
    if (playtimes.length === 0) return 0;

    const total = playtimes.reduce((sum, time) => sum + time, 0);
    return Math.floor(total / playtimes.length);
}

// UI gemiddelde speeltijd gebruiker weergeven
function updateAverageTimeUI() {
    const averageTime = calculateAverageTime();
    const averageTimeElement = document.getElementById('averageTime');
    averageTimeElement.textContent = `${averageTime}s`;
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

// Logica voor het resetten van het spel
document.querySelector('.reset-button').addEventListener('click', () => {
    resetGame(); // Reset het spel
});

// Een Eventlistener voor een API-update met nieuwe afbeeldingen.
imageSourceSelector.addEventListener('change', async (event) => {
    const newSource = event.target.value;
    await updateImages(newSource); // Werk de afbeeldingen bij
});

// Hiermee wordt het bord geupdate met nieuwe afbeeldingen bij een wijziging van API.
async function updateImages(newSource) {
    try {
        const pairCount = boardSize / 2; // Het aantal unieke paren
        const fetchedImages = await fetchImages(newSource, pairCount); // Nieuwe afbeeldingen ophalen

        // Maak een array van unieke afbeeldingen (één per paar)
        const uniqueImages = shuffleArray([...fetchedImages]);

        // Map voor kaartparen naar nieuwe afbeeldingen
        const pairMapping = {};
        let assignedPairs = 0;

        // Bepaal welke kaarten een paar vormen
        images.forEach((_, index) => {
            if (!pairMapping.hasOwnProperty(index)) {
                // Zoek het bijbehorende paar
                for (let j = index + 1; j < images.length; j++) {
                    if (!pairMapping.hasOwnProperty(j) && images[index] === images[j]) {
                        // Wijs beide kaarten dezelfde unieke afbeelding toe
                        pairMapping[index] = uniqueImages[assignedPairs];
                        pairMapping[j] = uniqueImages[assignedPairs];
                        assignedPairs++;
                        break;
                    }
                }
            }
        });

        // Update de afbeeldingen op het bord
        images.forEach((_, index) => {
            const card = grid.querySelector(`[data-index="${index}"]`);
            const cardImage = card.querySelector('img');

            // Update de afbeelding met de nieuwe afbeelding uit de mapping
            cardImage.src = pairMapping[index];

            // Toon of verberg de afbeelding afhankelijk van de status van de kaart
            if (card.classList.contains('open') || card.classList.contains('found')) {
                cardImage.style.display = 'block';
            } else {
                cardImage.style.display = 'none';
            }
        });

        // Werk de globale afbeeldingen bij
        images = [...grid.querySelectorAll('.grid-item img')].map(img => img.src);
    } catch (error) {
        console.error('Fout bij het updaten van afbeeldingen:', error);
    }
}

if (message === 'success') {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = 'Je bent succesvol ingelogd! Veel plezier met het spel.';
    successMessage.style.display = 'block';

    // Verberg de boodschap na 3 seconden
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Initialisatie van het spel
(async function init() {
    checkLoginStatus();
    await applyUserPreferences();
    updateAverageTimeUI();
    const pairCount = boardSize / 2;
    await initializeImages(imageSourceSelector.value, pairCount);
    resetGame();
})();
