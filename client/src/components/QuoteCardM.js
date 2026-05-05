import React, { useState } from "react";
import "./QuoteCardM.css";
import api from "../api";

export default function QuoteCardM({ quote, onViewDetails, onPriceUpdate }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(quote.annualPrice.toFixed(2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const priceInt = Math.floor(quote.annualPrice);
  const priceDec = (quote.annualPrice % 1).toFixed(2).slice(2);

  const handleSave = async () => {
    const parsed = parseFloat(inputVal);
    if (isNaN(parsed) || parsed <= 0) { setError("Enter a valid price"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await api.patch(`/api/quotes/${quote.id}/price`, { price: parsed });
      onPriceUpdate && onPriceUpdate(quote.id, res.data.quote.annualPrice);
      setEditing(false);
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setInputVal(quote.annualPrice.toFixed(2));
    setEditing(false);
    setError("");
  };

  return (
    <div className="qcm-card">
      <div className="qcm-top-section">

        {/* Left: logo + rating + price */}
        <div className="qcm-left-col">
          <img
            src={quote.logo}
            alt={quote.insurer}
            className="qcm-logo"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
          <div className="qcm-logo-fallback" style={{ display: "none" }}>{quote.insurer}</div>
          <div className="qcm-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < quote.rating ? "filled" : ""}>★</span>
            ))}
          </div>
          <span className="qcm-defaqto">from defaqto</span>

          <div className="qcm-price-stack">
            <div className="qcm-price-label">Annual Price</div>

            {editing ? (
              <div className="qcm-edit-wrap">
                <div className="qcm-edit-row">
                  <span className="qcm-edit-sym">£</span>
                  <input
                    className="qcm-price-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    autoFocus
                  />
                </div>
                {error && <div className="qcm-edit-error">{error}</div>}
                <div className="qcm-edit-actions">
                  <button className="qcm-save-btn" onClick={handleSave} disabled={saving}>{saving ? "..." : "Save"}</button>
                  <button className="qcm-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="qcm-price-val"
                  onClick={() => setEditing(true)}
                  title="Tap to edit price"
                >
                  <span className="sym">£</span>
                  <span className="int">{priceInt}</span>
                  <span className="dec">.{priceDec}</span>
                  <span className="qcm-edit-icon">✎</span>
                </div>
                <div className="qcm-excess">Total excess: £{quote.totalExcess}</div>
              </>
            )}
          </div>
        </div>

        {/* Right: covered + add-ons */}
        <div className="qcm-right-col">
          <div className="qcm-feature-group">
            <div className="qcm-group-label">Covered</div>
            {quote.covered.map(f => (
              <div key={f} className="qcm-line covered">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="8">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
          {quote.addons.length > 0 && (
            <div className="qcm-feature-group">
              <div className="qcm-group-label">Add-ons</div>
              {quote.addons.map(f => (
                <div key={f} className="qcm-line addon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#99918f" strokeWidth="7">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
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