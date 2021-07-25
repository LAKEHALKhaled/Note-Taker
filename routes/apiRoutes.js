
 const notes = require('express').Router();
 const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
     writeToFile,
  } = require('../helpers/fsUtils');

notes.get('/notes', (req,res)  => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})
notes.get('/notes/:id', (req, res) => {
  const Id = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id === Id);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific tip


notes.delete('/notes/:id', (req, res) => {
  const Id = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== Id);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`note ${Id} has been deleted 🗑️`);
    });
});

// POST Route for a new UX/UI tip




notes.post('/notes', (req, res) => {
  console.log(req.body);

  const {title, text} = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4()
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

  module.exports = notes;
