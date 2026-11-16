import { useState, useMemo } from 'react';
import { blackScholes, simulateGBM } from '../lib/finance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DynamicHedging() {
  const defaults = {
    S0: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, n: 20, seed: 42, type: 'call' as 'call' | 'put',
  };
  const [params, setParams] = useState(defaults);
  const update = (key: string, value: any) => setParams((p) => ({ ...p, [key]: value }));
  const reset = () => setParams(defaults);

  const simulation = useMemo(() => {
    const path = simulateGBM(params.S0, params.r, params.sigma, params.T, params.n, params.seed);
    const dt = params.T / params.n;
    const times = path.map((_, i) => (i * params.T) / params.n);

    let shares = 0;
    let cash = 0;
    const data: any[] = [];

    const initial = blackScholes({ ...params, T: params.T });
    const optionPremium = initial.price;
    shares = initial.delta;
    cash = optionPremium - shares * params.S0;

    for (let i = 0; i < path.length; i++) {
      const tRemaining = params.T - times[i];
      const S = path[i];
      const bs = blackScholes({ S0: S, K: params.K, T: Math.max(tRemaining, 1e-8), r: params.r, sigma: params.sigma, type: params.type });
      const targetDelta = bs.delta;

      if (i > 0) {
        cash *= Math.exp(params.r * dt);
        const trade = targetDelta - shares;
        cash -= trade * S;
        shares = targetDelta;
      }
      const portValue = shares * S + cash;
      const theo = tRemaining > 1e-6 ? bs.price : (params.type === 'call' ? Math.max(S - params.K, 0) : Math.max(params.K - S, 0));
      data.push({
        t: times[i],
        S,
        delta: targetDelta,
        shares,
        portfolio: portValue,
        error: portValue - theo,
      });
    }

    const finalError = data[data.length - 1].error;

    return { data, finalError, initialPrice: optionPremium };
  }, [params]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-400">Dynamic Delta Hedging Simulator</h1>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
      <p className="text-gray-400">
        Discrete rebalancing of a delta hedge. Even with the correct Black–Scholes delta, finite rebalancing intervals leave residual error.
      </p>

      <div className="card grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <label className="text-sm">S₀<input type="number" className="input mt-1" value={params.S0} onChange={(e) => update('S0', +e.target.value)} /></label>
        <label className="text-sm">K<input type="number" className="input mt-1" value={params.K} onChange={(e) => update('K', +e.target.value)} /></label>
        <label className="text-sm">T<input type="number" step="0.1" className="input mt-1" value={params.T} onChange={(e) => update('T', +e.target.value)} /></label>
        <label className="text-sm">σ<input type="number" step="0.01" className="input mt-1" value={params.sigma} onChange={(e) => update('sigma', +e.target.value)} /></label>
        <label className="text-sm">r<input type="number" step="0.01" className="input mt-1" value={params.r} onChange={(e) => update('r', +e.target.value)} /></label>
        <label className="text-sm">Rebalances n<input type="number" min={2} max={100} className="input mt-1" value={params.n} onChange={(e) => update('n', +e.target.value)} /></label>
        <label className="text-sm">Seed<input type="number" className="input mt-1" value={params.seed} onChange={(e) => update('seed', +e.target.value)} /></label>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-gray-400">Initial Option Price</div>
          <div className="text-2xl font-mono text-teal-400">{simulation.initialPrice.toFixed(4)}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400">Final Hedging Error</div>
          <div className={`text-2xl font-mono ${Math.abs(simulation.finalError) < 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
            {simulation.finalError.toFixed(4)}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400">Rebalancing Frequency</div>
          <div className="text-2xl font-mono text-cyan-400">{params.n} steps</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">Stock Price Path</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={simulation.data}>
              <CartesianGrid stroke="#1e3a5f" />
              <XAxis dataKey="t" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
              <Line type="monotone" dataKey="S" stroke="#22d3ee" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">Delta through Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={simulation.data}>
              <CartesianGrid stroke="#1e3a5f" />
              <XAxis dataKey="t" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
              <Line type="monotone" dataKey="delta" stroke="#2dd4bf" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">Shares Held</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={simulation.data}>
              <CartesianGrid stroke="#1e3a5f" />
              <XAxis dataKey="t" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
              <Line type="monotone" dataKey="shares" stroke="#14b8a6" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">Hedging Error</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={simulation.data}>
              <CartesianGrid stroke="#1e3a5f" />
              <XAxis dataKey="t" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
              <Line type="monotone" dataKey="error" stroke="#fbbf24" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card text-sm text-gray-300">
        <strong>Why residual error?</strong> The Black–Scholes model assumes continuous rebalancing. With discrete intervals the gamma exposure (convexity) produces a profit/loss that is not perfectly offset until the next rebalance. Higher frequency reduces the average absolute error, but never eliminates it for finite n. This is the practical cost of dynamic hedging.
      </div>
    </div>
  );
}
