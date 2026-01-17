import express from 'express'; 
import cors from 'cors';      
import pool from './db.js';
import multer  from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;



app.use(cors()); 
app.use(express.json()); 
const upload = multer({ dest: 'uploads/' })






app.get('/api/saves', async (req, res) => {
  const { username } = req.query; 
  try {
   
    const [rows] = await pool.query("SELECT * FROM saves WHERE username = ?", [username]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});









app.delete('/api/saves/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        await pool.query('DELETE FROM saves WHERE id = ?', [id]);        
        res.json({ message: "Deleted from database" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not delete" });
    }
});




app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }
    await pool.query("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", 
      [username, password, email]
    );
    res.json({ message: "Registration successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during registration" });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    const user = users[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }
    
    res.json({ message: "Login successful", username: user.username });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});





app.post(
  '/api/saves',
  upload.fields([
    { name: 'saveFile', maxCount: 1 },
    { name: 'gameName', maxCount: 1 }
  ]),
  async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    if (!req.files || !req.files.saveFile) {
      return res.status(400).json({ error: "No file sent!" });
    }
    const username = req.body.username;
    const gameName =
      req.body.gameName && req.body.gameName.trim()
        ? req.body.gameName.trim()
        : "Unknown Game";
    const file = req.files.saveFile[0];
    const { filename, originalname, size } = file;
    const sizeKB = (size / 1024).toFixed(1) + " KB";
    try {
      const sql = `
        INSERT INTO saves
        (username, gameName, fileName, size, uploadDate, playtime, filePath)
        VALUES (?, ?, ?, ?, NOW(), ?, ?)
      `;
      await pool.query(sql, [
        username,
        gameName,
        originalname,
        sizeKB,
        "0h",
        filename
      ]);
      res.json({ message: "File uploaded successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);


app.get('/api/saves', async (req, res) => {
  const { username } = req.query; 
  try {
   
    const [rows] = await pool.query("SELECT * FROM saves WHERE username = ?", [username]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get('/api/saves/:id/download', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM saves WHERE id = ? AND username = ?", [req.params.id, req.query.username]);
    if (rows.length === 0) return res.status(404).send("File not found.");

    const fileData = rows[0];
    const realFilePath = path.join(__dirname, 'uploads', fileData.filePath);

    res.download(realFilePath, fileData.fileName);
  } catch (err) {
    res.status(500).send("Server error");
  }
});


app.post("/google-login", async (req, res) => {
  const { email, name } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT username FROM users WHERE email = ?",
      [email]
    );

    // User already exists
    if (existing.length > 0) {
      return res.json({ username: existing[0].username });
    }

    
    const username = name || email.split("@")[0];

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, "GOOGLE_USER"]
    );

    res.json({ username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Google login failed" });
  }
});


export default app;
//const PORT = 5000;
//app.listen(PORT, () => {
  //console.log(`Server running on http://localhost:${PORT}`);
//});
