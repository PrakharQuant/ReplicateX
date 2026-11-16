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

      <footer className="bg-navy-800 border-t border-navy-700 py-4 text-center text-sm text-gray-400">
        ReplicateX — The Mathematics of No-Arbitrage · Open source quantitative finance laboratory
      </footer>
    </div>
  );
}
