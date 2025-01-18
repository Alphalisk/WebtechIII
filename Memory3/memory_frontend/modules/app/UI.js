// UI gemiddelde speeltijd gebruiker weergeven
export function updateAverageTimeUI() {
    const averageTime = calculateAverageTime();
    const averageTimeElement = document.getElementById('averageTime');
    averageTimeElement.textContent = `${averageTime}s`;
}

// UI Update de gevonden paren
export function updateFoundPairsDisplay(foundPairs) {
    foundPairsDisplay.textContent = foundPairs;
}

// UI Pas een kleur toe op een specifieke kaart
export function setCardColor(card, state, colors) {
    const { closed, open, found } = colors;

    if (state === 'closed') {
        card.style.backgroundColor = closed;
    } else if (state === 'open') {
        card.style.backgroundColor = open;
    } else if (state === 'found') {
        card.style.backgroundColor = found;
    }
}

// gemiddelde speeltijd van gebruiker berekenen
function calculateAverageTime() {
    const playtimes = JSON.parse(localStorage.getItem('playtimes')) || [];
    if (playtimes.length === 0) return 0;

    const total = playtimes.reduce((sum, time) => sum + time, 0);
    return Math.floor(total / playtimes.length);
}