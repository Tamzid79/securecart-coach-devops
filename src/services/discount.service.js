function round(value) {
  return Math.round(value * 100) / 100;
}

function calculateDiscount(originalPrice, currentPrice) {
  const original = Number(originalPrice);
  const current = Number(currentPrice);

  if (original <= 0 || current < 0) {
    throw new Error('Prices must be valid positive numbers');
  }

  const saving = original - current;
  const discountPercent = round((saving / original) * 100);

  return {
    originalPrice: original,
    currentPrice: current,
    saving: round(saving),
    discountPercent
  };
}

function recommendDeals(products, budget) {
  if (!Array.isArray(products)) {
    throw new Error('Products must be provided as an array');
  }

  return products
    .map((product) => {
      const discount = calculateDiscount(product.originalPrice, product.currentPrice);

      return {
        name: product.name,
        category: product.category || 'general',
        affordable: budget ? product.currentPrice <= budget : true,
        explanation: `${product.name} saves $${discount.saving} compared to the original price.`,
        ...discount
      };
    })
    .sort((a, b) => b.discountPercent - a.discountPercent);
}

module.exports = {
  calculateDiscount,
  recommendDeals
};