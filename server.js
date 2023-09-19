const { v4: uuidv4 } = require('uuid');
const fs = require ("fs");
const express = require ("express");
const path = require("path");

const app = express();

const PORT = 3001;

app.use(express.static("public"));

app.use(express.static("db"));
// its good to include the path.join because it creates a path that begins at the level of the current directory, then public, then the index file
// Logan said that if I excluded the path.join(__dirname, ) part that it might still work on my local machine but the path may be invalid on a third part hosting site like heroku
//its good practice to include the path.join() 

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//middleware only works to stringify and parse POST requests!!!!

app.get("/notes", (req, res) => {res.sendFile(path.join(__dirname, "public/notes.html"))});

app.get("/api/notes", (req, res) => {
    fs.readFile("db/db.json", "UTF-8", (err, data) => {
        console.log("hello");
        if (err) {
            console.error(error);
        }
        const notesData = JSON.parse(data);
        res.json(notesData);
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
        //still need to use JSON.parse() here because the middleware does not parse the data on post requests
        //regardless, I still need to parse the json file into a json object so I can add the new note
        currentNotes.push(newNote);
        fs.writeFile("db/db.json", JSON.stringify(currentNotes), (err) => {
            //need to stringify currentNotes so that writeFile can use the data to write a file, remember it takes strings or arrays
            if (err) console.error(error)
        })
    res.json(newNote)
    })
})

app.get("*", (req, res) => {res.sendFile(path.join(__dirname, "public/index.html"))});


app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));