// Controleer of een gebruiker is ingelogd, Pas UI aan
export function checkLoginStatus(action = null) {
    const navOptions = document.getElementById('nav-options');
    const token = localStorage.getItem('jwt'); // Haal de token op
    const username = localStorage.getItem('username'); // Haal de gebruikersnaam op
    const successMessage = document.getElementById('success-message'); // Meldingselement

    if (token && username) {
        console.log('Gebruiker is ingelogd:', username);

        // Toon de welkomsttekst en uitlogknop
        navOptions.innerHTML = `
            <span>Welkom, ${username}!</span>
            <a href="voorkeuren.html">Voorkeuren</a>
            <a href="email.html">E-mail</a>
            <a id="logout-button">Uitloggen</a>
        `;

        // Voeg functionaliteit toe aan de uitlogknop
        document.getElementById('logout-button').addEventListener('click', () => {
            localStorage.removeItem('jwt'); // Verwijder de JWT-token
            localStorage.removeItem('username'); // Verwijder de gebruikersnaam
            localStorage.removeItem('userId');

            // Controleer opnieuw de loginstatus met de logout-actie
            checkLoginStatus('logout');
        });

        // Toon melding alleen bij succesvol inloggen
        if (action === 'login') {
            successMessage.textContent = 'Je bent succesvol ingelogd!';
            successMessage.style.display = 'block';

            // Verberg de melding na 3 seconden
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    } else {
        console.log('Gebruiker is niet ingelogd.');

        // Toon de inlog- en registreeropties
        navOptions.innerHTML = `
            <a href="inlog.html" id="login-link">Inloggen</a>
            <a href="register.html" id="register-link">Registreren</a>
        `;

        // Toon melding alleen bij succesvol uitloggen
        if (action === 'logout') {
            successMessage.textContent = 'Je bent succesvol uitgelogd!';
            successMessage.style.display = 'block';

            // Verberg de melding na 3 seconden
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    }
}