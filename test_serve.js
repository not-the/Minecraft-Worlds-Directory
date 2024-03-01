const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
app.use(express.static(path.join(__dirname)));

// Return page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '404.html'));
});

app.listen(port);
console.log(`Listening on port ${port}`)
