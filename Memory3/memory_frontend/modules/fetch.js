// Bewaar de originele fetch
const originalFetch = window.fetch;

// Overschrijf de fetch-functie
window.fetch = async function (url, options = {}) {
    // Zorg dat headers bestaan
    options.headers = options.headers || {};

    // Voeg de Authorization-header toe als een JWT bestaat
    const token = localStorage.getItem('jwt');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Roep de originele fetch-functie aan
    return originalFetch(url, options);
};