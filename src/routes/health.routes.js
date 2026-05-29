const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'UP',
    service: 'SecureCart Coach API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;