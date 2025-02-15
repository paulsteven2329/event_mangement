const express = require('express');
const cors = require('cors');  // Import CORS middleware
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { sendResponse } = require('./utils/response'); // Import sendResponse

dotenv.config();

const app = express();
const port = 3000;

// CORS middleware to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:8080', // Specify your frontend URL
  methods: ['GET', 'POST'], // Allowed methods
  credentials: true, // Allow cookies and sessions
}));

// Middleware to parse JSON body data
app.use(express.json());

// Setup for session management
app.use(
  session({
    secret: 'your_secret_key', // Change this in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// ================== STUDENT ROUTES ==================

// Student login
app.post('/student/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM students WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return sendResponse(res, 500, 'Database error', err);

    if (results.length === 0) {
      return sendResponse(res, 401, 'User not found');
    }

    const student = results[0];
    bcrypt.compare(password, student.password, (err, isMatch) => {
      if (err) return sendResponse(res, 500, 'Error comparing passwords', err);

      if (isMatch) {
        // Store the email in the session
        req.session.student_id = student.student_id;
        req.session.email = email;

        // Send response with student info
        return sendResponse(res, 200, 'Login successful', {
          student_id: student.student_id, // Include student_id
          email: email,                   // Include email
        });
      } else {
        return sendResponse(res, 401, 'Invalid password');
      }
    });
  });
});


