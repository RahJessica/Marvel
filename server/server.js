const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;

// lancer le server express : node server.js

app.use(cors());
app.use(express.json());

const marvels = require('./user.json');
const DATA_FILE = './user.json';

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

function readData() {
  const rawData = fs.readFileSync(DATA_FILE);
  return JSON.parse(rawData).characters;
}
function writeData(characters) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ characters }, null, 2));
}

app.get('/characters', (req, res) => {
  const characters = readData();
  res.json(characters);
});

app.get('/characters/:id', (req, res) => {
  const characters = readData();
  const character = characters.find(c => c.id === parseInt(req.params.id));
  if (character) {
    res.json(character);
  } else {
    res.status(404).json({ error: 'Character not found' });
  }
});

app.put('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedCharacter = req.body;

  const data = readData();
  const index = data.characters.findIndex(char => char.id === id);

  if (index !== -1) {
    data.characters[index] = { id, ...updatedCharacter };
    writeData(data);
    res.json(data.characters[index]);
  }
});

app.delete('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const data = readData();
  const index = data.characters.findIndex(char => char.id === id);

  if (index !== -1) {
    const deleted = data.characters.splice(index, 1);
    writeData(data);
    res.json({ message: 'Character deleted', character: deleted[0] });
  } else {
    res.status(404).json({ error: 'Character not found' });
  }
});
