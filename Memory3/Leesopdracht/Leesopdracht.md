# LeesOpdracht

Deze leesopdracht gaat over de volgende blog op logrocket.com:
https://blog.logrocket.com/jwt-authentication-best-practices/

De auteur geeft aan een aantal use-cases, voor- en nadelen en best practices van JWT. 
Geef van elk een korte samenvatting en reflecteer op hoe dit past binnen de memory-opdracht. 

### 1. Use-cases

In het blog staan er usecases die worden ondersteund door gebruik te maken van JWT.

- Het is erg ingewikkeld om een authenticatie proces in een applicatie te maken. Veel ontwikkelaars en bedrijven besteden dat daarom uit. De JWT werkwijze biedt een relatief eenvoudige wijze van authenticatiebeheer zodat dit toch in eigen beheer kan blijven. Wat vaak zelfs nog veiliger is dan bij derde partijen.

- Het verwijderen van de noodzaak om wachtwoorden in de localstorage op te slaan. JWT wordt gebruikt om gebruikers te identificeren en te verifiëren. Na succesvolle login krijgt een gebruiker een JWT waarmee toegang wordt verleend tot beschermde onderdelen van de applicatie.

- Verwijdert de noodzaak voor redudante database queries.
JWT wordt gebruikt om veilig data uit te wisselen tussen front-end en back-end zonder dat er constant database-opvragingen nodig zijn. 

### 2. Voor- en nadelen

In het blog zijn de volgende voor- en nadelen besproken met betrekking tot het gebruik van JWT.

**Voordelen**
- Eigen beheer zonder derde partij. De beveiliging met JWT voldoet aan goede beveiligingseisen wat zelfs nog beter is dan het uitbesteden aan derde partijen.

- Beveiliging via handtekening. De handtekening (bijvoorbeeld HMAC of RSA) garandeert de integriteit van de data, waardoor gemanipuleerde tokens direct ongeldig zijn.

- Betere performance. Omdat de gegevens in de JWT zelf staan, hoeven er minder serveraanroepen gedaan te worden, wat prestaties verbetert.

**Nadelen**
- Onversleutelde payload. De payload is leesbaar voor iedereen die de token onderschept, tenzij extra encryptie wordt toegepast. Dit betekent dat er nooit gevoelige informatie in een JWT mag worden opgeslagen.

- XSS- en CSRF-aanvallen. Omdat JWT meestal wordt opgeslagen in cookies of localStorage, kunnen aanvallers deze tokens stelen via Cross-Site Scripting (XSS) of Cross-Site Request Forgery (CSRF).

- Groottebeperkingen. JWTs bevatten veel informatie (header, payload en signature), wat een nadeel kan zijn bij opslag in cookies of als ze in elke HTTP-aanroep worden meegestuurd.

### 3. Best practices
In het blog waren niet veel best practices met het gebruik van JWT benoemd, vandaar dat de samenvatting hiervan klein is.

- Beperk de payload. Sla alleen noodzakelijke informatie in de JWT op. Vermijd gevoelige gegevens zoals wachtwoorden.

- Verder dient er rekening gehouden te worden met de invloed van javascript afhankelijkheid en daarbij risico op XSS en CSRF.

### 4. Reflectie
De toepassing van JWT past goed binnen de memory-opdracht om de volgende redenen.

- Authenticatie en Autorisatie. Allereerst is het goed en daarnaast ook wetteijk verplicht om altijd deugdelijke beveiliging in te stellen als het gaat om gebruikersinformatie. Ook al gaat het alleen om een gebruikersnaam en een e-mailadres.

- De gebruikersregistratie en inlogfunctionaliteit maken gebruik van JWT, waarmee gebruikers worden geverifieerd. Dit beperkt database queries wat ten goede komt voor de performance van de applicatie.

De nadelen die een JWT met zich meebrengt zijn hebben ook niet grote gevolgen voor de memory game.

- Het is niet nodig bij deze applicatie om gevoelige gegevens in de payload van een JWT token te stoppen. Wat betekent dat een eventuele hacker niet veel heeft aan een onderschepte token.

- Omdat de applicatie relatief simpel is, zijn er geen grootte JWT tokens benodigt. Dit kan prima op de browser in de LocalStorage opgeslagen blijven.

Kortom, beveiliging door middel van het gebruik van JWT tokens is prima voor de memory applicatie. 

