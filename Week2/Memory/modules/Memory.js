import { fetchImages } from './api.js';

let letters = []; // Wordt vervangen door afbeeldings-URLs
let openedCards = [];
let foundPairs = 0;
let images = [];

// Functie om afbeeldingen te laden
async function initializeImages(source, pairCount) {
    const fetchedImages = await fetchImages(source, pairCount);
    images = [...fetchedImages, ...fetchedImages]; // Verdubbel voor paren
    images.sort(() => Math.random() - 0.5); // Schudden
}

// Functie om het bord te bouwen
function buildBoard() {
    grid.innerHTML = ''; // Leeg het bord

    // Maak de kaarten aan
    for (let i = 0; i < images.length; i++) {
        const card = document.createElement('div');
        card.classList.add('grid-item');
        card.dataset.index = i;

        // Voeg een gesloten kaartkleur toe
        card.style.backgroundColor = kaartkleurInput.value || '#0d793c';

        // Voeg de klikfunctionaliteit toe
        card.addEventListener('click', handleCardClick);

        // Gebruik een afbeelding voor de inhoud (verborgen bij start)
        card.innerHTML = `<img src="${images[i]}" alt="Memory card" style="display: none; width: 100%; height: 100%;">`;

        grid.appendChild(card);
    }
}

function handleCardClick(event) {
    const card = event.target.closest('.grid-item'); // Zorg dat alleen op kaarten wordt geklikt
    const cardImage = card.querySelector('img');

    // Controleer of de kaart al geopend is
    if (cardImage.style.display === 'block' || openedCards.length === 2) return;

    // Toon de afbeelding
    cardImage.style.display = 'block';

    // Voeg de kaart toe aan geopende kaarten
    openedCards.push(card);

    if (openedCards.length === 2) {
        setTimeout(compareCards, 500);
    }
}

