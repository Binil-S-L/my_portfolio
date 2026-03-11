import { useState, useEffect, useRef } from "react";

const PHOTO_URL = "/binil.jpg"; // Place your photo as binil.jpg in /public folder

const NAV_LINKS = ["About", "Experience", "Projects", "Skills", "Contact"];

const EXPERIENCE = [
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
    github: "https://github.com/binil-sanil-liby/customer-churn-prediction",
  },
  {
    title: "Sentiment Analysis NLP API",
    tech: ["HuggingFace BERT", "FastAPI", "React", "Python"],
    description:
      "Fine-tuned BERT on 50k product reviews for multi-class sentiment classification. Exposed via a FastAPI REST endpoint with a React frontend for real-time inference. Outperformed TF-IDF baseline by 14%.",
    highlight: "F1 Score 0.89",
    icon: "🧠",
    github: "https://github.com/binil-sanil-liby/sentiment-analysis-api",
  },
  {
    title: "House Price Prediction",
    tech: ["Python", "XGBoost", "CatBoost", "LightGBM", "Pandas"],
    description:
      "Benchmarked three gradient boosting models on Zillow US housing dataset. XGBoost achieved the lowest RMSE and best R², with forward-looking price forecasts for real estate stakeholders.",
    highlight: "Best R² Score",
    icon: "🏠",
    github: "https://github.com/binil-sanil-liby/house-price-prediction",
  },
];

