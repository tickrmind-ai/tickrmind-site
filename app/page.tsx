"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  LineChart,
  Lock,
  MessageCircle,
  Mail,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap
} from "lucide-react";

type Message = {
  role: "user" | "bot";
  text: string;
};

type ProductScreen = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  alt: string;
};

const tickerData = [
  ["QQQ", "$712.34", "+1.2%", "up"],
  ["SPY", "$741.80", "+0.8%", "up"],
  ["NVDA", "$228.45", "-0.4%", "down"],
  ["TSLA", "$426.90", "+2.1%", "up"],
  ["AAPL", "$301.55", "-0.2%", "down"],
  ["AMD", "$435.20", "+1.5%", "up"]
];

const features = [
  {
    icon: Brain,
    title: "AI Trade Coach",
    text: "Ask whether to enter, wait, hold, or exit and get plain-English reasoning before emotion takes over."
  },
  {
    icon: ShieldCheck,
    title: "No-Trade Protection",
    text: "Surface disqualifiers like chop, poor timing, low volume, or unclear confirmation before you click buy."
  },
  {
    icon: Target,
    title: "Setup Grading",
    text: "Every idea receives a grade, confidence score, risk context, and decision path."
  },
  {
    icon: BarChart3,
    title: "Trade Journal",
    text: "Log wins, losses, reasons, tags, and patterns so your process becomes measurable."
  },
  {
    icon: LineChart,
    title: "Performance Analytics",
    text: "Track profit factor, win rate, equity curve, and recurring behavior that affects results."
  },
  {
    icon: Zap,
    title: "Live Alerts",
    text: "Get actionable insights through the dashboard, Telegram, and planned push notifications."
  }
];

const promptExamples = [
  "Should I enter TSLA calls right now?",
  "Should I close my SPY call spread?",
  "Why did TickrMind reject NVDA?",
  "Is QQQ strong enough for a breakout trade?"
];

const supportQuickPrompts = [
  "Show me the product",
  "How does pricing work?",
  "I need support",
  "How do I join beta?"
];

const productScreens: ProductScreen[] = [
  {
    title: "Trade Coach",
    eyebrow: "Decision Dashboard",
    description: "Shows account status, win rate, open trades, and the current coaching stance at a glance.",
    image: "/product/trade-coach.jpeg",
    alt: "TickrMind Trade Coach dashboard showing P&L, open trades, win rate, account value, and AI trade insights."
  },
  {
    title: "Trade Journal",
    eyebrow: "Review Every Setup",
    description: "Captures trades, direction, spread, entry, win rate, and P&L so behavior becomes trackable.",
    image: "/product/trade-journal.jpeg",
    alt: "TickrMind Trade Journal screen showing trade count, net P&L, win rate, and a journal table."
  },
  {
    title: "Trade Analytics",
    eyebrow: "Performance View",
    description: "Turns outcomes into a clear equity curve, average win/loss view, and profit-factor snapshot.",
    image: "/product/trade-analytics.jpeg",
    alt: "TickrMind Trading Analytics screen showing total P&L, average win, equity curve, and win loss chart."
  },
  {
    title: "Market News",
    eyebrow: "Market Context",
    description: "Keeps market-moving headlines close to the coach so decisions are grounded in current context.",
    image: "/product/market-news.jpeg",
    alt: "TickrMind Market News screen showing bullish, bearish, and neutral market headlines."
  },
  {
    title: "Strategy Settings",
    eyebrow: "Risk Controls",
    description: "Lets traders define symbols, account size, risk per trade, confidence threshold, and open-trade limits.",
    image: "/product/settings.jpeg",
    alt: "TickrMind Settings screen showing strategy and risk controls for symbols, account size, risk, and confidence."
  }
];

