//backend file
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

//allow express to use static files like the css styles and front-end scripts and what-not...
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname,'./index.html'))
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

const GENIUS_API_KEY = process.env.GENIUS_API_KEY;
const GENIUS_BASE_URL = 'https://api.genius.com';

//get lyrics

app.get('/get-lyrics', async (req,res) =>{

    //req.query 
    const songTitle = req.query.song;

    if (!songTitle) return res.status(400).json({message: "No song title provided!"});

    try{

        //always include 'Authorization: `Bearer ${GENIUS_API_KEY}` to be authorized to get a response back from the API
        const searchResponse = await axios.get(`${GENIUS_BASE_URL}/search`,{
            params: {q: songTitle},
            headers: {
                Authorization: `Bearer ${GENIUS_API_KEY}`
            }
        }
        );
/*
searchResponse: An object returned by a search API call.

.data.response.hits: Usually an array of search results.

?.: Optional chaining. It checks if the item exists before trying to access deeper properties.

.result?.path: Tries to get the path of the song result, if it exists.
*/

        const searchResults = searchResponse.data.hits;
        const songPath = searchResults[0]?.result?.path;

        if (songPath){

            const lyricsResponse = await axios.get(`https://genius.com${songPath}`, {
                headers: {
                    Authorization: `Bearer ${GENIUS_API_KEY}`
                }
                });
            const lyrics = extractLyrics(lyricsResponse.data);
            res.json({ lyrics, searchResults })
        }
    } 
    catch (error){
        console.log('Error fetching lyrics');
        res.status(400).json({message: `Error fetching lyrics`}); 
    }});

    //parse lyrics into an array of strings, an index is a word
function extractLyrics(pageData){
    
    const $ = cheerio.load(pageData);

    const lyricsArray = [];

    $('[data-lyrics-contaner="true"]').each((i, elem)=>{

        lyricsArray.push($(elem).text());
    });

    return lyricsArray.join('\n');
}

