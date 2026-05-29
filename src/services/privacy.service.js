function maskReceiptData(receipt) {
  if (!receipt || typeof receipt !== 'object') {
    throw new Error('Receipt data is required');
  }

  return {
    store: receipt.store || 'Unknown store',
    date: receipt.date || 'Unknown date',
    total: receipt.total || 0,
    items: receipt.items || [],
    removedSensitiveFields: [
      'customerName',
      'email',
      'phone',
      'paymentCard'
    ]
  };
}

function createConsentDecision(consentGiven) {
  return {
    consentGiven: Boolean(consentGiven),
    sharingMode: consentGiven ? 'CONSENT_BASED_SHARING' : 'LOCAL_ONLY_PROCESSING',
    message: consentGiven
      ? 'User has allowed anonymised insights to be shared.'
      : 'Receipt data remains local and is not shared externally.'
  };
}

module.exports = {
  maskReceiptData,
  createConsentDecision
};