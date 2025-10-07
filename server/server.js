import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const UPLOADS_DIR = join(__dirname, 'uploads');
try {
  await fs.access(UPLOADS_DIR);
} catch {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Database file path
const DB_FILE = join(__dirname, 'submissions.json');

// Initialize database file if it doesn't exist
async function initDatabase() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ submissions: [], nextId: 1 }, null, 2));
  }
}

// Read database
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { submissions: [], nextId: 1 };
  }
}

// Write database
async function writeDatabase(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Initialize database on startup
initDatabase();

// API Routes

// Submit a new questionnaire
app.post('/api/submissions', upload.fields([
  { name: 'intersectionPhasingFile', maxCount: 1 },
  { name: 'signalTimingFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      cabinetType,
      detectionIO,
      tlsConnection,
      equipment,
      auxiliaryEquipment,
      distributor,
      endUser,
      address,
      city,
      state,
      zip
    } = req.body;

    const db = await readDatabase();
    
    // Get uploaded file information
    const intersectionPhasingFile = req.files?.intersectionPhasingFile?.[0];
    const signalTimingFile = req.files?.signalTimingFile?.[0];
    
    const newSubmission = {
      id: db.nextId,
      cabinet_type: cabinetType,
      detection_io: detectionIO,
      tls_connection: tlsConnection,
      intersection_phasing_file: intersectionPhasingFile ? intersectionPhasingFile.filename : null,
      signal_timing_file: signalTimingFile ? signalTimingFile.filename : null,
      equipment: JSON.parse(equipment || '{}'),
      auxiliary_equipment: JSON.parse(auxiliaryEquipment || '{}'),
      distributor: distributor,
      end_user: endUser,
      address: address,
      city: city,
      state: state,
      zip: zip,
      created_at: new Date().toISOString()
    };

    db.submissions.push(newSubmission);
    db.nextId++;
    
    await writeDatabase(db);

    res.json({ success: true, id: newSubmission.id });
  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all submissions (for admin portal)
app.get('/api/submissions', async (req, res) => {
  try {
    const db = await readDatabase();
    
    // Sort by created_at descending
    const sortedSubmissions = [...db.submissions].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    res.json({ success: true, data: sortedSubmissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a submission (optional admin feature)
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const db = await readDatabase();
    const id = parseInt(req.params.id);
    
    db.submissions = db.submissions.filter(sub => sub.id !== id);
    
    await writeDatabase(db);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

