const HTTP_PORT = process.env.PORT || 8080; // Listen on HTTP
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");

// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/");
    } else {
        next();
    }
}

/* MIDDLEWARE START */

// Register handlerbars as the rendering engine for views
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("static"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//  Parse JSON data
app.use(bodyParser.json());

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
    username: "admin",
    password: "admin",
    email: "admin@example.com"
};

app.get("/", (req, res) => {
    res.render("login", {});
})

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === '' || password === '') {
        res.render("login", { errorMsg: "Missing Credentials" });
    } else if (username === user.username && password === user.password) {

        // Add the user on the session and redirect them to the dashboard page.
        req.session.user = {
            username: user.username,
            email: user.email
        };

        res.redirect("/dashboard");
    } else {
        // render 'invalid username or password'
        res.render("login", { errorMsg: "invalid username or password!" });
    }
})

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
})

/* LOGIN HANDLER END */

/* AUTHORIZATION CHECKS START */

// An authenticated route that requires the user to be logged in.
// Notice the middleware 'ensureLogin' that comes before the function
// that renders the dashboard page
app.get("/dashboard", ensureLogin, (req, res) => {
    res.render("dashboard", { user: req.session.user });
});

/* AUTHORIZATION CHECKS END */

/* FETCH API DEMO START */

app.get("/fetchRequestDemo", ensureLogin, (req,res) => {
    res.render("fetchDemo");
});

app.get("/api/users", (req, res) => {
    res.json({message: "fetch all users"});
});

app.post("/api/users", (req, res) => {
     res.json({message: "add the user: " + req.body.fName + " " + req.body.lName});
});

app.get("/api/users/:userId", (req, res) => {
    res.json({message: "get user with Id: " + req.params.userId});
});

app.put("/api/users/:userId", (req, res) => {
    res.json({message: "update User with Id: " + req.params.userId + " to " + req.body.fName + " " + req.body.lName});
});

app.delete("/api/users/:userId", (req, res) => {
     res.json({message: "delete User with Id: " + req.params.userId});
});

/* FETCH API DEMO END */

/* FETCH API DEMO END */
app.listen(HTTP_PORT, () => {
    console.log(`Server started! Listening on port: ${HTTP_PORT}`)
})