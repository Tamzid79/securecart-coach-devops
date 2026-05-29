function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be provided as an array');
  }

  return roundCurrency(
    items.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0)
  );
}

function getBudgetStatus(total, budget) {
  if (budget === undefined || budget === null) {
    return 'NO_BUDGET_SET';
  }

  if (total > budget) {
    return 'OVER_BUDGET';
  }

  if (total >= budget * 0.9) {
    return 'NEAR_LIMIT';
  }

  return 'WITHIN_BUDGET';
}

function createShoppingPlan(payload) {
  const items = payload.items || [];
  const budget = payload.budget;
  const total = calculateTotal(items);

  return {
    itemCount: items.length,
    total,
    budget,
    remainingBudget: budget ? roundCurrency(budget - total) : null,
    status: getBudgetStatus(total, budget),
    privacyNote: 'SecureCart Coach processes shopping data with privacy-first design.'
  };
}

module.exports = {
  calculateTotal,
  getBudgetStatus,
  createShoppingPlan
};