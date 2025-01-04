document.getElementById('submit').addEventListener('click', function (event) {
    event.preventDefault(); // Voorkomt standaard formulierverzending

    // Haal formuliergegevens op
    const form = document.getElementById('form');
    const formData = new FormData(form);

    // Verstuur gegevens naar de backend
    fetch('http://localhost:8000/get-data.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            console.log('Server response:', response);
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                // Voeg fout-stijl toe aan invoervelden
                const usernameInput = document.querySelector('input[name="username"]');
                const passwordInput = document.querySelector('input[name="password"]');
                usernameInput.classList.add('error');
                passwordInput.classList.add('error');
                console.log('401 Unauthorized: fout-stijl toegevoegd');
                throw new Error('Unauthorized.');
            } else if (response.status === 400) {
                throw new Error('Illegal Request');
            } else {
                throw new Error('Er is een fout opgetreden.');
            }
        })
        .then(data => {
            console.log('Data ontvangen:', data);
            // Verwerk de ontvangen data zoals eerder beschreven
        })
        .catch(error => {
            console.error('Fout:', error.message);
            alert(error.message);
        });
});

// Rode lijnen verwijderen bij nieuwe invoer
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
        input.classList.remove('error');
    });
});
