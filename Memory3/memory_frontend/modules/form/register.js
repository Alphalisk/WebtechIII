document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Voorkom standaard formulierverzending

    // Haal formuliergegevens op
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Verstuur registratieverzoek naar de backend
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const messageElement = document.getElementById('message');

        if (response.status === 201) {
            messageElement.textContent = 'Registratie geslaagd! Je wordt doorgestuurd naar de inlogpagina...';
            messageElement.className = 'message success';
            messageElement.style.display = 'block';

            // Wacht 3 seconden en navigeer naar inlog.html
            setTimeout(() => {
                window.location.href = 'inlog.html';
            }, 3000);
        } else {
            const errorData = await response.json();
            messageElement.textContent = errorData.message || 'Registratie mislukt.';
            messageElement.className = 'message error';
        }

        messageElement.style.display = 'block';
    } catch (error) {
        console.error('Fout:', error.message);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Er is een fout opgetreden bij de registratie.';
        messageElement.className = 'message error';
        messageElement.style.display = 'block';
    }
});