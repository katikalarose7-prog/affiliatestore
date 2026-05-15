require('dotenv').config();
const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const path         = require('path');

const app = express();

// ─── CORS — only allow your frontend domains ───────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ─── SECURITY HEADERS via Helmet ──────────────────────────────────────────
app.use(helmet({
  // Allow images served from /uploads to be displayed in browser
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", 'data:', 'blob:', '*'],
      connectSrc:  ["'self'", ...allowedOrigins],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      objectSrc:   ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  // Strict HTTPS (enable when deployed behind HTTPS)
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
  // Prevent click-jacking
  frameguard: { action: 'deny' },
  // Prevent MIME sniffing
  noSniff: true,
  // XSS protection
  xssFilter: true,
  // Hide Express signature
  hidePoweredBy: true,
  // Referrer policy — don't leak URL in referrer header
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ─── RATE LIMITING ────────────────────────────────────────────────────────

// Global: 200 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
}));

// Auth endpoint: 10 attempts / 15 min (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please wait 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);

// ─── BODY PARSING ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));   // limit payload size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── STATIC FILES ─────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    // Cache uploaded images for 7 days
    res.set('Cache-Control', 'public, max-age=604800, immutable');
  }
}));

// ─── REMOVE FINGERPRINTING HEADERS ────────────────────────────────────────
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
});

// ─── MONGODB ──────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => { console.error('❌  MongoDB error:', err.message); process.exit(1); });

// ─── ROUTES ───────────────────────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/banners',  require('./routes/banners'));
app.use('/api/auth',     require('./routes/auth'));

// Health check (used by Render / UptimeRobot)
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// ─── START ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  Server running on port ${PORT}`));