import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import QuoteCardD from "../components/QuoteCardD";
import QuoteCardM from "../components/QuoteCardM";
import QuoteDetailPanel from "../components/QuoteDetailPanel";
import CoverSidebar from "../components/CoverSidebar";
import "./ResultsPage.css";

const ADDONS = [
  "Legal assistance",
  "Breakdown cover",
  "Personal accident",
  "Courtesy car",
  "Windscreen cover",
];

export default function ResultsPage() {
  const [allQuotes, setAllQuotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // Filter state
  const [coverStartDate, setCoverStartDate] = useState("1 May 2026");
  const [coverType, setCoverType] = useState("Comprehensive");
  const [voluntaryExcess, setVoluntaryExcess] = useState("£100");
  const [protectNoClaims, setProtectNoClaims] = useState("No");
  const [payment, setPayment] = useState("Annually");
  const [addons, setAddons] = useState({
    "Legal assistance": false,
    "Breakdown cover": false,
    "Personal accident": false,
    "Courtesy car": false,
    "Windscreen cover": false,
  });

  useEffect(() => {
    api
      .get("/api/quotes")
      .then((r) => {
        setAllQuotes(r.data.quotes);
        setQuotes(r.data.quotes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleAddon = (name) =>
    setAddons((prev) => ({ ...prev, [name]: !prev[name] }));

  const buildTags = useCallback((opts) => {
    const tags = [];
    if (opts.voluntaryExcess && opts.voluntaryExcess !== "None")
      tags.push(`Excess ≤ ${opts.voluntaryExcess}`);
    if (opts.coverType && opts.coverType !== "Comprehensive")
      tags.push(opts.coverType);
    if (opts.protectNoClaims === "Yes") tags.push("No claims protected");
    if (opts.payment === "Monthly") tags.push("Monthly payment");
    Object.entries(opts.addons || {}).forEach(([k, v]) => {
      if (v) tags.push(k);
    });
    return tags;
  }, []);

  const handleUpdateQuotes = useCallback(
    async (overrides = {}) => {
      const opts = {
        voluntaryExcess,
        addons,
        protectNoClaims,
        payment,
        coverType,
        ...overrides,
      };
      setFiltering(true);
      setShowMobileSidebar(false);
      try {
        const res = await api.post("/api/quotes/filter", opts);
        setQuotes(res.data.quotes);
        setActiveFilters(buildTags(opts));
      } catch {
        // Client-side fallback
        const maxVol =
          opts.voluntaryExcess === "None"
            ? 0
            : parseInt((opts.voluntaryExcess || "").replace(/\D/g, "")) || 0;
        const required = Object.entries(opts.addons || {})
          .filter(([, v]) => v)
          .map(([k]) => k);
        const filtered = allQuotes.filter((q) => {
          if (maxVol > 0 && q.voluntaryExcess > maxVol) return false;
          if (required.length > 0) {
            const all = [...q.covered, ...q.addons];
            if (!required.every((a) => all.includes(a))) return false;
          }
          return true;
        });
        setQuotes(filtered.sort((a, b) => a.annualPrice - b.annualPrice));
        setActiveFilters(buildTags(opts));
      } finally {
        setFiltering(false);
      }
    },
    [
      voluntaryExcess,
      addons,
      protectNoClaims,
      payment,
      coverType,
      allQuotes,
      buildTags,
    ],
  );

  const clearAllFilters = () => {
    const reset = {
      voluntaryExcess: "£100",
      coverType: "Comprehensive",
      protectNoClaims: "No",
      payment: "Annually",
      addons: {
        "Legal assistance": false,
        "Breakdown cover": false,
        "Personal accident": false,
        "Courtesy car": false,
        "Windscreen cover": false,
      },
    };
    setVoluntaryExcess(reset.voluntaryExcess);
    setCoverType(reset.coverType);
    setProtectNoClaims(reset.protectNoClaims);
    setPayment(reset.payment);
    setAddons(reset.addons);
    setActiveFilters([]);
    setQuotes(allQuotes);
  };

  return (
    <div className="results-page">
      <div className="mobile-topbar hide-desktop">
        <button
          className="mobile-edit-btn"
          onClick={() => setShowMobileSidebar(true)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Edit quote
        </button>
        <button className="mobile-cover-btn">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          Refine results {Object.values(addons).filter(Boolean).length}/5
        </button>
      </div>

      <div className="results-layout">
        <aside className="sidebar hide-mobile">
          <CoverSidebar
            coverStartDate={coverStartDate}
            setCoverStartDate={setCoverStartDate}
            coverType={coverType}
            setCoverType={setCoverType}
            voluntaryExcess={voluntaryExcess}
            setVoluntaryExcess={setVoluntaryExcess}
            protectNoClaims={protectNoClaims}
            setProtectNoClaims={setProtectNoClaims}
            payment={payment}
            setPayment={setPayment}
            addons={addons}
            toggleAddon={toggleAddon}
            ADDONS={ADDONS}
            onUpdate={handleUpdateQuotes}
          />
        </aside>

        <main className="results-main">
          <div className="addons-banner">
            <div className="addons-banner-text">
              Add or remove add-ons from quotes
            </div>

            <button
              className="addons-banner-btn"
              onClick={() => setShowMobileSidebar(true)}
            >
              <span>
                Add-ons {Object.values(addons).filter(Boolean).length}/5
              </span>

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {activeFilters.length > 0 && (
            <div className="filter-chips">
              <span className="filter-chips-label">Active filters:</span>
              {activeFilters.map((tag) => (
                <span key={tag} className="filter-chip">
                  {tag}
                </span>
              ))}
              <button className="clear-filters" onClick={clearAllFilters}>
                Clear all
              </button>
            </div>
          )}

          <p className="results-count">
            {filtering ? (
              <span className="filtering-indicator">
                <span className="mini-spinner" /> Updating quotes...
              </span>
            ) : (
              <strong>
                {quotes.length} {quotes.length === 1 ? "quote" : "quotes"}{" "}
                shown.
              </strong>
            )}
          </p>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Finding the best quotes for you...</p>
            </div>
          ) : filtering ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Applying your filters...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No quotes match your filters</h3>
              <p>
                Try adjusting your voluntary excess or removing some add-on
                requirements.
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: 16 }}
                onClick={clearAllFilters}
              >
                Reset all filters
              </button>
            </div>
          ) : (
            quotes.map((quote) => (
              <div key={quote.id}>
                {/* Desktop — hidden below 600px via CSS */}
                <div className="show-desktop-card">
                  <QuoteCardD
                    quote={quote}
                    onViewDetails={() => setSelectedQuote(quote)}
                    onQuoteUpdate={(updatedQuote) => {
                      console.log("Updating quote:", updatedQuote);

                      setQuotes((prev) =>
                        [...prev]
                          .map((q) =>
                            q.id === updatedQuote.id ? updatedQuote : q,
                          )
                          .sort((a, b) => a.annualPrice - b.annualPrice),
                      );

                      setAllQuotes((prev) =>
                        [...prev]
                          .map((q) =>
                            q.id === updatedQuote.id ? updatedQuote : q,
                          )
                          .sort((a, b) => a.annualPrice - b.annualPrice),
                      );
                    }}
                  />
                </div>
                {/* Mobile — hidden above 600px via CSS */}
                <div className="show-mobile-card">
                  <QuoteCardM
                    quote={quote}
                    onViewDetails={() => setSelectedQuote(quote)}
                    onQuoteUpdate={(updatedQuote) => {
                      console.log("Updating quote:", updatedQuote);

                      setQuotes((prev) =>
                        [...prev]
                          .map((q) =>
                            q.id === updatedQuote.id ? updatedQuote : q,
                          )
                          .sort((a, b) => a.annualPrice - b.annualPrice),
                      );

                      setAllQuotes((prev) =>
                        [...prev]
                          .map((q) =>
                            q.id === updatedQuote.id ? updatedQuote : q,
                          )
                          .sort((a, b) => a.annualPrice - b.annualPrice),
                      );
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      {selectedQuote && (
        <QuoteDetailPanel
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}

      {showMobileSidebar && (
        <>
          <div
            className="sidebar-overlay"
            onClick={() => setShowMobileSidebar(false)}
          />
          <div className="mobile-sidebar-drawer">
            <div className="mobile-sidebar-inner">
              <div className="mobile-sidebar-header">
                <h3>Edit quote</h3>
                <button onClick={() => setShowMobileSidebar(false)}>✕</button>
              </div>
              <CoverSidebar
                coverStartDate={coverStartDate}
                setCoverStartDate={setCoverStartDate}
                coverType={coverType}
                setCoverType={setCoverType}
                voluntaryExcess={voluntaryExcess}
                setVoluntaryExcess={setVoluntaryExcess}
                protectNoClaims={protectNoClaims}
                setProtectNoClaims={setProtectNoClaims}
                payment={payment}
                setPayment={setPayment}
                addons={addons}
                toggleAddon={toggleAddon}
                ADDONS={ADDONS}
                onUpdate={handleUpdateQuotes}
                isMobile
                onClose={() => setShowMobileSidebar(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
