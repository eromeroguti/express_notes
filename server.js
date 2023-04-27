const express = require('express');
const { v4: uuidv4 }= require('uuid');
const path = require('path');
let data = require('./db/db.json');
const fs = require('fs')


const app = express();
const PORT = 3001


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));







app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', JSON.stringify(data), err => {
        if (err){
            console.log(err)
        } else {
            console.log('Success')
        }
    });
    res.json(data);
});

// post /api/notes should receive a new note to save on the request body, add it to the db.json file
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // creates a unique id for each note
    fs.readFile('./db/db.json', JSON.stringify(data), err => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
            if (err) throw err;
            res.json(newNote);
        });
    });    
});




app.delete('/api/notes/:id', (req, res) => {
    const idDelete = req.params.id;
    data - data.filter((note) => note.id !== idDelete);
    fs.readFile('./db/db.json', JSON.stringify(data), err => {
        if (err){
            res.sendStatus(500);
        } else {
            console.log('Success')
        }
    })
});

app.listen(PORT, () => 
    console.log(`Server running on port http://localhost:${PORT}`)
    );