function getResponse(input: string): Message {
  const text = input.toLowerCase();

  if (text.includes("qqq")) {
    return {
      role: "bot",
      text:
        "SIGNAL\n\nConfidence: 78%\n\nWhy TickrMind likes it:\n- VWAP reclaimed\n- Bull flag breakout confirmed\n- Volume expanded on the trigger candle\n\nPlan:\nEntry: $712.50\nStop: $709.00\nTarget: $718.00\n\nOnly take it if your size keeps the loss within plan."
    };
  }

  if (text.includes("nvda")) {
    return {
      role: "bot",
      text:
        "WAIT\n\nConfidence: 46%\n\nWhy TickrMind is cautious:\n- EMAs are tangled\n- Momentum is improving, but confirmation is incomplete\n- Better risk after a pullback\n\nRecommendation:\nWait for a cleaner retest before entering."
    };
  }

  if (text.includes("spy")) {
    return {
      role: "bot",
      text:
        "WAIT\n\nConfidence: 58%\n\nWhy:\n- Setup is developing\n- Resistance sits nearby\n- Volume is lighter than ideal\n\nRecommendation:\nDo not force the spread. Let price confirm above resistance or reduce exposure."
    };
  }

  if (text.includes("tsla")) {
    return {
      role: "bot",
      text:
        "NO TRADE\n\nConfidence: 34%\n\nWhy TickrMind said no:\n- Choppy price action\n- Weak momentum confirmation\n- Low-quality setup\n\nRecommendation:\nStand aside and wait for an A+ setup."
    };
  }

  return {
    role: "bot",
    text:
      "WAIT\n\nCurrent setup quality is not clear enough. TickrMind would stand aside until trend, volume, and risk are aligned."
  };
}

function getSupportResponse(input: string): Message {
  const text = input.toLowerCase();

  if (text.includes("price") || text.includes("pricing") || text.includes("cost") || text.includes("plan")) {
    return {
      role: "bot",
      text:
        "TickrMind beta pricing has two tiers:\n\nPro: $14.99/month for the AI coach, setup grading, journal, Telegram alerts, and mobile dashboard.\n\nElite: $29.99/month for everything in Pro plus position sizing, advanced analytics, futures and crypto expansion, and priority support.\n\nYou can scroll to Pricing or start a free trial from the pricing cards."
    };
  }

  if (text.includes("support") || text.includes("help") || text.includes("contact") || text.includes("issue")) {
    return {
      role: "bot",
      text:
        "I can help with beta access, account questions, product setup, or partnership requests.\n\nUse support@tickrmind.com for customer support and landing-page questions, hello@tickrmind.com for partnerships or general contact, and beta@tickrmind.com for beta invites and onboarding."
    };
  }

  if (text.includes("product") || text.includes("demo") || text.includes("tour") || text.includes("present")) {
    return {
      role: "bot",
      text:
        "Here is the product story:\n\n1. Trade Coach keeps the decision in front of you.\n2. Market News adds context.\n3. Trade Journal captures what happened.\n4. Analytics shows whether your process is improving.\n5. Settings define the risk rules TickrMind should respect.\n\nUse the Product Tour section to see each screen."
    };
  }

  if (text.includes("beta") || text.includes("join") || text.includes("access") || text.includes("invite")) {
    return {
      role: "bot",
      text:
        "To join the beta, enter your email in the early-access form near the top of the page or email beta@tickrmind.com for beta invites and onboarding. For partnerships or investor conversations, use hello@tickrmind.com."
    };
  }

  if (text.includes("privacy") || text.includes("terms") || text.includes("policy")) {
    return {
      role: "bot",
      text:
        "The Privacy Policy and Terms & Conditions are included near the bottom of the page. The short version: TickrMind is a decision-support and education product, not financial advice, and users are responsible for their own trades."
    };
  }

  return {
    role: "bot",
    text:
      "I can help with product questions, beta access, pricing, support, and how TickrMind works. Try asking: \"Show me the product\" or \"How does pricing work?\""
  };
}

