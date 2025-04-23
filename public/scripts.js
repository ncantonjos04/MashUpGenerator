async function searchLyrics(songTitle){
    const response = await fetch(`/get-lyrics?song=${encodeURIComponent(songTitle)}`);
    const data = await response.json();

    if (data.searchResults){
        displaySearch(data.searchResults);

        if(data.lyrics){
            // add if () button is clicked, then display lyrics
            displayLyrics(data.lyrics);
        }
    }
}
function displaySearch(searchResults){
    document.querySelector('.searchResults').innerHTML = '';
    searchResults.forEach((element) =>{
        
        document.querySelector('.searchResults').innerHTML+= `
        <div class = "oneSearchResult">
        
            <div class = "oneSearchTitle">${element.result.title}</div>
            <div class = "oneSearchArtist">${element.result.primary_artist.name}</div>
            <img class = "oneSearchCover" src = "${element.result.song_art_image_url}">
            <button class = "displayButton"></button>
        
        </div>
        `
    }) 
}

function displayLyrics(lyrics){
   document.querySelector('.lyricDisplay').innerHTML += `
   <div class = "songLyrics">${lyrics}</div>
   `
}