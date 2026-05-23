import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import brainImage from "../image/brain.png";

import {
  BarChart3,
  Brain,
  Clapperboard,
  Code2,
  Database,
  FileText,
  Frown,
  Home,
  Info,
  Keyboard,
  Loader2,
  Lock,
  Monitor,
  PenLine,
  Rocket,
  Server,
  Shield,
  Smile,
  Sparkles,
  Trash2,
  TrendingUp,
  WandSparkles,
  XCircle,
  Zap,
} from "lucide-react";

const positiveExample =
  "This movie was absolutely wonderful. The story was emotional, the acting was brilliant, and the ending was beautiful. I enjoyed every moment and would definitely watch it again.";

const negativeExample =
  "This movie was very disappointing. The story was boring, the acting felt weak, and the pacing was too slow. I lost interest halfway through and would not recommend it.";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

function Background() {
  return (
    <>
      <div className="fixed inset-0 -z-50 bg-[#020617]" />

      <div className="fixed inset-0 -z-40 bg-[radial-gradient(circle_at_8%_12%,rgba(56,189,248,0.15),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(236,72,153,0.19),transparent_32%),radial-gradient(circle_at_58%_78%,rgba(168,85,247,0.17),transparent_36%),linear-gradient(135deg,#020617_0%,#07111f_38%,#09091f_72%,#020617_100%)]" />

      <div className="fixed left-[-140px] top-[120px] -z-30 h-[360px] w-[360px] rounded-full bg-cyan-400/25 blur-[90px]" />

      <div className="fixed right-[-150px] top-[120px] -z-30 h-[420px] w-[420px] rounded-full bg-pink-500/25 blur-[95px]" />

      <div className="fixed bottom-[-180px] left-[42%] -z-30 h-[420px] w-[420px] rounded-full bg-violet-600/25 blur-[95px]" />

      <div className="noise-layer" />
    </>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
      <nav className="mx-auto flex h-[98px] w-[min(1600px,calc(100%_-_40px))] items-center justify-between">
        <a href="#home" className="flex items-center gap-4">
          <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-sky-400 text-white shadow-[0_0_30px_rgba(168,85,247,0.45)]">
            <Clapperboard size={27} strokeWidth={2.4} />
          </div>

          <div>
            <h1 className="text-[28px] font-black leading-none tracking-[-0.04em] text-white">
              Movie<span className="gradient-text">Sentiment</span>
            </h1>

            <p className="mt-1.5 text-[15px] font-medium text-slate-300">
              AI-Powered Review Analyzer
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-14 text-[16px] font-bold text-slate-300 lg:flex">
          <a href="#home" className="nav-item active">
            <Home size={18} />
            Home
          </a>

          <a href="#model" className="nav-item">
            <Brain size={19} />
            About Model
          </a>

          <a href="#how" className="nav-item">
            <Code2 size={19} />
            How It Works
          </a>
        </div>

        <a
          href="#about"
          className="hidden items-center gap-3 rounded-xl border border-violet-400/30 bg-violet-500/10 px-6 py-3.5 text-[15px] font-bold text-violet-100 transition hover:bg-violet-500/20 md:inline-flex"
        >
          <Info size={18} />
          About Project
        </a>
      </nav>
    </header>
  );
}

function HeroBadge({ icon, title, subtitle }) {
  return (
    <div className="glass-mini-card">
      <div>{icon}</div>

      <div>
        <h4 className="text-[15px] font-extrabold text-white">{title}</h4>
        <p className="mt-0.5 text-[13px] font-medium text-slate-300">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      id="home"
      className="flex flex-col justify-center"
    >
      <h2 className="max-w-[590px] text-[46px] font-black leading-[1.08] tracking-[-0.055em] text-white md:text-[58px] xl:text-[64px]">
        IMDB Movie Review{" "}
        <span className="gradient-text block md:inline">Sentiment</span>{" "}
        Analyzer
      </h2>

      <div className="mt-7 h-1.5 w-[122px] rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-pink-500 shadow-[0_0_18px_rgba(168,85,247,0.45)]" />

      <p className="mt-7 max-w-[530px] text-[19px] font-medium leading-[1.65] text-slate-300 md:text-[20px]">
        Enter any movie review and our AI model will predict whether it is{" "}
        <span className="font-extrabold text-emerald-400">Positive</span> or{" "}
        <span className="font-extrabold text-rose-400">Negative</span>.
      </p>

      <div className="mt-8 grid max-w-[540px] grid-cols-1 gap-3 sm:grid-cols-3">
        <HeroBadge
          icon={<Brain className="text-violet-400" size={27} />}
          title="Deep Learning"
          subtitle="SimpleRNN Model"
        />

        <HeroBadge
          icon={<Database className="text-sky-400" size={27} />}
          title="IMDB Dataset"
          subtitle="50K+ Reviews"
        />

        <HeroBadge
          icon={<Zap className="text-yellow-300" size={27} />}
          title="Real-time"
          subtitle="Prediction"
        />
      </div>
    </motion.section>
  );
}

