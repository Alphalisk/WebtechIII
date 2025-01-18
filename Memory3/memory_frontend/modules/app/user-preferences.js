import { fetchWithAuth } from './auth.js';
import { getElement  } from './utilities.js';
const imageSourceSelector = getElement('#imageSource');
const kaartkleurInput = getElement('#kaartkleur');
const gevondenKleurInput = getElement('#gevonden');

// Haal voorkeuren gebruiker op en pas deze toe
export async function applyUserPreferences() {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) return;

    try {
        const response = await fetchWithAuth(`http://localhost:8000/api/player/${userId}/preferences`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const preferences = await response.json();
            if (preferences) {
                imageSourceSelector.value = preferences.preferred_api || 'picsum';
                kaartkleurInput.value = preferences.color_closed || '#1deb76';
                gevondenKleurInput.value = preferences.color_found || '#c026a9';
            }
        } else {
            console.error('Kon voorkeuren niet ophalen.');
        }
    } catch (error) {
        console.error('Fout bij het ophalen van voorkeuren:', error.message);
    }
}