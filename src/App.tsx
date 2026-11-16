import { useState } from 'react';
import Home from './modules/Home';
import ReplicationLab from './modules/ReplicationLab';
import ArbitrageDetector from './modules/ArbitrageDetector';
import BinomialModel from './modules/BinomialModel';
import DynamicHedging from './modules/DynamicHedging';
import BlackScholes from './modules/BlackScholes';
import Greeks from './modules/Greeks';
import Foundations from './modules/Foundations';

type Page =
  | 'home'
  | 'replication'
  | 'arbitrage'
  | 'binomial'
  | 'hedging'
  | 'blackscholes'
  | 'greeks'
  | 'foundations';

const navItems: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'replication', label: 'Replication Lab' },
  { id: 'arbitrage', label: 'Arbitrage Detector' },
  { id: 'binomial', label: 'Binomial Model' },
  { id: 'hedging', label: 'Dynamic Hedging' },
  { id: 'blackscholes', label: 'Black–Scholes' },
  { id: 'greeks', label: 'Greeks & Risk' },
  { id: 'foundations', label: 'Mathematical Foundations' },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy-800 border-b border-navy-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage('home')} className="text-2xl font-bold tracking-tight">
            <span className="text-teal-400">REPlicATE</span>
            <span className="text-cyan-400">X</span>
          </button>
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  page === item.id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <select
            className="md:hidden bg-navy-700 text-white rounded px-2 py-1 text-sm"
            value={page}
            onChange={(e) => setPage(e.target.value as Page)}
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {page === 'home' && <Home onNavigate={setPage} />}
        {page === 'replication' && <ReplicationLab />}
        {page === 'arbitrage' && <ArbitrageDetector />}
        {page === 'binomial' && <BinomialModel />}
        {page === 'hedging' && <DynamicHedging />}
        {page === 'blackscholes' && <BlackScholes />}
        {page === 'greeks' && <Greeks />}
        {page === 'foundations' && <Foundations />}
      </main>

      <footer className="bg-navy-800 border-t border-navy-700 py-6 text-center text-sm text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-3">
            ReplicateX — The Mathematics of No-Arbitrage · Built by{' '}
            <a href="https://prakharquant.github.io/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">
              Prakhar Gupta
            </a>
          </p>
          <div className="flex justify-center items-center gap-6 mb-3">
            <a
              href="mailto:bestofprakhar@gmail.com"
              title="Email Prakhar Gupta"
              className="text-gray-400 hover:text-teal-400 transition"
              aria-label="Email"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/prakhar-gupta"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="text-gray-400 hover:text-teal-400 transition"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://x.com/PrakharQuant"
              target="_blank"
              rel="noopener noreferrer"
              title="X / Twitter"
              className="text-gray-400 hover:text-teal-400 transition"
              aria-label="X (Twitter)"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
          <p className="text-xs">Open source quantitative finance laboratory</p>
        </div>
      </footer>
    </div>
  );
}
