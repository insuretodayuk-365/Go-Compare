import React from "react";
import "./QuoteCardM.css";

export default function QuoteCardM({ quote, onViewDetails }) {
  const priceInt = Math.floor(quote.annualPrice);
  const priceDec = (quote.annualPrice % 1).toFixed(2).slice(2);

  return (
    <div className="qcm-card">
      <div className="qcm-top-section">
        {/* Left: Insurer + Price underneath */}
        <div className="qcm-left-col">
          <img src={quote.logo} alt={quote.insurer} className="qcm-logo" />
          <div className="qcm-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < quote.rating ? "filled" : ""}>★</span>
            ))}
          </div>
          <span className="qcm-defaqto">from defaqto</span>
          
          <div className="qcm-price-stack">
            <div className="qcm-price-label">Annual Price</div>
            <div className="qcm-price-val">
              <span className="sym">£</span>{priceInt}<span className="dec">.{priceDec}</span>
            </div>
            <div className="qcm-excess">Total excess: £{quote.totalExcess}</div>
          </div>
        </div>

        {/* Right: Features Grid */}
        <div className="qcm-right-col">
          <div className="qcm-feature-group">
            <div className="qcm-group-label">Covered</div>
            {quote.covered.slice(0, 3).map(f => (
              <div key={f} className="qcm-line covered">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="8"><path d="M20 6L9 17l-5-5" /></svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className="qcm-feature-group">
            <div className="qcm-group-label">Add-ons</div>
            {quote.addons.slice(0, 3).map(f => (
              <div key={f} className="qcm-line addon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#86807f" strokeWidth="7"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="qcm-cta-area">
        <button className="qcm-btn" onClick={onViewDetails}>View Details</button>
      </div>

      <div className="qcm-info-bar">
        <div className="qcm-info-badge">Info</div>
        <p className="qcm-info-text">{quote.info}</p>
      </div>
    </div>
  );
}