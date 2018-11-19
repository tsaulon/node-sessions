const HTTP_PORT = process.env.PORT || 8080; // Listen on HTTP
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Let's learn about sessions.");
})

app.listen(HTTP_PORT, () => {
    console.log(`Server started! Listening on port: ${HTTP_PORT}`)
})