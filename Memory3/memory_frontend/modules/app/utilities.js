// Schud een array willekeurig
export function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Formatteer tijd in mm:ss
export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Zoek een DOM-element en geef een foutmelding als het niet bestaat
export function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.error(`Element met selector '${selector}' niet gevonden.`);
    }
    return element;
}

// Reset de tekst en achtergrondkleur van een lijst kaarten
export function resetCards(cards, defaultColor) {
    cards.forEach(card => {
        card.textContent = '◆'; // Verberg de inhoud
        card.style.backgroundColor = defaultColor; // Standaard kleur
        card.classList.remove('open', 'found');
    });
}