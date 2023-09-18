const { v4: uuidv4 } = require('uuid');
const fs = require ("fs");
const express = require ("express");
const path = require("path");

const app = express();

const PORT = 3001;``

app.use(express.static("public"));

app.use(express.static("db"));
// its good to include the path.join because it creates a path that begins at the level of the current directory, then public, then the index file
// Logan said that if I excluded the path.join(__dirname, ) part that it might still work on my local machine but the path may be invalid on a third part hosting site like heroku
//its good practice to include the path.join() 

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));
app.get("*", (req, res) => {res.sendFile(path.join(__dirname, "public/index.html"))});

app.get("/api/notes", (req, res) => {
    fs.readFile("db/db.json", "UTF-8", (err, data) => {
        console.log(hello);
        if (err) {
            console.error(error);
        }
        //const notesData = JSON.parse(data); would need this line of code if I was not using the middleware the parses and stringifies incoming data accordingly
        res.json(data);
    })
})

app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    //the middleware has turned req.body into json object
    newNote.id = uuidv4();
    fs.readFile("db/db.json", "UTF-8", (err, data) => {
        if (err) {
            console. error(err);
        }
        if (!data.trim()) {
            data = "[]";
            //set the file to have at least brackets so that if its completely empty I won't get an error trying to parse it
        }
        const currentNotes = JSON.parse(data);
        //still need to use JSON.parse() here because the middleware does not parse the data for me
        //readFile reads the db.json file and turns into a string (essentially stringifying it)
        //I then need to parse it to create a JSON object
        currentNotes.push(newNote);
        fs.writeFile("db/db.json", JSON.stringify(currentNotes), (err) => {
            //need to stringify currentNotes so that writeFile can use the data to write a file
            if (err) console.error(error)
        })
    res.json(newNote)
    })
})


app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));