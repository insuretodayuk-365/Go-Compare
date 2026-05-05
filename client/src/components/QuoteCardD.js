import React, { useState } from "react";
import "./QuoteCardD.css";
import api from "../api";

export default function QuoteCardD({ quote, onViewDetails, onPriceUpdate }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(quote.annualPrice.toFixed(2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const priceInt = Math.floor(quote.annualPrice);
  const priceDec = (quote.annualPrice % 1).toFixed(2).slice(2);

  const features = [
    "Legal assistance",
    "Breakdown cover",
    "Personal accident",
    "Courtesy car",
    "Windscreen cover",
  ];

  const handleSave = async () => {
    const parsed = parseFloat(inputVal);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid price");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await api.patch(`/api/quotes/${quote.id}/price`, { price: parsed });
      onPriceUpdate && onPriceUpdate(quote.id, res.data.quote.annualPrice);
      setEditing(false);
    } catch {
      setError("Failed to save. Try again.");
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
    <div className="qcd-card">
      <div className="qcd-main">
        <div className="qcd-grid">

          {/* Insurer & Rating */}
          <div className="qcd-col-insurer">
            <img
              src={quote.logo}
              alt={quote.insurer}
              className="qcd-logo"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
            <div className="qcd-logo-fallback" style={{ display: "none" }}>{quote.insurer}</div>
            <div className="qcd-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < quote.rating ? "filled" : ""}>★</span>
              ))}
            </div>
            <span className="qcd-defaqto">from defaqto</span>
          </div>

          {/* Features */}
          <div className="qcd-col-features">
            {features.map((f) => {
              const isCovered = quote.covered.includes(f);
              return (
                <div key={f} className="qcd-feat-item">
                  {isCovered ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="7">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b1adad" strokeWidth="5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                  <span className="qcd-feat-text">{f}</span>
                </div>
              );
            })}
          </div>

          {/* Price — editable */}
          <div className="qcd-col-price">
            <div className="qcd-price-label">Annual Price</div>

            {editing ? (
              <div className="qcd-edit-wrap">
                <div className="qcd-edit-input-row">
                  <span className="qcd-edit-sym">£</span>
                  <input
                    className="qcd-price-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    autoFocus
                  />
                </div>
                {error && <div className="qcd-edit-error">{error}</div>}
                <div className="qcd-edit-actions">
                  <button className="qcd-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "..." : "Save"}
                  </button>
                  <button className="qcd-cancel-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="qcd-price-display"
                  onClick={() => setEditing(true)}
                  title="Click to edit price"
                >
                  <span className="qcd-sym">£</span>
                  <span className="qcd-int">{priceInt}</span>
                  <span className="qcd-dec">.{priceDec}</span>
                  <span className="qcd-edit-icon">✎</span>
                </div>
                <div className="qcd-excess-pill">Total excess: £{quote.totalExcess}</div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="qcd-col-cta">
            <button className="qcd-btn" onClick={onViewDetails}>View Details</button>
          </div>
        </div>
      </div>

      <div className="qcd-info-bar">
        <div className="qcd-info-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="3">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Info</span>
        </div>
        <p className="qcd-info-msg">{quote.info}</p>
      </div>
    </div>
  );
}