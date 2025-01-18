export async function fetchImages(source, count) {
    let urls = [];

    if (source === "picsum") {
        // Picsum API voor willekeurige foto's
        for (let i = 0; i < count; i++) {
            urls.push(`https://picsum.photos/200?random=${Math.random()}`);
        }
    } else if (source === "dog") {
        // Dog API voor hondenfoto's
        const response = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
        const data = await response.json();
        urls = data.message;
    } else if (source === "cat") {
        // Cataas API voor kattenfoto's
        for (let i = 0; i < count; i++) {
            urls.push(`https://cataas.com/cat?${Math.random()}`); // Cache busten met een query string
        }
    } else if (source === "fox") {
        // Random Fox API voor vossenfoto's
        for (let i = 0; i < count; i++) {
            const response = await fetch("https://randomfox.ca/floof/");
            const data = await response.json();
            urls.push(data.image); // Voeg de afbeelding toe aan de lijst
        }
    }

    return urls;
}

