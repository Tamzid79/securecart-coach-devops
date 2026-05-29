const express = require('express');
const { createShoppingPlan } = require('../services/budget.service');

const router = express.Router();

router.post('/plan', (req, res, next) => {
  try {
    const plan = createShoppingPlan(req.body);
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
