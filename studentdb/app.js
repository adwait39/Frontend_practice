const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/student', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define Schema
const studentMarksSchema = new mongoose.Schema({
    Name: String,
    Roll_No: Number,
    WAD_Marks: Number,
    CC_Marks: Number,
    DSBDA_Marks: Number,
    CNS_Marks: Number,
    AI_Marks: Number
});
const StudentMarks = mongoose.model('studentmarks', studentMarksSchema);

// Insert array of documents
const students = [
    { Name: 'ABC', Roll_No: 111, WAD_Marks: 25, CC_Marks: 25, DSBDA_Marks: 25, CNS_Marks: 25, AI_Marks: 25 },
    // Add more students here
];

// Create Database called student and Collection called studentmarks
db.once('open', async () => {
    console.log('Connected to MongoDB');
    try {
        await StudentMarks.insertMany(students);
        console.log('Documents inserted successfully');
    } catch (error) {
        console.error(error);
    }
});

// Middleware to display JSON in browser
app.use(express.json());

// Display total count of documents
app.get('/total', async (req, res) => {
    try {
        const count = await StudentMarks.countDocuments();
        res.send(`Total count of documents: ${count}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// List all documents
app.get('/list', async (req, res) => {
    try {
        const students = await StudentMarks.find();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// List names of students who got more than 20 marks in DSBDA Subject
app.get('/dsbda', async (req, res) => {
    try {
        const students = await StudentMarks.find({ DSBDA_Marks: { $gt: 20 } }, { Name: 1, _id: 0 });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Update marks of specified students by 10
app.put('/update/:rn', async (req, res) => {
    const rollNo = req.params.rn;
    try {
        await StudentMarks.updateMany({ Roll_No: rollNo }, { $inc: { WAD_Marks: 10, CC_Marks: 10, DSBDA_Marks: 10, CNS_Marks: 10, AI_Marks: 10 } });
        res.send('Marks updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// List names who got more than 25 marks in all subjects
app.get('/allsubjects', async (req, res) => {
    try {
        const students = await StudentMarks.find({
            WAD_Marks: { $gt: 25 },
            CC_Marks: { $gt: 25 },
            DSBDA_Marks: { $gt: 25 },
            CNS_Marks: { $gt: 25 },
            AI_Marks: { $gt: 25 }
        }, { Name: 1, _id: 0 });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// List names who got less than 40 in both Maths and Science
app.get('/mathsscience', async (req, res) => {
    try {
        const students = await StudentMarks.find({
            $or: [
                { WAD_Marks: { $lt: 40 } },
                { CC_Marks: { $lt: 40 } }
            ]
        }, { Name: 1, _id: 0 });
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Remove specified student document from collection
app.delete('/remove/:rn', async (req, res) => {
    const rollNo = req.params.rn;
    try {
        await StudentMarks.findOneAndDelete({ Roll_No: rollNo });
        res.send('Document removed successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Display Students data in Browser in tabular format
app.get('/tabular', async (req, res) => {
    try {
        const students = await StudentMarks.find({}, { _id: 0, __v: 0 });
        let table = '<table border="1"><tr><th>Name</th><th>Roll No</th><th>WAD</th><th>CC</th><th>DSBDA</th><th>CNS</th><th>AI</th></tr>';
        students.forEach(student => {
            table += `<tr><td>${student.Name}</td><td>${student.Roll_No}</td><td>${student.WAD_Marks}</td><td>${student.CC_Marks}</td><td>${student.DSBDA_Marks}</td><td>${student.CNS_Marks}</td><td>${student.AI_Marks}</td></tr>`;
        });
        table += '</table>';
        res.send(table);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
