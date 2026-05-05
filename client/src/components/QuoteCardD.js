import React, { useState } from "react";
import "./QuoteCardD.css";
import api from "../api";

export default function QuoteCardD({ quote, onViewDetails, onQuoteUpdate }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(quote.annualPrice.toFixed(2));
  const [inputValExcess, setInputValExcess] = useState(
    quote.totalExcess.toString(),
  );
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
    const parsedExcess = parseFloat(inputValExcess);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Enter a valid price");
      return;
    }
    if (isNaN(parsedExcess) || parsedExcess < 0) {
      setError("Enter a valid excess");
      return;
    }
    setSaving(true);
    setError("");
    try {
      console.log(
        "Saving price:",
        parsed,
        "excess:",
        parsedExcess,
        "for quote:",
        quote.id,
      );
      const res = await api.patch(`/api/quotes/${quote.id}/price`, {
        price: parsed,
        excess: parsedExcess,
      });
      console.log("Response:", res.data);
      onQuoteUpdate && onQuoteUpdate(res.data.quote);
      setEditing(false);
    } catch (err) {
      console.log("Save error:", err);
      setError(err.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setInputVal(quote.annualPrice.toFixed(2));
    setInputValExcess(quote.totalExcess.toString());
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
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="qcd-logo-fallback" style={{ display: "none" }}>
              {quote.insurer}
            </div>
            <div className="qcd-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < quote.rating ? "filled" : ""}>
                  ★
                </span>
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
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1a4731"
                      strokeWidth="7"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#b1adad"
                      strokeWidth="5"
                    >
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
                    placeholder="Price"
                  />
                </div>
                <div className="qcd-edit-input-row">
                  <span className="qcd-edit-sym">£</span>
                  <input
                    className="qcd-excess-input"
                    type="number"
                    step="1"
                    min="0"
                    value={inputValExcess}
                    onChange={(e) => setInputValExcess(e.target.value)}
                    placeholder="Excess"
                  />
                </div>
                {error && <div className="qcd-edit-error">{error}</div>}
                <div className="qcd-edit-actions">
                  <button
                    className="qcd-save-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "..." : "Save"}
                  </button>
                  <button className="qcd-cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
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
                <div className="qcd-excess-pill">
                  Total excess: £{quote.totalExcess}
                </div>
              </>
            )}
          </div>

          {/* CTA */}
          <div className="qcd-col-cta">
            <button className="qcd-btn" onClick={onViewDetails}>
              View Details
            </button>
          </div>
        </div>
      </div>

      <div className="qcd-info-bar">
        <div className="qcd-info-badge">
          <svg
            width="14"
            height="14"
            viewBox="0 0 416.979 416.979"
            fill="#023619"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
    c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z 
    M237.6,340.786c0,3.217-2.607,5.822-5.822,5.822h-46.576c-3.215,0-5.822-2.605-5.822-5.822V167.885
    c0-3.217,2.607-5.822,5.822-5.822h46.576c3.215,0,5.822,2.604,5.822,5.822V340.786z 
    M208.49,137.901c-18.618,0-33.766-15.146-33.766-33.765
    c0-18.617,15.147-33.766,33.766-33.766c18.619,0,33.766,15.148,33.766,33.766
    C242.256,122.755,227.107,137.901,208.49,137.901z"
            />
          </svg>

          <span>Info</span>
        </div>
        <p className="qcd-info-msg">{quote.info}</p>
      </div>
    </div>
  );
}
