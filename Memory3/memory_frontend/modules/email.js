import { fetchWithAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        alert('Je moet ingelogd zijn om deze pagina te bekijken.');
        window.location.href = 'inlog.html';
        return;
    }

    const emailInput = document.getElementById('email');
    const preferencesForm = document.getElementById('preferences-form');
    const messageElement = document.getElementById('message');

    // Haal e-mailadres op bij het laden
    try {
        const response = await fetchWithAuth(`http://localhost:8000/api/player/${userId}/email`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const email = await response.json();
            emailInput.value = email;
        } else {
            console.error('Fout bij ophalen van e-mailadres:', response.statusText);
            alert('Kon e-mailadres niet ophalen.');
        }
    } catch (error) {
        console.error('Fout bij ophalen van e-mailadres:', error);
    }

    // Opslaan van e-mailadres
    preferencesForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const newEmail = emailInput.value.trim();

        if (!newEmail || !newEmail.includes('@')) {
            alert('Voer een geldig e-mailadres in.');
            return;
        }

        try {
            const response = await fetchWithAuth(`http://localhost:8000/api/player/${userId}/email`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email: newEmail }),
            });

            if (response.ok) {
                messageElement.textContent = 'E-mailadres succesvol bijgewerkt! Je wordt teruggebracht naar de hoofdpagina...';
                messageElement.className = 'message success';

                // Wacht 2 seconden en navigeer naar index.html
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                messageElement.textContent = 'Fout bij het bijwerken van e-mailadres.';
                messageElement.className = 'message error';
            }
        } catch (error) {
            console.error('Fout bij het bijwerken van e-mailadres:', error);
            messageElement.textContent = 'Er is een fout opgetreden bij het bijwerken van e-mailadres.';
            messageElement.className = 'message error';
        }

        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    });
});