// Register new student
app.post('/student/register', (req, res) => {
  const { first_name, last_name, email, password, phone_number, location_latitude, location_longitude } = req.body;

  // Validate input fields
  if (!first_name || !email || !password) {
    return sendResponse(res, 400, 'First name, email, and password are required');
  }

  // Check if email already exists
  const queryCheckEmail = 'SELECT * FROM students WHERE email = ?';
  db.query(queryCheckEmail, [email], (err, results) => {
    if (err) return sendResponse(res, 500, 'Database error', err);

    if (results.length > 0) {
      return sendResponse(res, 400, 'Email is already registered');
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return sendResponse(res, 500, 'Error hashing password', err);

      // Insert new student into the database
      const queryInsert = `
        INSERT INTO students (first_name, last_name, email, password, phone_number, location_latitude, location_longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.query(queryInsert, [first_name, last_name, email, hashedPassword, phone_number, location_latitude, location_longitude], (err, results) => {
        if (err) return sendResponse(res, 500, 'Database error', err);

        return sendResponse(res, 201, 'Registration successful');
      });
    });
  });
});


// Get student profile 
app.post('/student/profile', (req, res) => {
  const { email } = req.body;  // Retrieve email from the body

  // Validate email
  if (!email) {
    return sendResponse(res, 400, 'Email is required');
  }

  const query = 'SELECT * FROM students WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return sendResponse(res, 500, 'Database error', err);

    if (results.length === 0) {
      return sendResponse(res, 404, 'Profile not found');
    }

    const student = results[0];
    // Send the student profile data, including new fields
    sendResponse(res, 200, 'Profile retrieved successfully', {
      student_id: student.student_id,
      email: student.email,
      first_name: student.first_name,
      last_name: student.last_name,
      phone_number: student.phone_number,
      location_latitude: student.location_latitude,
      location_longitude: student.location_longitude,
      registration_date: student.registration_date
    });
  });
});


app.post('/student/attendance-by-email', (req, res) => {
  const { email } = req.body;  // The email is sent in the request body
  
  // Validate the email
  if (!email) {
    return sendResponse(res, 400, 'Email is required');
  }

  // Step 1: Get the student_id based on the email
  const query = 'SELECT student_id FROM students WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) return sendResponse(res, 500, 'Database error', err);

    if (results.length === 0) {
      return sendResponse(res, 404, 'Student not found');
    }

    const student_id = results[0].student_id;

    // Step 2: Fetch the attendance records for the student
    const attendanceQuery = `
      SELECT 
        a.attendance_id, 
        a.event_id, 
        a.volunteer_id, 
        a.attendance_status, 
        a.attended_at, 
        e.event_name, 
        v.volunteer_name
      FROM 
        attendance a
      JOIN events e ON a.event_id = e.event_id
      JOIN volunteers v ON a.volunteer_id = v.volunteer_id
      WHERE a.student_id = ?
    `;
    
    db.query(attendanceQuery, [student_id], (err, attendanceResults) => {
      if (err) return sendResponse(res, 500, 'Database error', err);

      if (attendanceResults.length === 0) {
        return sendResponse(res, 404, 'No attendance records found');
      }

      // Send the attendance data back to the frontend
      sendResponse(res, 200, 'Attendance records retrieved successfully', attendanceResults);
    });
  });
});

// Get upcoming events from tomorrow onwards
app.get('/student/upcoming-events', (req, res) => {
  const query = `
    SELECT event_id, event_name, event_description, event_date, event_time
    FROM events
    WHERE event_date >= DATE_ADD(CURDATE(), INTERVAL 1 DAY)  -- Get events from tomorrow onwards
    ORDER BY event_date ASC;
  `;

  db.query(query, (err, results) => {
    if (err) return sendResponse(res, 500, 'Database error', err);
    if (results.length === 0) {
      return sendResponse(res, 404, 'No upcoming events found');
    }
    sendResponse(res, 200, 'Upcoming events retrieved', results);
  });
});


// Update student profile based on email (email is not editable)
// Assuming you're using Express.js and MySQL
// Assuming you're using Express.js and MySQL
app.put('/student/update-profile', (req, res) => {
  const { first_name, last_name, phone_number, password } = req.body;
  const email = req.user.email;  // Assuming email is in req.user, set by middleware or token

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required' });
  }

  if (!first_name && !last_name && !phone_number && !password) {
    return res.status(400).json({ status: 'error', message: 'At least one field should be updated' });
  }

  // Prepare fields for updating, set the ones that are passed in
  const query = `
    UPDATE students 
    SET first_name = ?, last_name = ?, phone_number = ?, password = ? 
    WHERE email = ?;
  `;

  // Update only non-null fields
  db.query(query, [first_name || null, last_name || null, phone_number || null, password || null, email], (err, result) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to update profile' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Student not found' });
    }

    res.status(200).json({ status: 'success', message: 'Profile updated successfully' });
  });
});


// ================== VOLUNTEER ROUTES ==================
// User login middleware
function isAuthenticated(req, res, next) {
  if (!req.session.volunteer_id) {
    return res.status(401).json({ message: 'Unauthorized access. Please login first!' });
  }
  next();
}

// Register Volunteer (Sign Up)
app.post('/volunteer/register', (req, res) => {
  const { first_name, last_name, email, password, phone_number, location_latitude, location_longitude } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'First name, last name, email, and password are required!' });
  }

  // Check if email already exists
  const checkQuery = 'SELECT * FROM volunteers WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      // Insert the new volunteer into the database
      const insertQuery = 'INSERT INTO volunteers (first_name, last_name, email, password, phone_number, location_latitude, location_longitude) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [first_name, last_name, email, hashedPassword, phone_number, location_latitude, location_longitude], (err, results) => {
        if (err) {
          console.error('Error inserting volunteer:', err);
          return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        return res.status(201).json({ message: 'Volunteer registered successfully!' });
      });
    });
  });
});

// Login Volunteer
app.post('/volunteer/login', (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }

  // Check if the volunteer exists
  const query = 'SELECT * FROM volunteers WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error checking volunteer:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found!' });
    }

    // Compare password
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing password:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password!' });
      }

      // Create session for logged in volunteer
      req.session.volunteer_id = results[0].volunteer_id;
      req.session.email = results[0].email;

      return res.status(200).json({ message: 'Login successful!' });
    });
  });
});

// View Volunteer Profile (Authenticated)
app.get('/volunteer/profile', isAuthenticated, (req, res) => {
  const volunteer_id = req.session.volunteer_id;

  const query = 'SELECT first_name, last_name, email, phone_number, location_latitude, location_longitude FROM volunteers WHERE volunteer_id = ?';
  db.query(query, [volunteer_id], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Volunteer not found!' });
    }

    return res.status(200).json({ profile: results[0] });
  });
});

// Update Volunteer Profile (Authenticated)
app.put('/volunteer/profile', isAuthenticated, (req, res) => {
  const volunteer_id = req.session.volunteer_id;
  const { first_name, last_name, email, phone_number, location_latitude, location_longitude } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: 'First name, last name, and email are required!' });
  }

  // Update volunteer's profile
  const query = 'UPDATE volunteers SET first_name = ?, last_name = ?, email = ?, phone_number = ?, location_latitude = ?, location_longitude = ? WHERE volunteer_id = ?';

  db.query(query, [first_name, last_name, email, phone_number, location_latitude, location_longitude, volunteer_id], (err, results) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Volunteer not found!' });
    }

    return res.status(200).json({ message: 'Profile updated successfully!' });
  });
});



// ================== ADMIN ROUTES ==================

// Admin login

// ================== START SERVER ==================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
