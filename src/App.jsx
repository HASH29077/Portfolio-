import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, MessageCircle, Code, Zap, Database, Github, Twitter } from 'lucide-react';

// Scroll-reveal wrapper: fades + slides content up into view once, first time it enters the viewport
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
}

// Magnetic tilt wrapper: card tilts toward the cursor in 3D
function TiltCard({ className, children, maxTilt = 8 }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)',
  });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;
    setStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transition: 'transform 150ms ease-out' }}
      className={className}
    >
      {children}
    </div>
  );
}

// Counts up from 0 to a target number once it scrolls into view
function CountUp({ end, suffix = '', duration = 1500 }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let frame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [started, end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// Types out text character by character with a blinking cursor
function Typewriter({ text, speed = 25 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <>
      {displayed}
      <span className="inline-block w-[2px] h-[0.9em] bg-cyan-400 ml-1 align-middle animate-pulse" />
    </>
  );
}

export default function Portfolio() {
  useEffect(() => {
    // Page title
    document.title = 'Hash | Web Developer for Creators, Traders & Crypto Projects';

    // Helper to set or update a meta tag
    const setMeta = (attr, key, content) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // Favicon
    const setFavicon = (rel, href, sizes) => {
      let link = document.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (sizes) link.setAttribute('sizes', sizes);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };
    setFavicon('icon', '/favicon-32.png', '32x32');
    setFavicon('icon', '/favicon-16.png', '16x16');
    setFavicon('apple-touch-icon', '/apple-touch-icon.png');
    setFavicon('shortcut icon', '/favicon.ico');

    setMeta('name', 'description', 'I build fast, clean websites and web apps for creators, traders, businesses & crypto projects. React, Tailwind, Firebase. Message me on WhatsApp.');
    setMeta('property', 'og:title', 'Hash | Web Developer');
    setMeta('property', 'og:description', 'Fast, clean websites & web apps for creators, traders, businesses & crypto projects.');
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:image', '/og-image.png');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', 'Hash | Web Developer');
    setMeta('name', 'twitter:description', 'Fast, clean websites & web apps for creators, traders, businesses & crypto projects.');
    setMeta('name', 'twitter:image', '/og-image.png');
  }, []);

  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white bg-[length:400%_400%] animate-gradient-shift">
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift { animation: gradient-shift 18s ease infinite; }

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(15px, -20px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 15px); }
        }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 12s ease-in-out infinite; }
      `}</style>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <img
              src="data:image/png;base64,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"
              alt="Hash logo"
              className="w-8 h-8 rounded-md"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Hash
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available for new projects
            </span>
            <a 
              href="https://wa.me/2348152164323" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-slate-300 hover:text-cyan-400 transition-colors duration-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-32 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slower"></div>
        <div
          className={`relative z-10 space-y-8 transition-all duration-700 ease-out ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight min-h-[1.2em] sm:min-h-[2.4em]">
              <Typewriter text="I build websites & web apps for creators, traders, businesses & crypto projects" />
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl">
              Need something fast & affordable? I build clean, responsive web apps with proof to back it up.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a 
              href="https://wa.me/2348152164323" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <MessageCircle size={20} />
              Message on WhatsApp
            </a>
            <a 
              href="mailto:omotayomichael666@gmail.com"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 hover:scale-[1.03] active:scale-[0.98] rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Email
            </a>
          </div>
          <p className="text-sm text-slate-400 pt-4">💬 I respond within 2 hours on WhatsApp • We'll schedule a quick call to discuss your project</p>
        </div>
      </section>

      {/* Live Examples */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <h3 className="text-2xl font-bold mb-8">Live Projects</h3>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* LinkHubX */}
          <Reveal delay={0}>
            <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold mb-1">LinkHubX</h4>
                  <p className="text-sm text-slate-300">Bio link page builder</p>
                </div>
                <ExternalLink size={20} className="text-slate-400" aria-hidden="true" />
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Clean, customizable link page for creators. Like Linktree but faster.
              </p>
              <a 
                href="https://linkhubx.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                View Project <ExternalLink size={16} aria-hidden="true" />
              </a>
            </TiltCard>
          </Reveal>

          {/* HashQuiz */}
          <Reveal delay={120}>
            <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold mb-1">HashQuiz</h4>
                  <p className="text-sm text-slate-300">Multi-course quiz platform</p>
                </div>
                <ExternalLink size={20} className="text-slate-400" aria-hidden="true" />
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Quiz app with multiple courses, leaderboard, Firebase backend, and progress tracking.
              </p>
              <a 
                href="https://hashfun-self.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                View Project <ExternalLink size={16} aria-hidden="true" />
              </a>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* Services & Pricing */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <h3 className="text-2xl font-bold mb-8">Services & Pricing</h3>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Link Pages */}
          <Reveal delay={0}>
            <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-cyan-400" size={24} aria-hidden="true" />
                <h4 className="font-semibold">Link/Bio Pages</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Custom link pages for creators. Customizable, fast, mobile-friendly.
              </p>
            </TiltCard>
          </Reveal>

          {/* Landing Pages */}
          <Reveal delay={120}>
            <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-center gap-3 mb-4">
                <Code className="text-cyan-400" size={24} aria-hidden="true" />
                <h4 className="font-semibold">Business Landing Pages</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Hero, About, Services, Testimonials, Contact form. Fully responsive.
              </p>
            </TiltCard>
          </Reveal>

          {/* Quiz Apps */}
          <Reveal delay={240}>
            <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-cyan-400" size={24} aria-hidden="true" />
                <h4 className="font-semibold">Quiz & Web Apps</h4>
              </div>
              <p className="text-slate-300 text-sm">
                Interactive tools, databases, AI features, dashboards, leaderboards.
              </p>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <Reveal>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h3 className="text-2xl font-bold mb-6">About Me</h3>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 mb-8">
          <p className="text-slate-300 leading-relaxed">
            I'm Hash — Omotayo Ayomide Michael — a developer who builds fast, no-nonsense web apps with React, Tailwind, and Firebase. 
            I like shipping things that actually work — bio pages, quiz platforms, dashboards, whatever the project needs — 
            without dragging you through weeks of back and forth. Based in Nigeria, building for clients everywhere, 
            including creators, traders, and crypto projects who need someone that moves fast and gets it.
          </p>
        </div>

        {/* Experience & Credibility Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50" maxTilt={6}>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              <CountUp end={3} suffix="+" />
            </div>
            <p className="text-slate-300 text-sm">Years Experience</p>
          </TiltCard>
          <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50" maxTilt={6}>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              <CountUp end={50} suffix="+" />
            </div>
            <p className="text-slate-300 text-sm">Projects Delivered</p>
          </TiltCard>
          <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50" maxTilt={6}>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              5-7
            </div>
            <p className="text-slate-300 text-sm">Days Avg Delivery</p>
          </TiltCard>
        </div>
      </section>
      </Reveal>

      {/* Why Me */}
      <Reveal>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h3 className="text-2xl font-bold mb-8">Why Work With Me</h3>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></div>
              <div>
                <h4 className="font-semibold mb-2">Fast Delivery</h4>
                <p className="text-slate-300 text-sm">5-7 days for most projects. No delays, no excuses.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></div>
              <div>
                <h4 className="font-semibold mb-2">Clean Code</h4>
                <p className="text-slate-300 text-sm">Built with React, Tailwind, Firebase. Scalable & maintainable.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></div>
              <div>
                <h4 className="font-semibold mb-2">Mobile First</h4>
                <p className="text-slate-300 text-sm">Every project works perfectly on phone, tablet, desktop.</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></div>
              <div>
                <h4 className="font-semibold mb-2">Crypto Native</h4>
                <p className="text-slate-300 text-sm">I build for Web3 projects. I understand what you need.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></div>
              <div>
                <h4 className="font-semibold mb-2">Affordable</h4>
                <p className="text-slate-300 text-sm">No overpricing. Good value for quality work.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></div>
              <div>
                <h4 className="font-semibold mb-2">Revisions Included</h4>
                <p className="text-slate-300 text-sm">2 rounds of revisions. Get it right the first time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <h3 className="text-2xl font-bold mb-8">How It Works</h3>
        </Reveal>
        <div className="space-y-6">
          <div className="grid sm:grid-cols-4 gap-4">
            {/* Step 1 */}
            <Reveal delay={0}>
              <div className="relative">
                <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50" maxTilt={6}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold mb-4">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Message Me</h4>
                  <p className="text-slate-300 text-sm">Hit me up on WhatsApp with your idea. Quick response guaranteed.</p>
                </TiltCard>
                <div className="hidden sm:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal delay={100}>
              <div className="relative">
                <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50" maxTilt={6}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold mb-4">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Discovery Call</h4>
                  <p className="text-slate-300 text-sm">We discuss your needs, timeline, budget, and vision for the project.</p>
                </TiltCard>
                <div className="hidden sm:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={200}>
              <div className="relative">
                <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50" maxTilt={6}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold mb-4">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">I Build It</h4>
                  <p className="text-slate-300 text-sm">Fast development with clean code. You get updates & can request changes.</p>
                </TiltCard>
                <div className="hidden sm:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </div>
            </Reveal>

            {/* Step 4 */}
            <Reveal delay={300}>
              <div>
                <TiltCard className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50" maxTilt={6}>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold mb-4">
                    4
                  </div>
                  <h4 className="font-semibold mb-2">Launch</h4>
                  <p className="text-slate-300 text-sm">Site goes live. 2 rounds of revisions included. Ongoing support available.</p>
                </TiltCard>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Reveal>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {/* FAQ Item 1 */}
          <details className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-cyan-500/50 transition-colors duration-300">
            <summary className="flex justify-between items-center font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded">
              How fast can you deliver?
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>
            <p className="text-slate-300 mt-4">Most projects are delivered in 5-7 days. Complex projects might take 1-2 weeks. I'll give you a clear timeline during our call.</p>
          </details>

          {/* FAQ Item 3 */}
          <details className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-cyan-500/50 transition-colors duration-300">
            <summary className="flex justify-between items-center font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded">
              Do you offer revisions?
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>
            <p className="text-slate-300 mt-4">Yes. 2 rounds of revisions are included in every project. Need more after that? Just message me and we'll sort out something fair. We'll get your site right before launch.</p>
          </details>

          {/* FAQ Item 4 */}
          <details className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-cyan-500/50 transition-colors duration-300">
            <summary className="flex justify-between items-center font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded">
              What's your response time?
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>
            <p className="text-slate-300 mt-4">I respond within 2 hours on WhatsApp during business hours. For urgent matters, message me directly and I'll get back to you ASAP.</p>
          </details>

          {/* FAQ Item 5 */}
          <details className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-cyan-500/50 transition-colors duration-300">
            <summary className="flex justify-between items-center font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded">
              Do you provide support after launch?
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>
            <p className="text-slate-300 mt-4">Yes. I include 30 days of free support after launch for bug fixes and small tweaks. Extended support & maintenance can be arranged based on your needs.</p>
          </details>

          {/* FAQ Item 6 */}
          <details className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-cyan-500/50 transition-colors duration-300">
            <summary className="flex justify-between items-center font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded">
              Can you work with my existing code?
              <span className="transition-transform duration-300 group-open:rotate-180">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </summary>
            <p className="text-slate-300 mt-4">Absolutely. If you have existing code from another dev, I can take over, debug, improve, or add features to it. Just send me the details.</p>
          </details>
        </div>
      </section>
      </Reveal>

      {/* CTA Section */}
      <Reveal>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-slate-700">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl p-8 sm:p-12 text-center hover:shadow-xl hover:shadow-cyan-500/5 transition-shadow duration-500">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to get your project built?
          </h3>
          <p className="text-slate-200 mb-2 max-w-2xl mx-auto">
            Message me on WhatsApp with your idea. Here's what happens next:
          </p>
          <p className="text-sm text-slate-300 mb-8 max-w-2xl mx-auto">
            ✓ I respond within 2 hours • We schedule a 15-min discovery call • I send you a quote • We start building
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/2348152164323" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
            >
              <MessageCircle size={20} />
              Start on WhatsApp
            </a>
            <a 
              href="mailto:omotayomichael666@gmail.com"
              className="px-8 py-3 bg-slate-600 hover:bg-slate-500 hover:scale-[1.03] active:scale-[0.98] rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800"
            >
              Email Me Instead
            </a>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-700">
        <div className="space-y-8">
          {/* Links Section */}
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-sm mb-3">My Portfolio</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://github.com/borz29077" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <Github size={16} aria-hidden="true" />
                    GitHub - All my projects
                  </a>
                </li>
                <li>
                  <a 
                    href="https://x.com/imnotfabrizio" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <Twitter size={16} aria-hidden="true" />
                    X - Latest updates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Get In Touch</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://wa.me/2348152164323"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <MessageCircle size={16} aria-hidden="true" />
                    WhatsApp - Quick response
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:omotayomichael666@gmail.com"
                    className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    Email - omotayomichael666@gmail.com
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Info</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✓ 5-7 day delivery</li>
                <li>✓ 2 rounds of revisions</li>
                <li>✓ 30 days free support</li>
                <li>✓ Based in Nigeria</li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">Built fast. Built to last.</p>
            <p className="text-slate-400 text-xs">© 2026 Hash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
