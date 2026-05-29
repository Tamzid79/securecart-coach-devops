const express = require('express');
const { maskReceiptData, createConsentDecision } = require('../services/privacy.service');

const router = express.Router();

router.post('/analyse', (req, res, next) => {
  try {
    const safeReceipt = maskReceiptData(req.body.receipt);
    const consent = createConsentDecision(req.body.consentGiven);

    res.status(200).json({
      safeReceipt,
      consent,
      insight: 'Receipt analysed successfully using privacy-first processing.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;