function ReviewCard({ review, setReview, onAnalyze, loading, setError }) {
  const characterCount = review.length;

  const usePositive = () => {
    setReview(positiveExample);
    setError("");
  };

  const useNegative = () => {
    setReview(negativeExample);
    setError("");
  };

  const clearReview = () => {
    setReview("");
    setError("");
  };

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="review-panel"
    >
      <div className="relative z-10 mb-6 flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-3 text-[20px] font-black text-white">
          <PenLine className="text-fuchsia-400" size={23} />
          Write Your Movie Review
        </h3>

        <span className="text-[16px] font-medium text-slate-300">
          {characterCount} / 1000
        </span>
      </div>

      <div className="relative z-10">
        <FileText
          className="pointer-events-none absolute right-7 top-7 text-violet-400/10"
          size={86}
          strokeWidth={1.6}
        />

        <textarea
          value={review}
          maxLength={1000}
          onChange={(event) => setReview(event.target.value)}
          placeholder="Type or paste your movie review here..."
          className="review-textarea"
        />
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_0.7fr_1fr]">
        <button onClick={usePositive} className="example-btn positive-example">
          <WandSparkles size={18} />
          Positive Example
        </button>

        <button onClick={useNegative} className="example-btn negative-example">
          <XCircle size={18} />
          Negative Example
        </button>

        <button onClick={clearReview} className="clear-btn">
          <Trash2 size={18} />
          Clear
        </button>

        <button onClick={onAnalyze} disabled={loading} className="analyze-btn">
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Analyzing...
            </>
          ) : (
            <>
              <Rocket size={18} />
              Analyze Review
            </>
          )}
        </button>
      </div>

      <p className="relative z-10 mt-5 flex items-center gap-3 text-[14px] font-medium text-slate-300">
        <Shield size={17} className="text-slate-400" />
        Our AI will analyze the sentiment and show confidence score
      </p>
    </motion.section>
  );
}

