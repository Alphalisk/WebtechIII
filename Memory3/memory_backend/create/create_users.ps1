# Aanmaken van spelers

Invoke-WebRequest -Uri "http://localhost:8000/register" -Method POST -ContentType "application/json" -Body '{"username":"Tim", "email":"tim@tim", "password":"tim"}'


