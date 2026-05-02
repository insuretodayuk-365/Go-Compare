import React from "react";
import QuoteCardD from "./QuoteCardD";
import QuoteCardM from "./QuoteCardM";
import "./QuoteCard.css";

export default function QuoteCard(props) {
  return (
    <div className="quote-card-wrapper">
      <div className="desktop-only">
        <QuoteCardD {...props} />
      </div>
      <div className="mobile-only">
        <QuoteCardM {...props} />
      </div>
    </div>
  );
}