function ResultCard({ result, loading, error }) {
  const isPositive = result?.sentiment === "Positive";
  const isNegative = result?.sentiment === "Negative";

  const confidence = result?.confidence ?? 0;
  const score = result?.score ?? 0;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`result-card ${
        isPositive
          ? "positive-state"
          : isNegative
          ? "negative-state"
          : "neutral-state"
      }`}
    >
      <div className="mb-7 flex items-center gap-3">
        <BarChart3 size={24} className="text-cyan-100" />
        <h3 className="text-[22px] font-black text-white">Analysis Result</h3>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5 text-rose-100"
          >
            <h4 className="text-xl font-black">Something went wrong</h4>
            <p className="mt-2 text-sm font-medium">{error}</p>
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-6"
          >
            <div className="loader-ring" />

            <div>
              <h4 className="text-[28px] font-black text-cyan-100">
                Analyzing...
              </h4>

              <p className="mt-1.5 text-[16px] font-medium text-slate-300">
                Your SimpleRNN model is processing the review.
              </p>
            </div>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div className="flex items-center gap-6">
              <div
                className={`sentiment-icon ${
                  isPositive ? "positive-icon" : "negative-icon"
                }`}
              >
                {isPositive ? <Sparkles size={38} /> : <XCircle size={38} />}
              </div>

              <div>
                <h4
                  className={`text-[30px] font-black leading-tight ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {result.sentiment} Review
                </h4>

                <p className="mt-2 text-[16px] font-medium text-slate-200">
                  This review has a {result.sentiment.toLowerCase()} sentiment.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[17px] font-extrabold text-white">
                  Confidence Score
                </span>

                <strong
                  className={`text-[28px] font-black ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {confidence.toFixed(2)}%
                </strong>
              </div>

              <div className="h-3.5 overflow-hidden rounded-full bg-slate-400/15">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${Math.max(2, Math.min(confidence, 100))}%`,
                  }}
                  transition={{ duration: 0.7 }}
                  className={`h-full rounded-full ${
                    isPositive
                      ? "bg-gradient-to-r from-emerald-500 to-green-400"
                      : "bg-gradient-to-r from-rose-500 to-pink-400"
                  }`}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="stat-box">
                <div className="stat-icon green-stat">
                  <TrendingUp size={23} />
                </div>

                <div>
                  <p>Positive Score</p>
                  <h5
                    className={
                      isPositive ? "text-emerald-400" : "text-rose-400"
                    }
                  >
                    {score.toFixed(4)}
                  </h5>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon blue-stat">
                  <FileText size={22} />
                </div>

                <div>
                  <p>Review Length</p>
                  <h5 className="text-blue-400">{result.word_count} words</h5>
                </div>
              </div>
            </div>

            {result.demo_mode && (
              <div className="mt-5 rounded-xl border border-yellow-400/30 bg-yellow-500/10 p-4 text-sm font-semibold text-yellow-100">
                No model file was found. This result is from demo fallback logic.
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-6"
          >
            <div className="empty-icon">
              <Clapperboard size={38} />
            </div>

            <div>
              <h4 className="text-[28px] font-black text-slate-100">
                Waiting for Review
              </h4>

              <p className="mt-1.5 text-[16px] font-medium text-slate-300">
                Write a movie review and click Analyze Review.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BrainVisual() {
  return (
    <div className="relative grid min-h-[270px] place-items-center overflow-hidden rounded-[24px]">
      {/* soft background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.28),transparent_42%),radial-gradient(circle_at_58%_58%,rgba(56,189,248,0.13),transparent_48%)]" />

      {/* dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/20 via-transparent to-slate-950/30" />

      {/* subtle tech background */}
      <div className="absolute inset-0 opacity-45">
        <div className="absolute left-[8%] top-[24%] h-px w-[130px] bg-gradient-to-r from-transparent via-sky-400/35 to-transparent" />
        <div className="absolute left-[15%] top-[62%] h-px w-[120px] bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />
        <div className="absolute right-[8%] top-[32%] h-px w-[130px] bg-gradient-to-r from-transparent via-fuchsia-400/35 to-transparent" />
        <div className="absolute right-[18%] top-[72%] h-px w-[105px] bg-gradient-to-r from-transparent via-sky-400/25 to-transparent" />

        <div className="absolute left-[12%] top-[24%] h-1.5 w-1.5 rounded-full bg-sky-400/70 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
        <div className="absolute left-[25%] top-[62%] h-1.5 w-1.5 rounded-full bg-violet-400/70 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
        <div className="absolute right-[14%] top-[32%] h-1.5 w-1.5 rounded-full bg-fuchsia-400/70 shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
        <div className="absolute right-[28%] top-[72%] h-1.5 w-1.5 rounded-full bg-sky-400/60 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
      </div>

      {/* main image glow */}
      <div className="absolute h-[245px] w-[300px] rounded-full bg-fuchsia-500/20 blur-[58px]" />
      <div className="absolute h-[220px] w-[280px] rounded-full bg-sky-500/14 blur-[52px]" />

      {/* brain image */}
      <motion.img
        src={brainImage}
        alt="AI brain sentiment analysis"
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className="relative z-10 w-[310px] max-w-full select-none object-contain drop-shadow-[0_0_42px_rgba(168,85,247,0.58)]"
        draggable="false"
      />

      {/* bottom fade so image blends with card */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/30 to-transparent" />
    </div>
  );
}
function ModelCard({ health }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      id="model"
      className="model-card"
    >
      <div>
        <div className="mb-6 flex items-center gap-3">
          <Brain size={24} className="text-violet-300" />
          <h3 className="text-[22px] font-black text-white">
            About the Model
          </h3>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-400/10 bg-slate-950/35">
          <InfoRow label="Model Architecture" value="SimpleRNN" />
          <InfoRow label="Dataset" value="IMDB Movie Reviews" />
          <InfoRow label="Max Sequence Length" value={health?.max_len || 500} />
          <InfoRow
            label="Vocabulary Size"
            value={(health?.max_features || 10000).toLocaleString()}
          />
          <InfoRow label="Model Type" value="Binary Classification" />
        </div>
      </div>

      <BrainVisual />
    </motion.div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-400/10 px-5 py-4 last:border-b-0">
      <span className="text-[14px] font-medium text-slate-300">{label}</span>
      <strong className="text-right text-[14px] font-black text-violet-100">
        {value}
      </strong>
    </div>
  );
}

function Workflow() {
  const steps = [
    {
      number: "01",
      icon: <Keyboard size={30} />,
      title: "User Review",
      text: "Type a review in the modern React interface.",
    },
    {
      number: "02",
      icon: <Server size={30} />,
      title: "Flask API",
      text: "React sends the review to the Flask /predict endpoint.",
    },
    {
      number: "03",
      icon: <Brain size={30} />,
      title: "SimpleRNN",
      text: "The trained model predicts positive or negative sentiment.",
    },
    {
      number: "04",
      icon: <BarChart3 size={30} />,
      title: "Result UI",
      text: "The website displays score, confidence, and result color.",
    },
  ];

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      id="how"
      className="light-section"
    >
      <p className="text-[13px] font-black uppercase tracking-[0.35em] text-cyan-300">
        Workflow
      </p>

      <h3 className="mt-4 max-w-[780px] text-[34px] font-black leading-[1.08] tracking-[-0.045em] text-white md:text-[46px]">
        Flask API + React Frontend + SimpleRNN Model
      </h3>

      <p className="mt-5 max-w-[780px] text-[17px] font-medium leading-[1.7] text-slate-300">
        The frontend sends the user review to the Flask API. The API preprocesses
        the text using the same IMDB word-index system used during training, then
        the SimpleRNN model returns a sentiment score.
      </p>

      <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <div key={step.number} className="workflow-card">
            <span>{step.number}</span>

            <div className="my-5 text-violet-400">{step.icon}</div>

            <h4>{step.title}</h4>

            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function FeatureStrip() {
  const features = [
    {
      icon: <Shield size={29} />,
      title: "High Accuracy",
      text: "Trained on IMDB movie review data for sentiment prediction.",
      className: "text-blue-400 bg-blue-500/15",
    },
    {
      icon: <Zap size={29} />,
      title: "Instant Results",
      text: "Get sentiment analysis using a clean API workflow.",
      className: "text-yellow-300 bg-yellow-500/15",
    },
    {
      icon: <Lock size={29} />,
      title: "Secure & Private",
      text: "Your reviews are analyzed locally and never stored.",
      className: "text-violet-300 bg-violet-500/15",
    },
    {
      icon: <Monitor size={29} />,
      title: "Responsive Design",
      text: "Works beautifully on desktop, tablet, and mobile.",
      className: "text-pink-300 bg-pink-500/15",
    },
  ];

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      id="about"
      className="feature-strip"
    >
      {features.map((feature) => (
        <div key={feature.title} className="feature-item">
          <div className={`feature-icon ${feature.className}`}>
            {feature.icon}
          </div>

          <div>
            <h4>{feature.title}</h4>
            <p>{feature.text}</p>
          </div>
        </div>
      ))}
    </motion.section>
  );
}

export default function App() {
  const [review, setReview] = useState("");
  const [result, setResult] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canAnalyze = useMemo(() => review.trim().length > 0, [review]);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((data) => setHealth(data))
      .catch(() => {
        setHealth({
          model_loaded: false,
          max_len: 500,
          max_features: 10000,
        });
      });
  }, []);

  const analyzeReview = async () => {
    if (!canAnalyze) {
      setError("Please write or paste a movie review first.");
      setResult(null);
      return;
    }

    if (review.trim().length < 5) {
      setError("Please enter a longer review for better prediction.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Prediction failed.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <Background />

      <Navbar />

      <main className="mx-auto w-[min(1600px,calc(100%_-_40px))] pb-12">
        <section className="grid grid-cols-1 items-center gap-11 py-12 xl:grid-cols-[0.82fr_1.18fr]">
          <Hero />

          <ReviewCard
            review={review}
            setReview={setReview}
            onAnalyze={analyzeReview}
            loading={loading}
            setError={setError}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 pb-8 xl:grid-cols-[0.95fr_1.05fr]">
          <ResultCard result={result} loading={loading} error={error} />

          <ModelCard health={health} />
        </section>

        <Workflow />

        <FeatureStrip />

        <footer className="pt-6 text-center text-[15px] font-medium text-slate-500">
          Built with Flask, TensorFlow, SimpleRNN, React, Tailwind CSS, and
          JavaScript.
        </footer>
      </main>
    </div>
  );
}