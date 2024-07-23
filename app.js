const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTML form
const formHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>MongoDB Connection</title>
  </head>
  <body>
    <h1>Enter your MongoDB URI</h1>
    <form action="/submit" method="post">
      <label for="mongoURI">Mongo URI:</label>
      <input type="text" id="mongoURI" name="mongoURI" required>
      <button type="submit">Submit</button>
    </form>
  </body>
  </html>
`;

// Schema and Model
const studentSchema = new mongoose.Schema({
  myName: String,
  mySID: String
});
const Student = mongoose.model('s24students', studentSchema);

// Route to display the form
app.get('/', (req, res) => {
  res.send(formHTML);
});


app.post('/submit', async (req, res) => {
    const mongoURI = req.body.mongoURI.trim(); // Trim to remove any leading/trailing spaces
  
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      return res.send('<h1>Invalid MongoDB URI</h1>');
    }
  
    try {
      // Connect to the database
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected');
  
      // Add the data to the database
      const myName = "Iyanuoluwa Matti"; 
      const mySID = "300378824";  
  
      const student = new Student({ myName, mySID });
      await student.save();
      console.log('Document added to the database');
  
      // Send a response to the user
      res.send('<h1>Document Added</h1>');
    } catch (err) {
      console.error('Error:', err.message);
      res.send('<h1>Failed to connect to MongoDB or add the document</h1>');
    }
  });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});