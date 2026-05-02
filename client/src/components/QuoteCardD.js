import React from "react";
import "./QuoteCardD.css";

export default function QuoteCardD({ quote, onViewDetails }) {
  const priceInt = Math.floor(quote.annualPrice);
  const priceDec = (quote.annualPrice % 1).toFixed(2).slice(2);
  const features = ["Legal assistance", "Breakdown cover", "Personal accident", "Courtesy car", "Windscreen cover"];

  return (
    <div className="qcd-card">
      <div className="qcd-main">
        <div className="qcd-grid">
          {/* Insurer & Rating */}
          <div className="qcd-col-insurer">
            <img src={quote.logo} alt={quote.insurer} className="qcd-logo" />
            <div className="qcd-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < quote.rating ? "filled" : ""}>★</span>
              ))}
            </div>
            <span className="qcd-defaqto">from defaqto</span>
          </div>

          {/* Features - Flexes in the middle */}
          <div className="qcd-col-features">
            {features.map((f) => {
              const isCovered = quote.covered.includes(f);
              return (
                <div key={f} className="qcd-feat-item">
                  {isCovered ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="7">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a9690" strokeWidth="3.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                  <span className="qcd-feat-text">{f}</span>
                </div>
              );
            })}
          </div>

          {/* Price - Fixed Width */}
          <div className="qcd-col-price">
            <div className="qcd-price-label">Annual Price</div>
            <div className="qcd-price-display">
              <span className="qcd-sym">£</span>
              <span className="qcd-int">{priceInt}</span>
              <span className="qcd-dec">.{priceDec}</span>
            </div>
            <div className="qcd-excess-pill">Total excess: £{quote.totalExcess}</div>
          </div>

          {/* CTA - Fixed Width */}
          <div className="qcd-col-cta">
            <button className="qcd-btn" onClick={onViewDetails}>
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className="qcd-info-bar">
        <div className="qcd-info-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="3">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span>Info</span>
        </div>
        <p className="qcd-info-msg">{quote.info}</p>
      </div>
    </div>
  );
}