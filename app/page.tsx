'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [demoTime, setDemoTime] = useState({ minutes: 12, seconds: 34 });
  const [phoneTime, setPhoneTime] = useState({ minutes: 4, seconds: 32 });
  const [isScrolled, setIsScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Navigation scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Demo timer
    const demoInterval = setInterval(() => {
      setDemoTime((prev) => {
        let newSeconds = prev.seconds + 1;
        let newMinutes = prev.minutes;
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes++;
        }
        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    // Phone timer
    const phoneInterval = setInterval(() => {
      setPhoneTime((prev) => {
        let newSeconds = prev.seconds + 1;
        let newMinutes = prev.minutes;
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes++;
        }
        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    // Intersection Observer for animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');

            // Trigger counter animation for stats
            if (entry.target.classList.contains('stat-card')) {
              const numberEl = entry.target.querySelector('.stat-number') as HTMLElement;
              if (numberEl) animateCounter(numberEl);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.fade-in, .stagger-children, .stat-card').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(demoInterval);
      clearInterval(phoneInterval);
      observerRef.current?.disconnect();
    };
  }, []);

  const animateCounter = (el: HTMLElement) => {
    const target = parseInt(el.dataset.target || '0');
    if (!target) return;

    const duration = 2000;
    const start = performance.now();

    const update = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className={isScrolled ? 'scrolled' : ''}>
        <div className="container">
          <a href="#" className="logo">
            <span className="logo-icon"></span>
            Please Hold
          </a>
          <div className="nav-links">
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <a href="#cta" className="cta cta-small" onClick={(e) => handleSmoothScroll(e, '#cta')}>
              <span>Get Started</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hold-indicators">
            <div className="hold-indicator">Just a moment...</div>
            <div className="hold-indicator">Still clarifying...</div>
            <div className="hold-indicator">Please hold...</div>
            <div className="spinner-decor"></div>
            <div className="spinner-decor"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="status-dot"></span>
            Currently wasting spam time
          </div>
          <h1>Please hold.<br /><em>Forever.</em></h1>
          <p className="hero-subtitle">
            Please Hold is an AI that answers spam calls and politely wastes the caller&apos;s
            time—without sharing personal information.
          </p>
          <div className="hero-ctas">
            <a href="#cta" className="cta" onClick={(e) => handleSmoothScroll(e, '#cta')}>
              <span>Put scammers on hold</span>
            </a>
            <a
              href="#how-it-works"
              className="cta cta-secondary"
              onClick={(e) => handleSmoothScroll(e, '#how-it-works')}
            >
              <span>See how it works</span>
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">How It Works</div>
            <h2>Three steps to peaceful silence</h2>
            <p>
              Setting up Please Hold takes about two minutes. Scammers, however, will be busy much
              longer.
            </p>
          </div>

          <div className="steps stagger-children">
            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span className="step-number">1</span>
              </div>
              <h3>Forward suspicious calls</h3>
              <p>Route spam callers to your Please Hold number using call forwarding.</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
                <span className="step-number">2</span>
              </div>
              <h3>AI engages politely</h3>
              <p>Our AI answers and begins a very thorough, very slow conversation.</p>
            </div>

            <div className="step">
              <div className="step-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="step-number">3</span>
              </div>
              <h3>You stay uninterrupted</h3>
              <p>Scammers stay busy while you enjoy a spam-free existence.</p>
            </div>
          </div>

          <div className="steps-note fade-in">
            &ldquo;No yelling. No pranks. Just endless clarification.&rdquo;
          </div>
        </div>
      </section>

      {/* What the AI Does */}
      <section className="what-ai-does">
        <div className="container">
          <div>
            <div className="section-label">What It Does</div>
            <h2>Weaponized politeness</h2>
            <p>
              Our AI has mastered the art of being helpful without actually helping. Think of it as
              customer service, but for scammers.
            </p>

            <ul className="features-list stagger-children">
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>Politely asks for clarification</strong>
                  <span>&ldquo;I&apos;m sorry, could you spell that one more time?&rdquo;</span>
                </div>
              </li>
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>Writes things down very slowly</strong>
                  <span>&ldquo;Let me just get a pen... okay, go ahead.&rdquo;</span>
                </div>
              </li>
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>Mishears details just enough</strong>
                  <span>&ldquo;Did you say &apos;Microsoft&apos; or &apos;micro soft&apos;?&rdquo;</span>
                </div>
              </li>
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>Defers decisions indefinitely</strong>
                  <span>&ldquo;I should probably check with my spouse first...&rdquo;</span>
                </div>
              </li>
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>Never agrees to anything</strong>
                  <span>&ldquo;That sounds interesting, but I have some questions...&rdquo;</span>
                </div>
              </li>
            </ul>

            <div className="callout-box">
              <p>&ldquo;It&apos;s not rude. It&apos;s just... thorough.&rdquo;</p>
            </div>
          </div>

          <div className="ai-demo fade-in">
            <div className="demo-card">
              <div className="demo-header">
                <div className="demo-status">
                  <span className="status-dot"></span>
                  Call in progress
                </div>
                <span className="demo-time">
                  {demoTime.minutes}:{demoTime.seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="demo-messages">
                <div className="demo-message caller">
                  Hi, I&apos;m calling about your car&apos;s extended warranty...
                </div>
                <div className="demo-message ai">
                  Oh wonderful! I&apos;ve been meaning to look into that. Which car are we talking
                  about?
                </div>
                <div className="demo-message caller">The one registered to this number.</div>
                <div className="demo-message ai">
                  Hmm, I have a few. Could you give me a moment to find my paperwork?
                </div>
              </div>
              <div className="demo-progress">
                <div className="demo-progress-label">Caller patience remaining</div>
                <div className="demo-progress-bar">
                  <div className="demo-progress-fill"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What It Never Does */}
      <section className="never-does">
        <div className="container">
          <div className="section-header">
            <div className="section-label" style={{ color: 'var(--sage-light)' }}>
              Privacy First
            </div>
            <h2>What it never does</h2>
            <p>Please Hold is designed to protect you—not to cross lines.</p>
          </div>

          <div className="never-grid stagger-children">
            <div className="never-item">
              <div className="never-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div>
                <h4>Never shares personal data</h4>
                <p>No names, addresses, financial info, or real details ever leave your control.</p>
              </div>
            </div>

            <div className="never-item">
              <div className="never-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
                </svg>
              </div>
              <div>
                <h4>Never threatens or insults</h4>
                <p>All interactions stay polite. Confusion is the weapon, not confrontation.</p>
              </div>
            </div>

            <div className="never-item">
              <div className="never-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <div>
                <h4>Never impersonates authorities</h4>
                <p>Won&apos;t pretend to be law enforcement, government, or anyone official.</p>
              </div>
            </div>

            <div className="never-item">
              <div className="never-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </div>
              <div>
                <h4>Never makes commitments</h4>
                <p>Won&apos;t agree to purchases, sign-ups, or anything that creates obligations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="section-header fade-in">
            <div className="section-label">The Numbers</div>
            <h2>Politely wasting time at scale</h2>
          </div>

          <div className="stats-grid stagger-children">
            <div className="stat-card">
              <div className="stat-number" data-target="847293">
                0
              </div>
              <div className="stat-label">Minutes of spam time wasted</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" data-target="12847">
                0
              </div>
              <div className="stat-label">Calls politely derailed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" data-target="342">
                0
              </div>
              <div className="stat-label">Scammers still explaining</div>
            </div>
            <div className="stat-card joke">
              <div className="stat-number">0%</div>
              <div className="stat-label">Average patience remaining</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="who-for">
        <div className="container">
          <div>
            <div className="section-label">Who It&apos;s For</div>
            <h2>Built for people who&apos;ve had enough</h2>

            <div className="persona-list stagger-children">
              <div className="persona">
                <div className="persona-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div>
                  <h4>Anyone tired of spam calls</h4>
                  <p>Reclaim your peace. Let someone else &ldquo;handle&rdquo; it.</p>
                </div>
              </div>

              <div className="persona">
                <div className="persona-icon">
                  <svg viewBox="0 0 24 24">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <h4>Builders, hackers, and tinkerers</h4>
                  <p>You appreciate an elegant solution to an annoying problem.</p>
                </div>
              </div>

              <div className="persona">
                <div className="persona-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h4>People who prefer quiet revenge</h4>
                  <p>No confrontation needed. Just cosmic justice, one wasted minute at a time.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="who-visual">
            <div className="floating-badge">Hold music playing...</div>
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="phone-header">
                  <span className="status-dot"></span>
                  <span>On Hold</span>
                </div>
                <div className="phone-content">
                  <div className="phone-timer">
                    {phoneTime.minutes.toString().padStart(2, '0')}:
                    {phoneTime.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="phone-label">and counting...</div>
                  <div className="phone-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-badge">&ldquo;Just one more question...&rdquo;</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta" id="cta">
        <div className="container">
          <h2 className="fade-in">
            You don&apos;t need to hang up.
            <br />
            We won&apos;t either.
          </h2>
          <p className="fade-in">
            Start forwarding spam calls to Please Hold and reclaim your peace of mind.
          </p>
          <a href="#" className="cta fade-in">
            <span>Start wasting spam time</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-brand">
            <a href="#" className="logo">
              <span className="logo-icon"></span>
              Please Hold
            </a>
            <p className="footer-tagline">
              A defensive call-handling service. No scammers were harmed—just delayed.
            </p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
