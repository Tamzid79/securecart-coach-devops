const express = require('express');
const { recommendDeals } = require('../services/discount.service');

const router = express.Router();

router.post('/deals', (req, res, next) => {
  try {
    const products = req.body.products || [];
    const budget = req.body.budget;
    const recommendations = recommendDeals(products, budget);

    res.status(200).json({
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;