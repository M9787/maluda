import { useState, useMemo } from "react";

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
  tag?: string;
}

export interface Assessment {
  id: string;
  maxPctInclusive: number;
  level: string;
  title: string;
  desc: string;
  cta: string;
  ctaHref: string;
  color: string;
  nudge: string;
}

interface Props {
  questions: Question[];
  assessments: Assessment[];
  quizLength?: number;
}

function pickQuestions(pool: Question[], count: number): Question[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

const TAG_TO_COURSE: Record<string, { slug: string; label: string }> = {
  python: { slug: "python-sql", label: "Python + SQL" },
  data: { slug: "data-analysis", label: "Data Analysis" },
  devops: { slug: "devops-cloud", label: "DevOps & Cloud" },
  cloud: { slug: "devops-cloud", label: "DevOps & Cloud" },
  ai: { slug: "vibe-coding", label: "Vibe Coding & AI" },
  ии: { slug: "vibe-coding", label: "Vibe Coding & AI" },
  vibe: { slug: "vibe-coding", label: "Vibe Coding & AI" },
  claude: { slug: "claude-code", label: "Claude Code: Автоматизация" },
  career: { slug: "not-sure", label: "Курс с куратором" },
  карьера: { slug: "not-sure", label: "Курс с куратором" },
};

function pickRecommendation(
  questions: Question[],
  answers: boolean[]
): { slug: string; label: string } | null {
  const tally: Record<string, number> = {};
  for (let i = 0; i < answers.length; i++) {
    const tag = questions[i]?.tag?.toLowerCase();
    if (!tag) continue;
    tally[tag] = (tally[tag] ?? 0) + (answers[i] ? 2 : 1);
  }
  const entries = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  for (const [tag] of entries) {
    if (TAG_TO_COURSE[tag]) return TAG_TO_COURSE[tag];
  }
  return null;
}

const pickAssessment = (assessments: Assessment[], score: number, total: number): Assessment => {
  const pct = total === 0 ? 0 : score / total;
  // Use the first bucket whose maxPctInclusive >= pct (sorted ascending).
  const sorted = [...assessments].sort((a, b) => a.maxPctInclusive - b.maxPctInclusive);
  for (const a of sorted) {
    if (pct <= a.maxPctInclusive) return a;
  }
  return sorted[sorted.length - 1];
};

export default function Quiz({ questions: pool, assessments, quizLength = 7 }: Props) {
  const questions = useMemo(
    () => pickQuestions(pool, Math.min(quizLength, pool.length)),
    [pool, quizLength]
  );

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = questions[currentQ];
  const xpEarned = score * 50;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    const correct = index === q.correctIndex;
    setSelected(index);
    setShowFact(true);
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowFact(false);
    } else {
      setFinished(true);
    }
  };

  // ── START SCREEN ──────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto rounded-2xl">
        <div className="flex justify-center mb-5">
          <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2" style={{ color: "var(--color-accent-secondary)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3 font-heading">Узнай свой IT-уровень</h3>
        <p className="mb-2" style={{ color: "var(--color-text-secondary)" }}>
          {quizLength} вопросов · Без таймера · Каждый ответ = интересный факт
        </p>
        <p className="text-sm mb-7 font-medium" style={{ color: "var(--color-accent-secondary)" }}>
          В конце — персональная оценка и рекомендация курса
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-7">
          {["Python", "Data", "DevOps", "ИИ", "Карьера"].map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full border font-medium" style={{ borderColor: "rgba(0,107,95,0.3)", color: "var(--color-accent-secondary)", background: "rgba(0,107,95,0.05)" }}>
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => setStarted(true)}
          className="btn-primary text-base px-8 py-3 w-full max-w-xs mx-auto block font-heading font-bold"
          style={{ borderRadius: "0.75rem" }}
        >
          Начать тест →
        </button>
      </div>
    );
  }

  // ── RESULTS SCREEN ────────────────────────────────────────────────
  if (finished) {
    const msg = pickAssessment(assessments, score, questions.length);
    const recommended = pickRecommendation(questions, answers);
    const ctaHref = recommended ? `/courses#${recommended.slug}` : msg.ctaHref;
    const ctaLabel = recommended ? `Посмотреть курс: ${recommended.label} →` : msg.cta;
    return (
      <div className="glass-card p-8 md:p-12 text-center max-w-2xl mx-auto rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Dynamic Background Glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" style={{ background: msg.color }}></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" style={{ background: "var(--color-accent-secondary)" }}></div>

        {/* Dynamic Gamified Rank Badge */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full" style={{ background: `radial-gradient(circle, ${msg.color}20 0%, transparent 70%)` }}>
            <div className="absolute inset-2 rounded-full animate-ping opacity-20" style={{ border: `2px solid ${msg.color}` }}></div>
            <div className="absolute inset-4 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${msg.color}10, transparent)`, border: `1px solid ${msg.color}40`, backdropFilter: 'blur(12px)' }}>
               {msg.id === 'beginner' && (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={msg.color} strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               )}
               {msg.id === 'curious' && (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={msg.color} strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
               )}
               {msg.id === 'advanced' && (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={msg.color} strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a4.94 4.94 0 01-5.84-2.58m5.84 2.58v4.8m-5.84-7.38a14.98 14.98 0 00-12.12 6.16" />
                  </svg>
               )}
               {msg.id === 'expert' && (
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke={msg.color} strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
               )}
            </div>
          </div>
        </div>

        <div className="inline-block px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6 shadow-sm border relative z-10" style={{ background: `${msg.color}10`, color: msg.color, borderColor: `${msg.color}30` }}>
          Ранг: {msg.level}
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold mb-3 font-heading relative z-10">{msg.title}</h3>
        <p className="mb-8 text-base leading-relaxed relative z-10" style={{ color: "var(--color-text-secondary)" }}>{msg.desc}</p>

        {/* Gamified Score Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at center, ${msg.color}15, transparent)` }}></div>
            <div className="text-3xl font-black font-heading mb-1" style={{ color: msg.color }}>{score}/{questions.length}</div>
            <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-secondary)" }}>Правильных</div>
          </div>
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden group shadow-lg" style={{ border: `1px solid var(--color-accent-secondary)`, boxShadow: `0 0 30px var(--color-accent-secondary)20` }}>
            <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-[var(--color-accent-secondary)] to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 border-t border-[var(--color-accent-secondary)] opacity-50"></div>
            <div className="text-4xl font-black font-heading mb-1 animate-pulse" style={{ color: "var(--color-accent-secondary)", textShadow: "0 0 20px var(--color-accent-secondary)" }}>+{xpEarned}</div>
            <div className="text-xs uppercase tracking-wider font-bold" style={{ color: "var(--color-text-primary)" }}>XP Заработано</div>
          </div>
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at center, ${msg.color}15, transparent)` }}></div>
            <div className="text-3xl font-black font-heading mb-1" style={{ color: msg.color }}>{Math.round((score / questions.length) * 100)}%</div>
            <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--color-text-secondary)" }}>Точность</div>
          </div>
        </div>

        {/* Answer trail timeline */}
        <div className="flex justify-center items-center gap-3 mb-10 relative z-10 px-4">
          <div className="absolute left-10 right-10 h-px bg-[var(--color-text-secondary)] opacity-20 top-1/2 -translate-y-1/2 z-0"></div>
          {answers.map((correct, i) => (
            <div key={i} className="relative z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-transform hover:scale-110 cursor-default" style={{ background: "var(--color-bg-primary)", borderColor: correct ? "#006b5f" : "#dc2626", boxShadow: correct ? "0 0 15px rgba(0,107,95,0.4)" : "none" }} title={correct ? "Верно" : "Неверно"}>
              {correct ? (
                <svg className="w-4 h-4 text-[#006b5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Neuromarketing nudge quote */}
        <blockquote className="text-lg italic font-medium mb-6 px-8 py-6 rounded-2xl shadow-inner relative z-10" style={{ background: "rgba(0,107,95,0.03)", color: "var(--color-accent-primary)", borderLeft: `4px solid ${msg.color}` }}>
          &ldquo;{msg.nudge}&rdquo;
        </blockquote>

        {recommended && (
          <div
            className="mb-6 px-6 py-5 rounded-2xl text-left relative z-10"
            style={{
              background: "rgba(0,107,95,0.06)",
              border: "1px solid rgba(0,107,95,0.2)",
            }}
            role="note"
          >
            <p className="text-xs uppercase tracking-widest font-bold mb-1.5" style={{ color: "var(--color-accent-secondary)" }}>
              Твоя сильная сторона
            </p>
            <p className="text-base font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
              {recommended.label}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              На основе ответов мы рекомендуем начать с этого курса.
            </p>
          </div>
        )}

        <a
          href={ctaHref}
          className="btn-glow block text-center px-8 py-4 w-full font-heading font-bold text-lg relative overflow-hidden group z-10"
          style={{ borderRadius: "1rem", minHeight: 56 }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {ctaLabel}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
               <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </a>

        <button
          onClick={() => { setStarted(false); setFinished(false); setCurrentQ(0); setScore(0); setSelected(null); setShowFact(false); setAnswers([]); }}
          className="mt-6 text-sm font-semibold w-full text-center py-2 transition-all hover:opacity-80 relative z-10 uppercase tracking-wide"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Пройти снова с другими вопросами
        </button>
      </div>
    );
  }

  // ── QUESTION SCREEN ───────────────────────────────────────────────
  return (
    <div className="glass-card p-6 md:p-10 max-w-2xl mx-auto rounded-2xl">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between text-xs" style={{ color: "var(--color-text-secondary)" }}>
        <span>Вопрос {currentQ + 1} из {questions.length}</span>
        <span className="font-bold" style={{ color: "var(--color-accent-secondary)" }}>+{score * 50} XP</span>
      </div>
      <div className="w-full h-1.5 rounded-full mb-6" style={{ background: "rgba(4,22,39,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentQ + (selected !== null ? 1 : 0)) / questions.length) * 100}%`, background: "linear-gradient(90deg, #62fae3, #006b5f)" }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg md:text-xl font-bold text-center mb-6 font-heading leading-snug">
        {q.question}
      </h3>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {q.options.map((opt, i) => {
          let style: React.CSSProperties = {
            background: "rgba(4,22,39,0.03)",
            border: "1px solid rgba(4,22,39,0.1)",
            cursor: selected !== null ? "default" : "pointer",
            transition: "all 0.2s",
          };
          if (selected !== null) {
            if (i === q.correctIndex) style = { ...style, background: "rgba(0,107,95,0.12)", border: "1px solid rgba(0,107,95,0.5)" };
            else if (i === selected) style = { ...style, background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.4)" };
            else style = { ...style, opacity: 0.4 };
          }
          // Micro-feedback: scale-pop on the correct option, gentle shake on a wrong pick.
          // Only the option that was actually clicked animates (not all four).
          const feedbackClass =
            selected === i
              ? i === q.correctIndex
                ? " quiz-pop"
                : " quiz-shake"
              : "";
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`p-4 rounded-xl text-left text-sm font-medium${feedbackClass}`}
              style={style}
            >
              <span className="inline-block w-5 h-5 rounded-full border text-xs text-center leading-5 mr-2 font-bold"
                style={{ borderColor: "rgba(4,22,39,0.2)", color: "var(--color-text-secondary)" }}>
                {["А", "Б", "В", "Г"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Fun fact + next */}
      {showFact && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          <div
            className="p-4 rounded-xl mb-4 text-sm leading-relaxed"
            style={selected === q.correctIndex
              ? { background: "rgba(0,107,95,0.08)", border: "1px solid rgba(0,107,95,0.25)", borderLeft: "3px solid #006b5f" }
              : { background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.25)", borderLeft: "3px solid #ca8a04" }
            }
          >
            <span className="font-bold">
              {selected === q.correctIndex ? "✓ Верно! " : "✗ Не совсем. "}
            </span>
            {q.funFact}
          </div>
          <button
            onClick={handleNext}
            className="btn-primary w-full py-3 font-heading font-bold"
            style={{ borderRadius: "0.75rem" }}
          >
            {currentQ < questions.length - 1 ? "Следующий вопрос →" : "Узнать свой уровень →"}
          </button>
        </div>
      )}
    </div>
  );
}
