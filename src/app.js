const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const client = require('prom-client');

const healthRoutes = require('./routes/health.routes');
const shoppingRoutes = require('./routes/shopping.routes');
const recommendationRoutes = require('./routes/recommendations.routes');
const receiptRoutes = require('./routes/receipts.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

if (!client.register.getSingleMetric('process_cpu_user_seconds_total')) {
  client.collectDefaultMetrics();
}

let requestCounter = client.register.getSingleMetric('securecart_http_requests_total');

if (!requestCounter) {
  requestCounter = new client.Counter({
    name: 'securecart_http_requests_total',
    help: 'Total number of HTTP requests handled by SecureCart Coach API',
    labelNames: ['method', 'route', 'status_code']
  });
}

app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    });
  });
  next();
});

app.use('/health', healthRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/receipts', receiptRoutes);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.use(errorHandler);

module.exports = app;