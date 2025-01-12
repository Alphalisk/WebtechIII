// Bewaar de originele fetch
const originalFetch = window.fetch;

// Overschrijf de fetch-functie alleen als dat nodig is
window.fetch = async function (url, options = {}) {
    const isAuthRequired = url.startsWith('http://localhost:8000'); // Pas alleen aan voor interne API's

    if (isAuthRequired) {
        options.headers = options.headers || {};

        // Voeg de Authorization-header toe als een JWT bestaat
        const token = localStorage.getItem('jwt');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Roep de originele fetch-functie aan
    return originalFetch(url, options);
};