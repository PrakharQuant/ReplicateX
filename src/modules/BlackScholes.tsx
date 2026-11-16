import { useState, useMemo } from 'react';
import { blackScholes, crrBinomial } from '../lib/finance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const STEPS = [1, 5, 10, 25, 50, 100, 250];

export default function BlackScholes() {
  const defaults = { S0: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, type: 'call' as 'call' | 'put' };
  const [params, setParams] = useState(defaults);
  const update = (key: string, value: any) => setParams((p) => ({ ...p, [key]: value }));
  const reset = () => setParams(defaults);

  const bs = blackScholes(params);

  const convergence = useMemo(() => {
    return STEPS.map((n) => {
      const bin = crrBinomial({ ...params, n, style: 'european' });
      return { n, price: bin.price, valid: bin.valid };
    });
  }, [params]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-400">Black–Scholes Pricing & Convergence</h1>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
      <p className="text-gray-400">
        Closed-form European prices under geometric Brownian motion. The CRR binomial tree converges to the Black–Scholes price as the number of steps increases.
      </p>

      <div className="card grid grid-cols-2 md:grid-cols-5 gap-4">
        <label className="text-sm">S₀<input type="number" className="input mt-1" value={params.S0} onChange={(e) => update('S0', +e.target.value)} /></label>
        <label className="text-sm">K<input type="number" className="input mt-1" value={params.K} onChange={(e) => update('K', +e.target.value)} /></label>
        <label className="text-sm">T<input type="number" step="0.1" className="input mt-1" value={params.T} onChange={(e) => update('T', +e.target.value)} /></label>
        <label className="text-sm">r<input type="number" step="0.01" className="input mt-1" value={params.r} onChange={(e) => update('r', +e.target.value)} /></label>
        <label className="text-sm">σ<input type="number" step="0.01" className="input mt-1" value={params.sigma} onChange={(e) => update('sigma', +e.target.value)} /></label>
      </div>

      {bs.valid && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-cyan-400 mb-3">Black–Scholes Prices & Greeks</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>Call: <span className="text-teal-400 font-mono">{blackScholes({ ...params, type: 'call' }).price.toFixed(4)}</span></div>
              <div>Put: <span className="text-teal-400 font-mono">{blackScholes({ ...params, type: 'put' }).price.toFixed(4)}</span></div>
              <div>Delta: <span className="text-teal-400 font-mono">{bs.delta.toFixed(4)}</span></div>
              <div>Gamma: <span className="text-teal-400 font-mono">{bs.gamma.toFixed(6)}</span></div>
              <div>Theta (per year): <span className="text-teal-400 font-mono">{bs.theta.toFixed(4)}</span></div>
              <div>Vega (per unit σ): <span className="text-teal-400 font-mono">{bs.vega.toFixed(4)}</span></div>
              <div>Rho: <span className="text-teal-400 font-mono">{bs.rho.toFixed(4)}</span></div>
              <div>d₁: <span className="font-mono">{bs.d1.toFixed(4)}</span></div>
            </div>
            <p className="mt-4 text-xs text-gray-500 font-mono">
              d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)
            </p>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-cyan-400 mb-2">Binomial Convergence</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={convergence}>
                <CartesianGrid stroke="#1e3a5f" />
                <XAxis dataKey="n" stroke="#9ca3af" scale="log" domain={['dataMin', 'dataMax']} />
                <YAxis stroke="#9ca3af" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
                <Line type="monotone" dataKey="price" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4 }} name="CRR Binomial" />
                <ReferenceLine y={bs.price} stroke="#22d3ee" strokeDasharray="5 5" label={{ value: 'BS', fill: '#22d3ee', position: 'right' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card text-sm text-gray-300 space-y-2">
        <p><strong>Assumptions:</strong> Constant volatility, constant risk-free rate, no dividends, continuous trading, geometric Brownian motion for the stock, European exercise.</p>
        <p>The binomial model converges to Black–Scholes because the recombining tree approximates the continuous diffusion as Δt → 0. Both rest on the same no-arbitrage principle: a dynamically rebalanced portfolio of stock and bond replicates the option.</p>
      </div>
    </div>
  );
}
