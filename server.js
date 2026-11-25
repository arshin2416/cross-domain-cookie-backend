const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;

// Allow requests specifically from your React frontend port
app.use(cors({
  origin: 'https://cross-domain-cookie-frontend.pages.dev', // Change to 'http://localhost:3000' if using Create React App
  credentials: true                // Required to allow cookies across origins
}));

app.use(express.json());
app.use(cookieParser());

// Route 1: Set the cookie on the backend origin (localhost:5000)
app.post('/api/login', (req, res) => {
  res.cookie('auth_token', 'my_secret_cookie_value_123', {
    httpOnly: true,   // Prevents JS from reading the cookie
    secure: true,     // Works on http://localhost in Chrome/Edge; requires HTTPS in production
    sameSite: 'none', // Allows cross-origin cookie transmission
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.status(200).json({ message: 'Success! Cookie set on backend (port 5000).' });
});

// Route 2: Read the cookie sent back from the browser
app.get('/api/profile', (req, res) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Failed! No cookie found in request.' });
  }

  res.status(200).json({ message: `Verified! Backend received cookie: ${token}` });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
