//expressclient.js : starts the site

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const geniusAPIkey = 'ab_BXqOSV-BxMeE-3mpAAsBn3EOcNla_0H2ql__IGh_0AajNFmn-AaffWw42L3Jr';

//allow express to use static files like the css styles and what not...
app.use(express.static(__dirname));

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname,'./index.html'))
});

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})