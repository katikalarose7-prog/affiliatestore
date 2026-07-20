require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const path      = require('path');
const crypto    = require('crypto');

const app = express();

// ── Trust proxy (Render runs behind one) ────────────────────────────
app.set('trust proxy', 1);

// ── CORS ───────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',').map(o => o.trim().replace(/\/$/, ''));

console.log('✅  Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);             // Postman / curl
    const clean = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(clean)) return callback(null, true);
    console.warn('❌  CORS blocked:', origin);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

// ── Security headers (Helmet) ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', '*'],
      connectSrc:  ["'self'", ...allowedOrigins],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      objectSrc:   ["'none'"],
      frameSrc:    ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: process.env.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
  frameguard:     { action: 'deny' },
  noSniff:        true,
  xssFilter:      true,
  hidePoweredBy:  true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
}));

// ── Remove fingerprinting headers ──────────────────────────────────
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
});

// ── Rate limiting ──────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => req.path === '/health' || req.path === '/',
  message: { message: 'Too many requests. Please try again later.' },
  handler: (req, res) => {
    console.warn(`Rate limited: ${req.ip} → ${req.path}`);
    res.status(429).json({ message: 'Too many requests. Try again in 15 minutes.' });
  },
}));

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Wait 15 minutes.' },
  skipSuccessfulRequests: true,
}));

// ── Body parsing ───────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── MongoDB ────────────────────────────────────────────────────────
const MONGO_OPTS = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS:          45000,
  maxPoolSize:              10,
  minPoolSize:              2,
  heartbeatFrequencyMS:     10000,
  retryWrites:              true,
  retryReads:               true,
};

mongoose.connect(process.env.MONGO_URI, MONGO_OPTS)
  .then(async () => {
    console.log('✅  MongoDB connected');
    try {
      const Product = require('./models/Product');
      const products = await Product.find({})
        .select('name description image category affiliateLink rating featured audience region store')
        .limit(120).lean();
      for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
      }
      global.__productCache = { data: products, ts: Date.now() };
      console.log(`✅  Cache pre-warmed with ${products.length} products`);
    } catch (e) {
      console.warn('⚠️  Cache warm-up failed:', e.message);
    }
  })
  .catch(err => {
    console.error('❌  MongoDB failed:', err.message);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — reconnecting…');
  setTimeout(() => mongoose.connect(process.env.MONGO_URI, MONGO_OPTS), 3000);
});
mongoose.connection.on('error', err => console.error('❌  MongoDB error:', err.message));

// ── Routes ─────────────────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/banners',  require('./routes/banners'));
app.use('/api/auth',     require('./routes/auth'));

// ── Health check ───────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:  'ok',
    uptime:  Math.floor(process.uptime()),
    env:     process.env.NODE_ENV,
    db:      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ status: 'online', name: 'BestDealProducts API', version: '1.0.0' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Internal server error',
  });
});

// ── Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀  Server on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);

  // Render's self-ping (was Railway before)
  const renderURL = process.env.RENDER_EXTERNAL_URL; // e.g. https://your-service.onrender.com
  if (process.env.NODE_ENV === 'production' && renderURL) {
    const https = require('https');
    const pingURL = `${renderURL}/health`;
    setInterval(() => {
      https.get(pingURL, res => {
        console.log(`♻️   Self-ping ${res.statusCode}`);
      }).on('error', e => console.warn('⚠️  Self-ping failed:', e.message));
    }, 14 * 60 * 1000);
    console.log(`♻️   Self-ping active → ${pingURL}`);
  }
});