const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect('mongodb://localhost:27017/music', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const musicSchema = new mongoose.Schema({
    Songname: String,
    Film: String,
    Singer: String,
    Director: String,
    Actor: String,
    Actress: String // Added Actor and Actress fields
});

const music = mongoose.model('music', musicSchema);

const songs = [
    { Songname: "ABC", Film: "AABBCC", Singer: "AABC", Director: "ABBC" },
    { Songname: "XYZ", Film: "XXYYZZ", Singer: "XYYZ", Director: "XYZ" },
    { Songname: "123", Film: "112233", Singer: "12", Director: "13" },
    { Songname: "DEF", Film: "DDEEFF", Singer: "DEF", Director: "DEFF" },
    { Songname: "456", Film: "445566", Singer: "45", Director: "46" },
];

db.once('open', async () => {
    try {
        console.log("Connected to MongoDB");
        await music.insertMany(songs);
        console.log("Documents inserted successfully.");
    } catch (error) {
        console.error(error);
    }
});

app.use(express.json());

// d) Display total count of documents and List all the documents in browser.
app.get('/songs', async (req, res) => {
    try {
        const count = await music.countDocuments();
        const allSongs = await music.find();
        res.send({ total: count, songs: allSongs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// e) List specified Music Director songs.
app.get('/songs/director/:director', async (req, res) => {
    try {
        const director = req.params.director;
        const directorSongs = await music.find({ Director: director });
        res.send({ songs: directorSongs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// f) List specified Music Director songs sung by specified Singer.
app.get('/songs/director/:director/singer/:singer', async (req, res) => {
    try {
        const director = req.params.director;
        const singer = req.params.singer;
        const directorSingerSongs = await music.find({ Director: director, Singer: singer });
        res.send({ songs: directorSingerSongs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// g) Delete the song which you don’t like.
app.delete('/song/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await music.findByIdAndDelete(id);
        res.send("Song deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// h) Add new song which is your favourite.
app.post('/song', async (req, res) => {
    try {
        const { Songname, Film, Singer, Director, Actor, Actress } = req.body;
        const newSong = new music({ Songname, Film, Singer, Director, Actor, Actress });
        await newSong.save();
        res.send("New song added successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// i) List Songs sung by Specified Singer from specified film.
app.get('/songs/film/:film/singer/:singer', async (req, res) => {
    try {
        const film = req.params.film;
        const singer = req.params.singer;
        const filmSingerSongs = await music.find({ Film: film, Singer: singer });
        res.send({ songs: filmSingerSongs });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// j) Update the document by adding Actor and Actress name.
app.put('/song/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { Actor, Actress } = req.body;
        await music.findByIdAndUpdate(id, { Actor, Actress });
        res.send("Song updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});
