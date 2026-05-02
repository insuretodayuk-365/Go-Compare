import React, { useEffect } from "react";
import "./QuoteDetailPanel.css";
import { useAuth } from "../context/AuthContext";

function Stars({ count, total = 5 }) {
  return (
    <div className="dp-stars">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`dp-star ${i < count ? "filled" : ""}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function CoverItem({ label, included }) {
  return (
    <div className={`dp-cover-item ${included ? "dp-yes" : "dp-no"}`}>
      {included ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a4731"
          strokeWidth="5"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#aaa"
          strokeWidth="5"
        >
          <path d="M6 6L18 18M6 18L18 6" />
        </svg>
      )}
      <span>{label}</span>
      <svg
        className="dp-arrow"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

function AddonItem({ label }) {
  return (
    <div className="dp-cover-item dp-addon">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        strokeWidth="5"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>{label}</span>
      <svg
        className="dp-arrow"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#aaa"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function QuoteDetailPanel({ quote, onClose }) {
  const { user } = useAuth();

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const priceInt = Math.floor(quote.annualPrice);
  const priceDec = (quote.annualPrice % 1).toFixed(2).slice(2);

  return (
    <>
      <div className="dp-backdrop" onClick={onClose} />
      <aside className="dp-panel">
        {/* ── Header ── */}
        <div className="dp-header">
          <div className="dp-header-left">
            <img
              src={quote.logo}
              alt={quote.insurer}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="dp-logo-fallback" style={{ display: "none" }}>
              {quote.insurer}
            </div>
            <div className="dp-tier-badge">{quote.tier}</div>
          </div>
          <button className="dp-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="dp-body">
          {/* Price */}
          <div className="dp-price-section">
            <div className="dp-stars-container">
              <Stars count={quote.rating} />
              <div className="dp-defaqto">from defaqto</div>
            </div>
            <div className="dp-price-title">Total annual price</div>
            <div className="dp-price-row">
              <span className="dp-price-sym">£</span>
              <span className="dp-price-int">{priceInt}</span>
              <span className="dp-price-dec">.{priceDec}</span>
            </div>
            <p className="dp-price-note">
              Insurance quotes are priced in real time, tomorrow's prices might
              look different
            </p>
          </div>

          {/* Excess */}
          <div className="dp-excess-box">
            <div className="dp-excess-row main">
              <span>Total excess on this policy</span>
              <strong>£{quote.totalExcess}</strong>
            </div>
            <div className="dp-excess-row sub">
              <span>Voluntary</span>
              <span>£{quote.voluntaryExcess}</span>
            </div>
            <div className="dp-excess-row sub">
              <span>Compulsory</span>
              <span>£{quote.compulsoryExcess}</span>
            </div>
            <div className="dp-excess-note">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#446"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Insurers may add an additional excess for young or inexperienced
              drivers.
            </div>
          </div>

          {/* Reward */}
          <div className="dp-reward">
            <div className="dp-reward-mascot">
              <img
                src="/images/mascot.png"
                alt=""
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <div className="dp-reward-text">
              <h4>Free £250 excess refund reward</h4>
              <p>
                Look out for an email from us letting you know how to claim your
                cover.
              </p>
            </div>
          </div>
          <div className="dp-docs">
            <a href="#!">Insurance information document</a>
            <a href="#!">Demands &amp; needs</a>
          </div>

          {/* Overview */}
          <div className="dp-section">
            <div className="dp-section-title">Overview</div>
            <div className="dp-overview">
              <div className="dp-ov-row">
                <span>Proposer name</span>
                <strong>
                  {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                </strong>
              </div>
              <div className="dp-ov-row">
                <span>Additional driver(s)</span>
                <strong>None</strong>
              </div>
              <div className="dp-ov-row">
                <span>Start date</span>
                <strong>1st May 2026</strong>
              </div>
              <div className="dp-ov-row">
                <span>Cover type</span>
                <strong>Comprehensive</strong>
              </div>
              <div className="dp-ov-row">
                <span>No claims bonus protected</span>
                <strong>No</strong>
              </div>
            </div>
          </div>

          {/* Cover */}
          <div className="dp-section">
            <div className="dp-section-title">Cover with this policy</div>

            <div className="dp-group-label">Covered</div>
            {quote.covered.map((item) => (
              <CoverItem key={item} label={item} included={true} />
            ))}

            {quote.addons.length > 0 && (
              <>
                <div className="dp-group-label" style={{ marginTop: 14 }}>
                  Add-ons
                </div>
                {quote.addons.map((item) => (
                  <AddonItem key={item} label={item} />
                ))}
              </>
            )}

            {quote.notCovered.length > 0 && (
              <>
                <div
                  className="dp-group-label dp-not-covered"
                  style={{ marginTop: 14 }}
                >
                  Not covered
                </div>
                {quote.notCovered.map((item) => (
                  <CoverItem key={item} label={item} included={false} />
                ))}
              </>
            )}
          </div>

          {/* Fees */}
          <div className="dp-section">
            <div className="dp-section-title">Fees, excesses and your info</div>
            <div className="dp-fees-grid">
              {["Fees", "Claims", "Excesses", "Demands & needs"].map((item) => (
                <div key={item} className="dp-fees-item">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="dp-footer">
          <a
            href="#!"
            className="dp-cta-btn"
            onClick={(e) => e.preventDefault()}
          >
            Go to insurer's site
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </aside>
    </>
  );
}