export default function TickrMindLandingPage() {
  const [productIndex, setProductIndex] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Ask me if a trade is worth entering. Example: Should I enter TSLA calls right now?"
    }
  ]);
  const [betaEmail, setBetaEmail] = useState("");
  const [betaStatus, setBetaStatus] = useState("");
  const [betaSubmitting, setBetaSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProductIndex((index) => (index + 1) % productScreens.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const activeProduct = productScreens[productIndex];

  const duplicatedTicker = useMemo(() => [...tickerData, ...tickerData], []);

  function handleSend() {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input.trim() };
    const botReply = getResponse(input);
    setMessages((current) => [...current, userMessage, botReply]);
    setInput("");
  }

  async function handleBetaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!betaEmail.trim()) return;

    setBetaSubmitting(true);
    setBetaStatus("Sending your beta request...");

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/beta", {
        body: JSON.stringify({
          company: String(formData.get("company") || ""),
          email: betaEmail,
          source: window.location.href
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send beta request.");
      }

      setBetaStatus(
        result.duplicate
          ? "You're already on the TickrMind beta list. We'll follow up as invites open."
          : "Thanks. Your beta request has been submitted."
      );
      setBetaEmail("");
    } catch (error) {
      setBetaStatus(error instanceof Error ? error.message : "Unable to send beta request right now.");
    } finally {
      setBetaSubmitting(false);
    }
  }

  async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;
    const topic = String(formData.get("topic") || "");

    setContactSubmitting(true);
    setContactStatus("Sending your message...");

    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify({
          company: String(formData.get("company") || ""),
          email: String(formData.get("email") || ""),
          message: String(formData.get("message") || ""),
          name: String(formData.get("name") || ""),
          topic
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send message.");
      }

      setContactStatus(
        result.duplicate
          ? "Message received. This email is already on file for beta access, and we will follow up as invites open."
          : `Message received. This inquiry was routed to ${result.routedTo}.`
      );
      form.reset();
    } catch (error) {
      setContactStatus(error instanceof Error ? error.message : "Unable to send message right now.");
    } finally {
      setContactSubmitting(false);
    }
  }

  return (
    <main className="page">
      <nav className="nav" aria-label="Primary navigation">
        <div className="shell nav-inner">
          <a className="brand" href="#top" aria-label="TickrMind home">
            <span className="brand-name">TickrMind</span>
            <span className="brand-tag">The mind behind smarter trades</span>
          </a>

          <div className="nav-links" aria-label="Page sections">
            <a href="#product">Product</a>
            <a href="#features">Features</a>
            <a href="#coach">AI Coach</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
            <a href="#legal">Legal</a>
          </div>

          <a className="button button-primary" href="#beta">
            Join Beta
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <section id="top" className="shell hero">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="badge">
            <span className="pulse-dot" aria-hidden="true" />
            AI trading coach now in beta
          </div>

          <h1 className="display hero-title">
            Stop bad trades before they <span className="accent">cost you money.</span>
          </h1>

          <p className="hero-copy">
            TickrMind grades trade setups, explains the risk in plain English, and helps traders avoid
            emotional entries before low-quality trades become expensive lessons.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#beta">
              Get Early Access
              <Sparkles size={17} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#coach">
              View Demo
              <ChevronRight size={17} aria-hidden="true" />
            </a>
          </div>

          <form id="beta" className="beta-form" onSubmit={handleBetaSubmit}>
            <input className="bot-field" name="company" tabIndex={-1} autoComplete="off" />
            <input
              className="input"
              type="email"
              value={betaEmail}
              onChange={(event) => setBetaEmail(event.target.value)}
              placeholder="Enter your email"
              aria-label="Email address for beta access"
              required
            />
            <button className="button button-primary" type="submit" disabled={betaSubmitting}>
              {betaSubmitting ? "Sending..." : "Request Invite"}
            </button>
          </form>

          <p className="tiny-note" aria-live="polite">
            {betaStatus || "Built for options, stocks, futures, forex, and crypto traders."}
          </p>
        </motion.div>

        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <div className="product-frame app-preview" aria-label="TickrMind app screenshot preview">
            <div className="frame-top">
              <div className="window-controls" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="frame-label">{activeProduct.eyebrow}</div>
            </div>

            <div className="phone-showcase">
              <Image src={activeProduct.image} alt={activeProduct.alt} width={1080} height={1920} priority />
            </div>

            <div className="preview-caption">
              <div>
                <div className="section-label">{activeProduct.eyebrow}</div>
                <h2>{activeProduct.title}</h2>
              </div>
              <p>{activeProduct.description}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="ticker" aria-label="Sample market ticker">
        <div className="ticker-track">
          {duplicatedTicker.map(([symbol, price, change, direction], index) => (
            <div className="ticker-item" key={`${symbol}-${index}`}>
              <strong>{symbol}</strong>
              <span>{price}</span>
              <span className={direction}>{change}</span>
            </div>
          ))}
        </div>
      </div>

      <section id="product" className="shell section">
        <div className="section-label">Product Tour</div>
        <h2 className="display section-title">A real trading companion, not just another signal feed.</h2>
        <p className="section-copy">
          These product screens show the full loop: monitor the market, ask the coach, journal the
          outcome, review performance, and tighten risk settings.
        </p>

        <div className="product-tour">
          {productScreens.map((screen, index) => (
            <article className={`screen-card${index === 0 ? " featured" : ""}`} key={screen.title}>
              <div className="screen-copy">
                <div className="section-label">{screen.eyebrow}</div>
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
              </div>
              <div className="screen-shot">
                <Image
                  src={screen.image}
                  alt={screen.alt}
                  width={1080}
                  height={1920}
                  priority={index === 0}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="shell section">
        <div className="section-label">Why TickrMind</div>
        <h2 className="display section-title">Built to stop bad trades before they happen.</h2>
        <p className="section-copy">
          Signals are easy. Discipline is hard. TickrMind focuses on decision quality, risk context,
          and repeatable trading behavior.
        </p>

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="feature" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={23} aria-hidden="true" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            );
          })}
        </div>

        <CtaBand
          eyebrow="Trade With Discipline"
          title="Ready to trade with discipline?"
          text="Use TickrMind to slow down impulsive entries, review setup quality, and build a calmer decision process."
          href="#beta"
          label="Try TickrMind"
        />
      </section>

      <section className="shell section social-proof" aria-labelledby="social-proof-title">
        <div>
          <div className="section-label">Why Traders Use TickrMind</div>
          <h2 id="social-proof-title" className="display section-title">
            Built for the moments traders talk about after the trade.
          </h2>
          <p className="section-copy">
            TickrMind focuses on the recurring problems active traders recognize: chasing entries,
            ignoring risk rules, skipping the journal, and forcing trades without confirmation.
          </p>
        </div>

        <div className="proof-grid">
          <article className="proof-card">
            <strong>For overtrading</strong>
            <p>Turns “I need to be in something” into a structured wait, enter, or stand-aside decision.</p>
          </article>
          <article className="proof-card">
            <strong>For trade review</strong>
            <p>Keeps the journal and analytics close to the coach so traders can learn from every setup.</p>
          </article>
          <article className="proof-card">
            <strong>For risk discipline</strong>
            <p>Centers confidence, account size, max open trades, and risk per trade before the decision.</p>
          </article>
        </div>
      </section>

      <section className="shell section reviews-section" aria-labelledby="reviews-title">
        <div className="reviews-head">
          <h2 id="reviews-title" className="display section-title">User reviews</h2>
          <p className="section-copy">
            We’re collecting insights from traders using TickrMind to improve discipline and
            decision-making.
          </p>
        </div>

        <div className="reviews-grid featured-review-grid">
          <article className="review-card featured-review-card">
            <div className="review-stars" aria-label="5 star review">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <p>
              “TickrMind stopped me from forcing trades I normally would have regretted. It slowed
              me down and made me actually think before entering.”
            </p>
            <div className="review-author">
              <strong>Options Trader</strong>
              <span>Atlanta, GA</span>
              <span>Private Beta User</span>
            </div>
          </article>
        </div>
      </section>

      <section id="coach" className="shell section section-grid">
        <div>
          <div className="section-label">AI Coach Demo</div>
          <h2 className="display section-title">Ask TickrMind about your next trade.</h2>
          <p className="section-copy">
            The demo shows the tone and structure of TickrMind guidance: direct, risk-aware, and
            designed to make standing aside feel like a valid trade decision.
          </p>

          <div className="demo-prompts">
            {promptExamples.map((prompt) => (
              <button className="prompt-button" key={prompt} onClick={() => setInput(prompt)} type="button">
                <span>{prompt}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="chat">
          <div className="chat-head">
            <div className="avatar">
              <Bot size={22} aria-hidden="true" />
            </div>
            <div>
              <strong>TickrMind Coach</strong>
              <div className="subtle">AI coach active</div>
            </div>
          </div>

          <div className="chat-log" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="chat-compose">
            <input
              className="input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSend();
              }}
              placeholder="Ask: Should I enter QQQ calls?"
              aria-label="Ask TickrMind a trade question"
            />
            <button className="icon-button" onClick={handleSend} type="button" aria-label="Send question">
              <Send size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section id="pricing" className="shell section">
        <div className="section-label">Pricing</div>
        <h2 className="display section-title">Simple beta pricing.</h2>
        <p className="section-copy">
          Start with decision support and upgrade when you want deeper analytics and automation.
        </p>

        <div className="pricing-grid">
          <PricingCard
            title="Pro"
            price="$14.99"
            features={["AI trade coach", "Setup grading", "Trade journal", "Telegram alerts", "Mobile dashboard"]}
          />
          <PricingCard
            featured
            title="Elite"
            price="$29.99"
            features={[
              "Everything in Pro",
              "Position sizing coach",
              "Advanced analytics",
              "Futures and crypto expansion",
              "Priority support"
            ]}
          />
        </div>

        <CtaBand
          eyebrow="Start Your Process"
          title="Build the habit before the next trade."
          text="Start with the coach, journal the result, and let analytics show whether your discipline is improving."
          href="#beta"
          label="Start Free Trial"
        />
      </section>

      <section id="contact" className="shell section">
        <div className="section-label">Contact Us</div>
        <h2 className="display section-title">Questions, partnerships, or beta support.</h2>

        <div className="contact-layout">
          <div className="legal-card">
            <Mail size={28} color="var(--green)" aria-hidden="true" />
            <h3>Get in touch</h3>
            <p>
              Use the form for product questions, billing help, partnership inquiries, or beta access
              support. We route each inquiry to the right TickrMind inbox.
            </p>
            <div className="email-routing">
              <a href="mailto:support@tickrmind.com">
                <strong>support@tickrmind.com</strong>
                <span>Customer support / landing page</span>
              </a>
              <a href="mailto:hello@tickrmind.com">
                <strong>hello@tickrmind.com</strong>
                <span>Partnerships / general contact</span>
              </a>
              <a href="mailto:beta@tickrmind.com">
                <strong>beta@tickrmind.com</strong>
                <span>Beta invites & onboarding</span>
              </a>
            </div>
            <p>
              TickrMind does not provide individualized financial advice. Support can help with the
              product experience, not trade-specific guarantees.
            </p>
          </div>

          <div className="contact-card">
            <form onSubmit={handleContactSubmit}>
              <input className="bot-field" name="company" tabIndex={-1} autoComplete="off" />
              <input className="input" name="name" placeholder="Your name" aria-label="Your name" required />
              <input className="input" name="email" type="email" placeholder="Email address" aria-label="Email address" required />
              <select className="select" name="topic" aria-label="Inquiry topic" defaultValue="Beta access">
                <option>Beta access</option>
                <option>Support</option>
                <option>Partnership</option>
                <option>General contact</option>
                <option>Press</option>
              </select>
              <textarea className="textarea" name="message" placeholder="How can we help?" aria-label="Message" required />
              <button className="button button-primary" type="submit" disabled={contactSubmitting}>
                {contactSubmitting ? "Sending..." : "Send Message"}
                <Send size={17} aria-hidden="true" />
              </button>
              <p className="tiny-note" aria-live="polite">
                {contactStatus || "We aim to respond within two business days."}
              </p>
            </form>
          </div>
        </div>
      </section>

      <section id="legal" className="shell section">
        <div className="section-label">Policies</div>
        <h2 className="display section-title">Privacy Policy and Terms & Conditions.</h2>

        <div className="legal-grid">
          <article className="legal-card" id="privacy">
            <Lock size={28} color="var(--green)" aria-hidden="true" />
            <h3>Privacy Policy</h3>
            <p>Last updated: May 22, 2026</p>
            <ul>
              <li>We collect contact details you submit, product usage data, and technical information needed to operate TickrMind.</li>
              <li>We use information to provide beta access, improve the product, respond to support requests, and protect the service.</li>
              <li>We do not sell personal information. Limited service providers may process data only to support TickrMind operations.</li>
              <li>You may request access, correction, or deletion of your information by contacting support@tickrmind.com.</li>
            </ul>
          </article>

          <article className="legal-card" id="terms">
            <ShieldCheck size={28} color="var(--green)" aria-hidden="true" />
            <h3>Terms & Conditions</h3>
            <p>Last updated: May 22, 2026</p>
            <ul>
              <li>TickrMind is an educational and decision-support tool. It is not financial, investment, legal, or tax advice.</li>
              <li>You are responsible for every trade you place, including sizing, risk management, broker execution, and tax consequences.</li>
              <li>Beta features, pricing, alerts, and analytics may change before public launch.</li>
              <li>You agree not to misuse, reverse engineer, overload, or resell TickrMind without written permission.</li>
            </ul>
          </article>

          <article className="legal-card full">
            <h3>Risk Disclosure</h3>
            <p>
              TickrMind provides educational and decision-support insights only and does not provide
              investment, legal, or tax advice. Trading involves substantial risk and losses may
              exceed expectations. Past performance does not guarantee future results.
            </p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-inner">
          <div>
            <strong className="brand-name">TickrMind</strong>
            <div>Helping traders make smarter decisions — one setup at a time.</div>
            <div className="footer-email-list">
              <a href="mailto:support@tickrmind.com">support@tickrmind.com</a>
              <a href="mailto:hello@tickrmind.com">hello@tickrmind.com</a>
              <a href="mailto:beta@tickrmind.com">beta@tickrmind.com</a>
            </div>
            <div>Not financial advice. Trade responsibly.</div>
            <div>&copy; 2026 TickrMind. All rights reserved.</div>
          </div>
          <div className="footer-links">
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </footer>

      <SupportChatWidget />
    </main>
  );
}

