require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');
const { initDB } = require('./models/db');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// CSRF mitigation: reject non-JSON requests on mutating routes
// JWT in Authorization header (not cookies) already prevents CSRF,
// this adds an extra layer by enforcing Content-Type on POST/PUT/PATCH
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const ct = req.headers['content-type'] || '';
    if (!ct.includes('application/json')) {
      return res.status(415).json({ error: 'Content-Type must be application/json' });
    }
  }
  next();
});

// API versioning
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/tasks', require('./routes/tasks'));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('DB init failed:', err.message);
  process.exit(1);
});
