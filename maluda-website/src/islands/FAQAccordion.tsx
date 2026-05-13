import { useRef, useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: Props) {
  // First item pre-expanded — visitors see an answer above the fold instead
  // of staring at a column of closed questions.
  const [openIndex, setOpenIndex] = useState<number | null>(items.length > 0 ? 0 : null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const buttonId = `faq-button-${i}`;
        const panelId = `faq-panel-${i}`;
        const scrollHeight = panelRefs.current[i]?.scrollHeight ?? 0;
        return (
          <div key={i} className="glass-card !rounded-xl overflow-hidden">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-medium text-[var(--color-text-primary)] pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-[var(--color-accent-primary)] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: isOpen ? `${Math.max(scrollHeight, 400)}px` : "0px",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="px-5 pb-5 text-[var(--color-text-secondary)] leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