function PricingCard({
  title,
  price,
  features,
  featured = false
}: {
  title: string;
  price: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <article className={`price-card${featured ? " featured" : ""}`}>
      <div className="section-label">{featured ? "Most Popular" : "Starter"}</div>
      <h3>{title}</h3>
      <div className="price">
        {price}
        <span>/month</span>
      </div>
      <ul className="check-list">
        {features.map((feature) => (
          <li key={feature}>
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a className={`button ${featured ? "button-primary" : "button-secondary"}`} href="#beta">
        Start Free Trial
      </a>
    </article>
  );
}

function CtaBand({
  eyebrow,
  title,
  text,
  href,
  label
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  label: string;
}) {
  return (
    <div className="cta-band">
      <div>
        <div className="section-label">{eyebrow}</div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <a className="button button-primary" href={href}>
        {label}
        <ArrowRight size={17} aria-hidden="true" />
      </a>
    </div>
  );
}

function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [supportInput, setSupportInput] = useState("");
  const [supportMessages, setSupportMessages] = useState<Message[]>([
    {
      role: "bot",
      text:
        "Hi, I am the TickrMind assistant. I can walk you through the product, explain beta pricing, or help you contact support."
    }
  ]);

  function sendSupportMessage(text: string) {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", text: text.trim() };
    const botReply = getSupportResponse(text);

    setSupportMessages((current) => [...current, userMessage, botReply]);
    setSupportInput("");
  }

  function handleSupportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendSupportMessage(supportInput);
  }

  return (
    <aside className={`support-widget${isOpen ? " open" : ""}`} aria-label="Ask TickrMind chat">
      {isOpen ? (
        <div className="support-panel">
          <div className="support-head">
            <div className="avatar">
              <Bot size={22} aria-hidden="true" />
            </div>
            <div>
              <strong>TickrMind Assistant</strong>
              <div className="subtle">Product questions and help</div>
            </div>
            <button className="support-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="support-quick" aria-label="Suggested chat prompts">
            {supportQuickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => sendSupportMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="support-log" aria-live="polite">
            {supportMessages.map((message, index) => (
              <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
          </div>

          <form className="support-compose" onSubmit={handleSupportSubmit}>
            <input
              className="input"
              value={supportInput}
              onChange={(event) => setSupportInput(event.target.value)}
              placeholder="Ask about support or product..."
              aria-label="Ask TickrMind"
            />
            <button className="icon-button" type="submit" aria-label="Send support message">
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      ) : (
        <button className="support-launcher" type="button" onClick={() => setIsOpen(true)} aria-label="Open Ask TickrMind chat">
          <MessageCircle size={22} aria-hidden="true" />
          <span>
            <small>Need help?</small>
            💬 Ask TickrMind
          </span>
        </button>
      )}
    </aside>
  );
}
