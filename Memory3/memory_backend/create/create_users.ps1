# Aanmaken van spelers

Invoke-WebRequest -Uri "http://localhost:8000/register" -Method POST -ContentType "application/json" -Body '{"username":"Henk", "email":"henk@henk", "password":"henk"}'
Invoke-WebRequest -Uri "http://localhost:8000/register" -Method POST -ContentType "application/json" -Body '{"username":"Karel", "email":"karel@karel", "password":"karel"}'
Invoke-WebRequest -Uri "http://localhost:8000/register" -Method POST -ContentType "application/json" -Body '{"username":"Fenna", "email":"fenna@fenna", "password":"fenna"}'
Invoke-WebRequest -Uri "http://localhost:8000/register" -Method POST -ContentType "application/json" -Body '{"username":"Chantal", "email":"chantal@chantal", "password":"chantal"}'


