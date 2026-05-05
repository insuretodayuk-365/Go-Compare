import QuoteCardD from "./QuoteCardD";
import QuoteCardM from "./QuoteCardM";


// Inside your quotes.map():
quotes.map(quote => (
  <div key={quote.id}>
    {/* Desktop — hidden below 600px via CSS */}
    <div className="show-desktop-card">
      <QuoteCardD
        quote={quote}
        onViewDetails={() => setSelectedQuote(quote)}
        onPriceUpdate={(id, newPrice) => {
          setQuotes(prev => prev.map(q => q.id === id ? { ...q, annualPrice: newPrice } : q));
          setAllQuotes(prev => prev.map(q => q.id === id ? { ...q, annualPrice: newPrice } : q));
        }}
      />
    </div>
    {/* Mobile — hidden above 600px via CSS */}
    <div className="show-mobile-card">
      <QuoteCardM
        quote={quote}
        onViewDetails={() => setSelectedQuote(quote)}
        onPriceUpdate={(id, newPrice) => {
          setQuotes(prev => prev.map(q => q.id === id ? { ...q, annualPrice: newPrice } : q));
          setAllQuotes(prev => prev.map(q => q.id === id ? { ...q, annualPrice: newPrice } : q));
        }}
      />
    </div>
  </div>
))