document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Voorkom standaard formulierverzending

    // Haal formuliergegevens op
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Verstuur loginverzoek naar de backend
        const response = await fetch('http://localhost:8000/api/login_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const messageElement = document.getElementById('message');

        if (response.ok) {
            const data = await response.json();
            
            // Helper functie om JWT-payload te decoderen
            function decodeJWT(token) {
                const base64Url = token.split('.')[1]; // Haal de payload (het tweede deel) op
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );

                return JSON.parse(jsonPayload);
            }

            // Gebruik deze functie na het ontvangen van de token
            const token = data.token;
            const decodedPayload = decodeJWT(token);
            const userId = decodedPayload.sub; // Haal de userId op uit de 'sub'-claim

            console.log('JWT Payload:', decodedPayload);
            console.log('UserID:', userId);

            // Sla de gegevens op in localStorage
            localStorage.setItem('jwt', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', username);

            // Navigeren naar de hoofdpagina
            window.location.href = 'index.html?message=success';
        } else {
            const errorData = await response.json();
            messageElement.textContent = errorData.message || 'Inloggen mislukt. Controleer je gegevens.';
            messageElement.className = 'message error';
        }

        messageElement.style.display = 'block';
    } catch (error) {
        console.error('Fout:', error.message);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Er is een fout opgetreden bij het inloggen.';
        messageElement.className = 'message error';
        messageElement.style.display = 'block';
    }
});