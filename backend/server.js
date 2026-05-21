require('dotenv').config();
const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const path         = require('path');

const app = express();

// ─── Trust Railway/Render proxy ────────────────────────────────────────────
// Required so rate limiting works correctly behind Railway's reverse proxy
app.set('trust proxy', 1);

// ─── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''));

console.log('✅  Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow no-origin requests (Postman, curl, mobile)
    if (!origin) return callback(null, true);
    const clean = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(clean)) return callback(null, true);
    console.warn('❌  CORS blocked origin:', origin);
    console.warn('   Allowed:', allowedOrigins);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length'],
  optionsSuccessStatus: 200, // Some browsers send 204 issues
};

// Handle preflight OPTIONS requests BEFORE any other middleware
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

//csv
app.use('/api/products', require('./routes/productImport'))

// ─── Security Headers (Helmet) ─────────────────────────────────────────────
app.use(helmet({
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
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
  frameguard:       { action: 'deny' },
  noSniff:          true,
  xssFilter:        true,
  hidePoweredBy:    true,
  referrerPolicy:   { policy: 'strict-origin-when-cross-origin' },
}));

// ─── Rate Limiting ─────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
}));

// Strict limit on login route
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please wait 15 minutes.' },
}));

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Static Files (uploaded images) ───────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'public, max-age=604800, immutable');
  },
}));

// ─── Remove fingerprinting headers ─────────────────────────────────────────
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
});

// ─── MongoDB ───────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 8000,
})
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/banners',  require('./routes/banners'));
app.use('/api/auth',     require('./routes/auth'));

// Health check — used by Railway, UptimeRobot, etc.
app.get('/health', (req, res) => {
  res.json({
    status:   'ok',
    uptime:   Math.floor(process.uptime()),
    env:      process.env.NODE_ENV,
    version:  '1.0.0',
  });
});

// Root route — confirms backend is live
app.get('/', (req, res) => {
  res.json({
    status:  'online',
    name:    'PrimeOffers Store API',
    version: '1.0.0',
    docs:    'Use /health to check uptime. API endpoints start with /api/',
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', hint: 'API routes start with /api/' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  // Never leak stack traces in production
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ─── Start Server ──────────────────────────────────────────────────────────
// Railway injects PORT automatically — always use process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  Server running on port ${PORT}`);
  console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}`);
});