import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Lenis from "@studio-freight/lenis";

const PHOTO_URL = "/binil.jpg";

const NAV_LINKS = ["About", "Experience", "Projects", "Skills", "Contact"];

const EXPERIENCE = [
  {
    role: "AI Trainer",
    company: "Outlier AI",
    location: "Remote, UK",
    period: "Nov 2024 – Present",
    bullets: [
      "Evaluate and refine AI-generated responses across coding, reasoning, and language tasks to improve model accuracy and alignment.",
      "Provide expert feedback on LLM outputs, identifying failure modes and writing high-quality preference data used in RLHF training pipelines.",
    ],
  },
  {
    role: "Junior Developer Trainee",
    company: "Experion Global",
    location: "India",
    period: "Feb 2022 – Jul 2022",
    bullets: [
      "Built and maintained internal web tools using Java and ASP.NET, reducing manual processing time by ~20%.",
      "Participated in agile sprints, code reviews, and full SDLC from requirements through testing.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "TechNova Solutions",
    location: "India",
    period: "Nov 2021 – Jan 2022",
    bullets: [
      "Developed React front-end features and integrated REST APIs, contributing to on-time product delivery.",
      "Collaborated in daily stand-ups and sprint planning, strengthening agile development practices.",
    ],
  },
  {
    role: "Software Developer Intern",
    company: "IHRD Startup",
    location: "Thiruvananthapuram, India",
    period: "Aug 2021 – Oct 2021",
    bullets: [
      "Built internal utilities using Java and SQL; gained hands-on experience with version control and Git workflows.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Customer Churn Prediction",
    tech: ["Python", "XGBoost", "Streamlit", "Docker", "Scikit-learn"],
    description:
      "End-to-end ML pipeline predicting customer churn on telecom data. Applied SMOTE, feature engineering, and hyperparameter tuning to achieve 87% accuracy. Deployed as an interactive Streamlit dashboard containerised with Docker.",
    highlight: "87% Accuracy",
    icon: "📉",
    github: "https://github.com/Binil-S-L/customer-churn-prediction",
  },
  {
    title: "Sentiment Analysis NLP API",
    tech: ["HuggingFace BERT", "FastAPI", "React", "Python"],
    description:
      "Fine-tuned BERT on 50k product reviews for multi-class sentiment classification. Exposed via a FastAPI REST endpoint with a React frontend for real-time inference. Outperformed TF-IDF baseline by 14%.",
    highlight: "F1 Score 0.89",
    icon: "🧠",
    github: "https://github.com/Binil-S-L/sentiment-analysis-api",
  },
  {
    title: "House Price Prediction",
    tech: ["Python", "XGBoost", "CatBoost", "LightGBM", "Pandas"],
    description:
      "Benchmarked three gradient boosting models on Zillow US housing dataset. XGBoost achieved the lowest RMSE and best R², with forward-looking price forecasts for real estate stakeholders.",
    highlight: "Best R² Score",
    icon: "🏠",
    github: "https://github.com/Binil-S-L/house-price-prediction",
  },
];

const SKILLS = {
  Languages: ["Python", "Java", "SQL", "JavaScript", "C#"],
  "ML / AI": ["Scikit-learn", "XGBoost", "TensorFlow", "HuggingFace", "Pandas", "NumPy"],
  "Web & Frameworks": ["React", "FastAPI", "Streamlit", "ASP.NET", "REST APIs"],
  Tools: ["Docker", "Git", "GitHub", "Jupyter", "VS Code"],
};

// ── Lenis smooth scroll ─────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let raf;
    function tick(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

// ── Cursor spotlight ────────────────────────────────
function useCursorSpotlight() {
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty("--cx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--cy", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
}

// ── Scroll-triggered counter ─────────────────────────
function Counter({ target, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const isNumeric = !isNaN(Number(target));
    if (!isNumeric) { setCount(target); return; }
    const end = Number(target);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * end));
      if (t < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {typeof count === "number" ? count : count}
      {suffix}
    </span>
  );
}

// ── Reveal wrapper ──────────────────────────────────
const reveal = {
  hidden: { opacity: 0, y: 36 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

function FadeIn({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={reveal}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

// ── Magnetic button ─────────────────────────────────
function MagneticButton({ children, className, onClick, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.18);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("About");
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useLenis();
  useCursorSpotlight();

  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 600], [0, -60]);
  const photoBrightness = useTransform(scrollY, [0, 400], [1, 0.7]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <div
      style={{
        fontFamily: "'Georgia', serif",
        background: "#0C0C0F",
        color: "#E8E6E0",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: auto; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0C0C0F; }
        ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 2px; }

        /* cursor spotlight */
        body::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 9999;
          background: radial-gradient(
            600px circle at var(--cx, 50%) var(--cy, 50%),
            rgba(201,168,76,0.04),
            transparent 70%
          );
        }

        .nav-link {
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #999;
          padding: 4px 0;
          border: none;
          background: none;
          position: relative;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: #C9A84C;
          transition: width 0.25s ease;
        }
        .nav-link:hover, .nav-link.active { color: #C9A84C; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }

        .btn-gold {
          background: #C9A84C; color: #0C0C0F; border: none;
          padding: 13px 34px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; font-weight: 500;
          position: relative; overflow: hidden;
        }
        .btn-gold::after {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.15);
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.4s ease;
        }
        .btn-gold:hover::after { transform: translateX(120%) skewX(-15deg); }

        .btn-outline {
          background: transparent; color: #C9A84C;
          border: 1px solid #C9A84C;
          padding: 13px 34px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; font-weight: 500;
          transition: background 0.25s;
        }
        .btn-outline:hover { background: rgba(201,168,76,0.1); }

        .card {
          background: #13131A;
          border: 1px solid #1E1E2A;
          transition: border-color 0.3s;
        }

        .tag {
          background: #1A1A25; border: 1px solid #2A2A38;
          color: #999; font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 0.08em;
          padding: 4px 10px; display: inline-block; margin: 3px;
          transition: border-color 0.2s, color 0.2s;
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; letter-spacing: 0.3em;
          text-transform: uppercase; color: #C9A84C; margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 700; color: #F0EDE6; line-height: 1.15;
        }
        .body-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; line-height: 1.75;
          color: #999; font-weight: 300;
        }
        .divider { width: 60px; height: 2px; background: #C9A84C; margin: 20px 0; }

        a { color: #C9A84C; text-decoration: none; }
        a:hover { text-decoration: underline; }

        .project-card:hover .tag { border-color: #C9A84C44; color: #CCC; }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(
            90deg,
            #C9A84C 0%, #F0D882 40%, #C9A84C 60%, #E5C56A 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @media (max-width: 768px) {
          .hero-flex { flex-direction: column-reverse !important; align-items: center !important; gap: 40px !important; }
          .hero-photo { width: 260px !important; height: 320px !important; }
          .hero-photo-shadow { width: 260px !important; height: 320px !important; }
          nav { padding: 16px 24px !important; }
          .section-pad { padding: 80px 24px !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "20px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
        animate={{
          background: scrolled ? "rgba(12,12,15,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
          borderBottom: scrolled ? "1px solid #1E1E2A" : "1px solid transparent",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6", letterSpacing: "0.05em", cursor: "default" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          BSL<span style={{ color: "#C9A84C" }}>.</span>
        </motion.div>
        <motion.div
          style={{ display: "flex", gap: 32 }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {NAV_LINKS.map((l) => (
            <span key={l} className={`nav-link ${active === l ? "active" : ""}`} onClick={() => scrollTo(l)}>{l}</span>
          ))}
        </motion.div>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        id="about"
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 48px 80px", maxWidth: 1200, margin: "0 auto" }}
      >
        <div className="hero-flex" style={{ display: "flex", alignItems: "center", gap: "80px", flexWrap: "wrap", width: "100%" }}>

          {/* Text — staggered entrance */}
          <div style={{ flex: "1 1 400px" }}>
            <motion.div
              className="section-label"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Data Scientist · ML Engineer · Developer
            </motion.div>

            <motion.h1
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 7vw, 76px)", fontWeight: 900, color: "#F0EDE6", lineHeight: 1.05, marginBottom: 24 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Binil<br /><span className="gold-shimmer">Sanil</span><br />Liby
            </motion.h1>

            <motion.div
              className="divider"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.p
              className="body-text"
              style={{ maxWidth: 480, marginBottom: 36 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              MSc Advanced Computer Science graduate with 1+ year of hands-on experience building ML pipelines, NLP systems, and full-stack applications. Based in Berkhamsted, UK — open to Data Science & ML roles.
            </motion.p>

            <motion.div
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.78, ease: [0.22, 1, 0.36, 1] }}
            >
              <MagneticButton className="btn-gold" onClick={() => scrollTo("Projects")}>View Projects</MagneticButton>
              <MagneticButton className="btn-outline" onClick={() => scrollTo("Contact")}>Get In Touch</MagneticButton>
            </motion.div>

            <motion.div
              style={{ marginTop: 48, display: "flex", gap: 32 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {[["1", "Years Experience", "+"], ["3", "ML Projects", ""], ["MSc", "Computer Science", ""]].map(([n, l, suffix]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#C9A84C" }}>
                    <Counter target={n} suffix={suffix} />
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Photo — parallax */}
          <motion.div
            style={{ flex: "0 0 auto", position: "relative" }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="hero-photo"
              style={{
                width: 320, height: 400,
                background: "linear-gradient(135deg, #1A1A25, #13131A)",
                border: "1px solid #2A2A38",
                overflow: "hidden",
                position: "relative",
                y: photoY,
                filter: `brightness(${photoBrightness.get()})`,
              }}
            >
              <img
                src={PHOTO_URL}
                alt="Binil Sanil Liby"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: "3px solid #C9A84C", borderLeft: "3px solid #C9A84C" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: "3px solid #C9A84C", borderRight: "3px solid #C9A84C" }} />
            </motion.div>
            <div
              className="hero-photo-shadow"
              style={{ position: "absolute", top: 16, left: 16, width: 320, height: 400, border: "1px solid #C9A84C22", zIndex: -1 }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section-pad" style={{ padding: "100px 48px", background: "#0E0E13" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div className="section-label">Career</div>
            <h2 className="section-title">Work Experience</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 0 }}>
            {EXPERIENCE.map((exp, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  style={{
                    display: "flex", gap: 32,
                    paddingBottom: 48,
                    borderLeft: "1px solid #1E1E2A",
                    paddingLeft: 32,
                    position: "relative",
                    marginLeft: 5,
                  }}
                >
                  <motion.div
                    style={{ position: "absolute", left: -5, top: 6, width: 10, height: 10, background: "#C9A84C", borderRadius: "50%" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.2, type: "spring", stiffness: 300 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6" }}>{exp.role}</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C9A84C", marginTop: 2 }}>{exp.company} · {exp.location}</div>
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#555", letterSpacing: "0.08em", background: "#13131A", border: "1px solid #1E1E2A", padding: "4px 12px" }}>{exp.period}</div>
                    </div>
                    <ul style={{ listStyle: "none", marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      {exp.bullets.map((b, j) => (
                        <li key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#888", lineHeight: 1.7, paddingLeft: 16, position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, color: "#C9A84C" }}>›</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section-pad" style={{ padding: "100px 48px", background: "#0C0C0F" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">Featured Projects</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {PROJECTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <motion.div
                  className="card project-card"
                  style={{ padding: 32, height: "100%", display: "flex", flexDirection: "column" }}
                  whileHover={{
                    y: -8,
                    borderColor: "rgba(201,168,76,0.4)",
                    boxShadow: "0 20px 60px rgba(201,168,76,0.07)",
                    transition: { duration: 0.25 },
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <motion.span
                      style={{ fontSize: 32, display: "inline-block" }}
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {p.icon}
                    </motion.span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#C9A84C", background: "#C9A84C11", border: "1px solid #C9A84C33", padding: "4px 10px", letterSpacing: "0.1em" }}>{p.highlight}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6", marginBottom: 12, lineHeight: 1.3 }}>{p.title}</h3>
                  <p className="body-text" style={{ fontSize: 13, flex: 1, marginBottom: 20 }}>{p.description}</p>
                  <div style={{ marginBottom: 20 }}>
                    {p.tech.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                    View on GitHub →
                  </a>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section-pad" style={{ padding: "100px 48px", background: "#0E0E13" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div className="section-label">Expertise</div>
            <h2 className="section-title">Technical Skills</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
            {Object.entries(SKILLS).map(([category, items], i) => (
              <FadeIn key={category} delay={i * 0.1}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 16 }}>{category}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map((skill, j) => (
                      <motion.div
                        key={skill}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#CCC", display: "flex", alignItems: "center", gap: 10 }}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 + j * 0.06 }}
                      >
                        <motion.span
                          style={{ color: "#C9A84C", fontSize: 10 }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: j * 0.3 }}
                        >
                          ◆
                        </motion.span>
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section-pad" style={{ padding: "100px 48px", background: "#0C0C0F" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title">Let's Work Together</h2>
            <div className="divider" style={{ margin: "20px auto" }} />
            <p className="body-text" style={{ marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>
              I'm actively looking for Data Science, ML Engineer, and Software Developer roles in the UK. Feel free to reach out — I'd love to connect.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
              {[
                { label: "Email", value: "official.binilsl@gmail.com", href: "mailto:official.binilsl@gmail.com" },
                { label: "Phone", value: "07436 378585", href: "tel:07436378585" },
                { label: "LinkedIn", value: "linkedin.com/in/binil-sanil-liby", href: "https://linkedin.com/in/binil-sanil-liby" },
                { label: "GitHub", value: "github.com/Binil-S-L", href: "https://github.com/Binil-S-L" },
              ].map(({ label, value, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "16px 32px", width: "100%", maxWidth: 420,
                    background: "#13131A", border: "1px solid #1E1E2A",
                    textDecoration: "none",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{
                    borderColor: "rgba(201,168,76,0.35)",
                    x: 6,
                    transition: { duration: 0.2 },
                  }}
                >
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", width: 60 }}>{label}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#AAA" }}>{value}</span>
                </motion.a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <motion.footer
        style={{ padding: "32px 48px", borderTop: "1px solid #1E1E2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#F0EDE6" }}>
          BSL<span style={{ color: "#C9A84C" }}>.</span>
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#444" }}>© 2025 Binil Sanil Liby. All rights reserved.</div>
      </motion.footer>
    </div>
  );
}
