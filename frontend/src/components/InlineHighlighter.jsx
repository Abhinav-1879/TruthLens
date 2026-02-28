import React from 'react';

const InlineHighlighter = ({ text, claims }) => {
    if (!claims || claims.length === 0) return <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>;

    // Sort claims by quote length (descending) to match longest phrases first (simple heuristic)
    // In a real production app, we'd need robust offset matching from backend.
    const sortedClaims = [...claims].sort((a, b) => b.quote.length - a.quote.length);

    let parts = [];
    let lastIndex = 0;

    // Naive replacement approach (for demo purposes) - matches first occurrence
    // A robust MNC version would use exact start/end indices from backend.

    // Actually, let's try to map the text to segments. 
    // Since we don't have indices, we can try to highlight known quotes.
    // We will split the text by the quotes we find.

    // Strategy: 
    // 1. Mark ranges in the text that need highlighting.
    // 2. Render the text.

    // Simpler for now: match verifyable quotes and wrap them.
    // Note: Overlapping quotes might break this simple logic, but sufficient for demo.

    const getHighlightClass = (status) => {
        switch (status) {
            case 'verified': return 'bg-green-500/20 text-green-200 border-b-2 border-green-500/50';
            case 'contradicted': return 'bg-red-500/20 text-red-200 border-b-2 border-red-500/50';
            case 'unverified': return 'bg-amber-500/20 text-amber-200 border-b-2 border-amber-500/50';
            default: return '';
        }
    };

    // We'll use a library-free approach for simplicity in this specific file
    // replacing known quotes with tokens, then rendering tokens.

    let processedText = text;
    // This is a bit hacky for overlapping, but works for distinct sentences.

    return (
        <div className="glass-panel p-6 rounded-2xl font-mono text-sm leading-8 text-slate-300 whitespace-pre-wrap shadow-inner bg-slate-950/30">
            {text.split(/(\n+)/).map((line, i) => (
                <React.Fragment key={i}>
                    {line.match(/\n+/) ? line : (
                        renderLineWithHighlights(line, sortedClaims, getHighlightClass)
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const renderLineWithHighlights = (line, claims, getHighlightClass) => {
    // Find all matches in this line
    let matches = [];
    claims.forEach(claim => {
        if (!claim.quote || claim.quote.length < 3) return;
        const idx = line.indexOf(claim.quote);
        if (idx !== -1) {
            matches.push({ start: idx, end: idx + claim.quote.length, claim });
        }
    });

    // Sort by start position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlaps (naive: keep first)
    let filtered = [];
    let lastEnd = 0;
    matches.forEach(m => {
        if (m.start >= lastEnd) {
            filtered.push(m);
            lastEnd = m.end;
        }
    });

    if (filtered.length === 0) return <span>{line}</span>;

    let result = [];
    let lastIdx = 0;

    filtered.forEach((m, i) => {
        // Text before
        if (m.start > lastIdx) {
            result.push(<span key={`text-${i}`}>{line.substring(lastIdx, m.start)}</span>);
        }
        // Highlighted quote
        result.push(
            <span key={`match-${i}`} className={`mx-0.5 px-1.5 py-0.5 rounded ${getHighlightClass(m.claim.status)} transition-all duration-300 cursor-help hover:brightness-125`}>
                {line.substring(m.start, m.end)}
            </span>
        );
        lastIdx = m.end;
    });

    // Text after last match
    if (lastIdx < line.length) {
        result.push(<span key="text-end">{line.substring(lastIdx)}</span>);
    }

    return <>{result}</>;
}

export default InlineHighlighter;