const SKILLS = {
  "Languages": ["Python", "Java", "SQL", "JavaScript", "C#"],
  "ML / AI": ["Scikit-learn", "XGBoost", "TensorFlow", "HuggingFace", "Pandas", "NumPy"],
  "Web & Frameworks": ["React", "FastAPI", "Streamlit", "ASP.NET", "REST APIs"],
  "Tools": ["Docker", "Git", "GitHub", "Jupyter", "VS Code"],
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0C0C0F", color: "#E8E6E0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0C0C0F; }
        ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 2px; }
        .nav-link { cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: #999; transition: color 0.2s; padding: 4px 0; border-bottom: 1px solid transparent; }
        .nav-link:hover, .nav-link.active { color: #C9A84C; border-bottom-color: #C9A84C; }
        .btn-gold { background: #C9A84C; color: #0C0C0F; border: none; padding: 12px 32px; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; font-weight: 500; }
        .btn-gold:hover { background: #E5C56A; transform: translateY(-1px); }
        .btn-outline { background: transparent; color: #C9A84C; border: 1px solid #C9A84C; padding: 12px 32px; font-family: 'DM Sans', sans-serif; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.25s; font-weight: 500; }
        .btn-outline:hover { background: #C9A84C22; }
        .card { background: #13131A; border: 1px solid #1E1E2A; transition: border-color 0.3s, transform 0.3s; }
        .card:hover { border-color: #C9A84C44; transform: translateY(-3px); }
        .tag { background: #1A1A25; border: 1px solid #2A2A38; color: #999; font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.08em; padding: 4px 10px; display: inline-block; margin: 3px; }
        .section-label { font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #C9A84C; margin-bottom: 12px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; color: #F0EDE6; line-height: 1.15; }
        .body-text { font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.75; color: #999; font-weight: 300; }
        .timeline-dot { width: 10px; height: 10px; background: #C9A84C; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
        .skill-bar-bg { background: #1A1A25; height: 2px; width: 100%; margin-top: 6px; }
        .divider { width: 60px; height: 2px; background: #C9A84C; margin: 20px 0; }
        a { color: #C9A84C; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 48px",
        background: scrolled ? "rgba(12,12,15,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1E1E2A" : "1px solid transparent",
        transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6", letterSpacing: "0.05em" }}>
          BSL<span style={{ color: "#C9A84C" }}>.</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {NAV_LINKS.map(l => (
            <span key={l} className={`nav-link ${active === l ? "active" : ""}`} onClick={() => scrollTo(l)}>{l}</span>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="about" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "80px", flexWrap: "wrap", width: "100%" }}>

          {/* Text */}
          <div style={{ flex: "1 1 400px" }}>
            <div className="section-label" style={{ animationDelay: "0s", opacity: 1 }}>Data Scientist · ML Engineer · Developer</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 7vw, 76px)", fontWeight: 900, color: "#F0EDE6", lineHeight: 1.05, marginBottom: 24 }}>
              Binil<br /><span style={{ color: "#C9A84C" }}>Sanil</span><br />Liby
            </h1>
            <div className="divider" />
            <p className="body-text" style={{ maxWidth: 480, marginBottom: 36 }}>
              MSc Advanced Computer Science graduate with 1+ year of hands-on experience building ML pipelines, NLP systems, and full-stack applications. Based in Berkhamsted, UK — open to Data Science & ML roles.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="btn-gold" onClick={() => scrollTo("Projects")}>View Projects</button>
              <button className="btn-outline" onClick={() => scrollTo("Contact")}>Get In Touch</button>
            </div>
            <div style={{ marginTop: 48, display: "flex", gap: 32 }}>
              {[["1+", "Years Experience"], ["3", "ML Projects"], ["MSc", "Computer Science"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#C9A84C" }}>{n}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div style={{ flex: "0 0 auto", position: "relative" }}>
            <div style={{
              width: 320, height: 400,
              background: "linear-gradient(135deg, #1A1A25, #13131A)",
              border: "1px solid #2A2A38",
              overflow: "hidden",
              position: "relative",
            }}>
              <img
                src={PHOTO_URL}
                alt="Binil Sanil Liby"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {/* Gold corner accent */}
              <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40, borderTop: "3px solid #C9A84C", borderLeft: "3px solid #C9A84C" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottom: "3px solid #C9A84C", borderRight: "3px solid #C9A84C" }} />
            </div>
            {/* Offset shadow box */}
            <div style={{ position: "absolute", top: 16, left: 16, width: 320, height: 400, border: "1px solid #C9A84C22", zIndex: -1 }} />
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "100px 48px", background: "#0E0E13" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div className="section-label">Career</div>
            <h2 className="section-title">Work Experience</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 0 }}>
            {EXPERIENCE.map((exp, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div style={{ display: "flex", gap: 32, paddingBottom: 48, borderLeft: "1px solid #1E1E2A", paddingLeft: 32, position: "relative", marginLeft: 5 }}>
                  <div style={{ position: "absolute", left: -5, top: 6, width: 10, height: 10, background: "#C9A84C", borderRadius: "50%" }} />
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
      <section id="projects" style={{ padding: "100px 48px", background: "#0C0C0F" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">Featured Projects</h2>
            <div className="divider" />
          </FadeIn>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {PROJECTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="card" style={{ padding: 32, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <span style={{ fontSize: 32 }}>{p.icon}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#C9A84C", background: "#C9A84C11", border: "1px solid #C9A84C33", padding: "4px 10px", letterSpacing: "0.1em" }}>{p.highlight}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F0EDE6", marginBottom: 12, lineHeight: 1.3 }}>{p.title}</h3>
                  <p className="body-text" style={{ fontSize: 13, flex: 1, marginBottom: 20 }}>{p.description}</p>
                  <div style={{ marginBottom: 20 }}>
                    {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <a href={p.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                    View on GitHub →
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "100px 48px", background: "#0E0E13" }}>
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
                    {items.map(skill => (
                      <div key={skill} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#CCC", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ color: "#C9A84C", fontSize: 10 }}>◆</span>{skill}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "100px 48px", background: "#0C0C0F" }}>
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
                { label: "GitHub", value: "github.com/binil-sanil-liby", href: "https://github.com/binil-sanil-liby" },
              ].map(({ label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "16px 32px", width: "100%", maxWidth: 420,
                  background: "#13131A", border: "1px solid #1E1E2A", textDecoration: "none",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#C9A84C44"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1E1E2A"}
                >
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", width: 60 }}>{label}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#AAA" }}>{value}</span>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "32px 48px", borderTop: "1px solid #1E1E2A", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#F0EDE6" }}>BSL<span style={{ color: "#C9A84C" }}>.</span></div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#444" }}>© 2025 Binil Sanil Liby. All rights reserved.</div>
      </footer>
    </div>
  );
}
