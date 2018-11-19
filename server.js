const HTTP_PORT = process.env.PORT || 8080; // Listen on HTTP
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");

/* MIDDLEWARE START */

// Register handlerbars as the rendering engine for views
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("static"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "week10example_web322", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

/* MIDDLEWARE END */

/* LOGIN HANDLER START */

// A simple user object, hardcoded for this example
const user = {
    username: "sampleuser",
    password: "samplepassword",
    email: "sampleuser@example.com"
};

app.get("/", (req, res) => {
    res.redirect("login", {});
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === '' || password === '')
        res.render("login", { errorMsg: "Missing Credentials" });

    if (username === user.username && password === user.password) {

        // Add the user on the session and redirect them to the dashboard page.
        req.session.user = {
            username: user.username,
            email: user.email
        };

        res.render("/dashboard");
    } else{
        // render 'invalid username or password'
        res.render("login", { errorMsg: "invalid username or password!"});
    }
})

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/login");
})

/* LOGIN HANDLER END */

app.listen(HTTP_PORT, () => {
    console.log(`Server started! Listening on port: ${HTTP_PORT}`)
})