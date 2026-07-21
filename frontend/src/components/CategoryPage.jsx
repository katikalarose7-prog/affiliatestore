/**
 * CategoryPage.jsx
 *
 * Category landing page with:
 * - Editorial buying guide (satisfies Amazon content quality requirement)
 * - Affiliate disclosure (required)
 * - Product grid
 */

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
// Buying guide content per category — customise for your categories
const BUYING_GUIDES = {
  Electronics: {
    intro: `Finding the right electronics deal can save you thousands. 
    We hand-pick only products with strong user ratings (4★ and above) 
    and verified Amazon seller history, so you shop with confidence.`,
    tips: [
      "Always check the seller rating — prefer Amazon Fulfilled or Amazon itself.",
      "Compare the 'Maximum Retail Price' vs deal price; genuine discounts are usually 20–40%.",
      "Electronics from Amazon.in include a standard manufacturer warranty valid in India.",
      "For gadgets, read at least 10 verified reviews before buying.",
    ],
  },
  Fashion: {
    intro: `Our fashion deals are sourced from top brands on Amazon.in 
    with size-inclusive options. We update picks daily so you always 
    see in-stock, fast-delivery items.`,
    tips: [
      "Use Amazon's size chart for every brand — sizing varies widely.",
      "Filter by 'Amazon Delivered' for reliable delivery timelines.",
      "Check the return policy before buying — most fashion items have a 30-day return.",
      "Colour accuracy varies on screen; read reviews mentioning colour match.",
    ],
  },
  "Home & Kitchen": {
    intro: `Home and kitchen deals on DealZone are curated for Indian homes — 
    compatible voltage (220V), ISI-marked appliances where applicable, 
    and brands with strong after-sales service in India.`,
    tips: [
      "For appliances, confirm the wattage suits your home's power supply.",
      "Check if the product includes an Indian power plug — some imports don't.",
      "Read Q&A sections on Amazon for real-world usage tips from Indian buyers.",
      "Prefer products with at least 500 reviews for reliable quality signals.",
    ],
  },
  // Add more categories as needed
  Default: {
    intro: `DealZone curates the best Amazon.in deals across categories, 
    updated daily. Every product is selected based on value for money, 
    customer ratings, and availability for Indian buyers.`,
    tips: [
      "All links take you directly to Amazon.in — India's most trusted marketplace.",
      "Prices shown are approximate and may vary; always confirm on Amazon.",
      "We earn a small commission if you buy via our links, at no extra cost to you.",
      "Products with Prime badge ship faster and are eligible for easy returns.",
    ],
  },
};

export default function CategoryPage({ category, products = [] }) {
  const guide = BUYING_GUIDES[category] || BUYING_GUIDES.Default;

  return (
    <main className="category-page">

      {/* ── Affiliate Disclosure (required by Amazon) ── */}
      <div className="affiliate-disclosure">
        <p>
          <strong>Disclosure:</strong> DealZone is a participant in the Amazon
          Associates Program, an affiliate advertising program designed to
          provide a means for sites to earn advertising fees by advertising and
          linking to Amazon.in. When you click our links and make a purchase,
          we may earn a small commission at no additional cost to you.
        </p>
      </div>

      {/* ── Category Header ── */}
      <section className="category-header">
        <h1>{category} Deals</h1>
        <p className="category-intro">{guide.intro}</p>
      </section>

      {/* ── Buying Guide (editorial content for Amazon compliance) ── */}
      <section className="buying-guide">
        <h2>Smart Buying Tips for {category}</h2>
        <ul>
          {guide.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* ── Product Grid ── */}
      <section className="product-grid">
        <h2>Today's Best {category} Deals</h2>
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 16,
  }}
>
  {products.map((product) => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>
        )}
      </section>

      {/* ── Price Disclaimer ── */}
      <p className="price-disclaimer">
        * Prices and availability are subject to change. Please check Amazon.in
        for the latest price before purchasing.
      </p>
    </main>
  );
}