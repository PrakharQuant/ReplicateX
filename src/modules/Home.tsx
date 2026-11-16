import { useState } from 'react';
import { onePeriodReplication } from '../lib/finance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  onNavigate: (page: any) => void;
}

export default function Home({ onNavigate }: Props) {
  const [params, setParams] = useState({
    S0: 100,
    Su: 120,
    Sd: 80,
    K: 100,
    r: 0.05,
    type: 'call' as 'call' | 'put',
  });

  const result = onePeriodReplication(params);

  const update = (key: string, value: number | string) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const chartData = result.valid
    ? [
        { S: params.Sd, payoff: result.Cd },
        { S: params.Su, payoff: result.Cu },
      ]
    : [];

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-5xl font-bold mb-2">
          <span className="text-teal-400">REPlicATE</span>
          <span className="text-cyan-400">X</span>
        </h1>
        <p className="text-2xl text-gray-300 mb-4">The Mathematics of No-Arbitrage</p>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Understand how derivatives are priced, replicated and hedged through mathematical finance.
        </p>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold text-teal-400 mb-3">Central Principle</h2>
        <p className="text-gray-300 leading-relaxed">
          A derivative’s theoretical value can be established by constructing a portfolio of traded assets
          that reproduces its future payoffs. In an arbitrage-free market, identical future cash flows must
          have identical current prices. This is the Law of One Price.
        </p>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold text-teal-400 mb-4">Live Demonstration — One-Period Binomial</h2>
        <p className="text-sm text-gray-400 mb-4">
          Default: ₹100 stock, strike ₹100, up to ₹120, down to ₹80, 5% risk-free rate. European call.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <label className="text-sm">
            S₀
            <input type="number" className="input mt-1" value={params.S0} onChange={(e) => update('S0', +e.target.value)} />
          </label>
          <label className="text-sm">
            S_u
            <input type="number" className="input mt-1" value={params.Su} onChange={(e) => update('Su', +e.target.value)} />
          </label>
          <label className="text-sm">
            S_d
            <input type="number" className="input mt-1" value={params.Sd} onChange={(e) => update('Sd', +e.target.value)} />
          </label>
          <label className="text-sm">
            Strike K
            <input type="number" className="input mt-1" value={params.K} onChange={(e) => update('K', +e.target.value)} />
          </label>
          <label className="text-sm">
            r (period)
            <input type="number" step="0.01" className="input mt-1" value={params.r} onChange={(e) => update('r', +e.target.value)} />
          </label>
          <label className="text-sm">
            Type
            <select className="input mt-1" value={params.type} onChange={(e) => update('type', e.target.value)}>
              <option value="call">Call</option>
              <option value="put">Put</option>
            </select>
          </label>
        </div>

        {result.valid ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2">Replicating Portfolio</h3>
              <ul className="space-y-1 text-sm">
                <li>Shares (Δ): <span className="text-teal-400 font-mono">{result.delta.toFixed(4)}</span></li>
                <li>Cash (B): <span className="text-teal-400 font-mono">{result.B.toFixed(4)}</span> {result.B < 0 ? '(borrow)' : '(invest)'}</li>
                <li>Theoretical price C₀: <span className="text-teal-400 font-mono text-lg">{result.C0.toFixed(4)}</span></li>
                <li>Payoff up: {result.Cu.toFixed(2)} | down: {result.Cd.toFixed(2)}</li>
              </ul>
              <p className="mt-4 text-xs text-gray-400">
                Δ = (C_u − C_d) / (S_u − S_d)
              </p>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1e3a5f" />
                  <XAxis dataKey="S" stroke="#9ca3af" label={{ value: 'Stock Price at T', position: 'insideBottom', offset: -5, fill: '#9ca3af' }} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
                  <Line type="monotone" dataKey="payoff" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-center text-gray-500 mt-1">Payoffs match exactly at terminal states</p>
            </div>
          </div>
        ) : (
          <p className="text-red-400">{result.error}</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn" onClick={() => onNavigate('replication')}>Open Full Replication Lab →</button>
          <button className="btn bg-cyan-700 hover:bg-cyan-600" onClick={() => onNavigate('binomial')}>Multi-period Tree →</button>
          <button className="btn bg-navy-700 hover:bg-navy-600" onClick={() => onNavigate('hedging')}>Dynamic Hedging →</button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Replication Lab', desc: 'Construct the exact replicating portfolio in a one-period model.', page: 'replication' },
          { title: 'Arbitrage Detector', desc: 'See how mispricing creates risk-free profit under model assumptions.', page: 'arbitrage' },
          { title: 'CRR Binomial Tree', desc: 'Price European and American options with multi-period trees.', page: 'binomial' },
          { title: 'Dynamic Delta Hedging', desc: 'Simulate discrete rebalancing and observe residual hedging error.', page: 'hedging' },
          { title: 'Black–Scholes & Convergence', desc: 'Watch the binomial model approach the continuous-time formula.', page: 'blackscholes' },
          { title: 'Greeks & Risk', desc: 'Visualize how Delta, Gamma, Theta and Vega respond to market moves.', page: 'greeks' },
        ].map((m) => (
          <button
            key={m.page}
            onClick={() => onNavigate(m.page)}
            className="card text-left hover:border-teal-500 transition"
          >
            <h3 className="font-semibold text-teal-400">{m.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{m.desc}</p>
          </button>
        ))}
      </section>
    </div>
  );
}
