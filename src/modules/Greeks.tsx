import { useState } from 'react';
import { blackScholes } from '../lib/finance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Greeks() {
  const defaults = { S0: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, type: 'call' as 'call' | 'put' };
  const [params, setParams] = useState(defaults);
  const update = (key: string, value: any) => setParams((p) => ({ ...p, [key]: value }));
  const reset = () => setParams(defaults);

  const bs = blackScholes(params);

  const sRange = Array.from({ length: 41 }, (_, i) => 60 + i * 2);
  const spotData = sRange.map((S) => {
    const res = blackScholes({ ...params, S0: S });
    return { S, price: res.price, delta: res.delta, gamma: res.gamma };
  });

  const sigRange = Array.from({ length: 21 }, (_, i) => 0.05 + i * 0.02);
  const volData = sigRange.map((sig) => {
    const res = blackScholes({ ...params, sigma: sig });
    return { sigma: sig, price: res.price, vega: res.vega };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-400">Greeks & Risk Visualisation</h1>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
      <p className="text-gray-400">
        How the option value and its sensitivities respond to changes in the underlying, volatility, time and rates.
      </p>

      <div className="card grid grid-cols-2 md:grid-cols-5 gap-4">
        <label className="text-sm">S₀<input type="number" className="input mt-1" value={params.S0} onChange={(e) => update('S0', +e.target.value)} /></label>
        <label className="text-sm">K<input type="number" className="input mt-1" value={params.K} onChange={(e) => update('K', +e.target.value)} /></label>
        <label className="text-sm">T<input type="number" step="0.1" className="input mt-1" value={params.T} onChange={(e) => update('T', +e.target.value)} /></label>
        <label className="text-sm">r<input type="number" step="0.01" className="input mt-1" value={params.r} onChange={(e) => update('r', +e.target.value)} /></label>
        <label className="text-sm">σ<input type="number" step="0.01" className="input mt-1" value={params.sigma} onChange={(e) => update('sigma', +e.target.value)} /></label>
        <label className="text-sm">Type
          <select className="input mt-1" value={params.type} onChange={(e) => update('type', e.target.value as any)}>
            <option value="call">Call</option><option value="put">Put</option>
          </select>
        </label>
      </div>

      {bs.valid && (
        <>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card"><div className="text-xs text-gray-400">Price</div><div className="text-xl font-mono text-teal-400">{bs.price.toFixed(4)}</div></div>
            <div className="card"><div className="text-xs text-gray-400">Delta</div><div className="text-xl font-mono text-teal-400">{bs.delta.toFixed(4)}</div></div>
            <div className="card"><div className="text-xs text-gray-400">Gamma</div><div className="text-xl font-mono text-teal-400">{bs.gamma.toFixed(6)}</div></div>
            <div className="card"><div className="text-xs text-gray-400">Vega</div><div className="text-xl font-mono text-teal-400">{bs.vega.toFixed(4)}</div></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Price vs Spot</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={spotData}>
                  <CartesianGrid stroke="#1e3a5f" />
                  <XAxis dataKey="S" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
                  <Line type="monotone" dataKey="price" stroke="#2dd4bf" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Delta vs Spot (hedge ratio)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={spotData}>
                  <CartesianGrid stroke="#1e3a5f" />
                  <XAxis dataKey="S" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={params.type === 'call' ? [0, 1] : [-1, 0]} />
                  <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
                  <Line type="monotone" dataKey="delta" stroke="#22d3ee" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Gamma vs Spot</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={spotData}>
                  <CartesianGrid stroke="#1e3a5f" />
                  <XAxis dataKey="S" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
                  <Line type="monotone" dataKey="gamma" stroke="#fbbf24" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Price vs Volatility</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={volData}>
                  <CartesianGrid stroke="#1e3a5f" />
                  <XAxis dataKey="sigma" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
                  <Line type="monotone" dataKey="price" stroke="#14b8a6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card text-sm text-gray-300 space-y-2">
            <p><strong>Delta</strong> is the hedge ratio: the number of shares needed to neutralise directional exposure. A long call has positive delta; a long put has negative delta.</p>
            <p><strong>Gamma</strong> measures how fast delta changes. Long options have positive gamma (the hedge must be increased as the stock rises). Short options have negative gamma — the hedger is always “buying high and selling low” when rebalancing, which is costly when realised volatility is high.</p>
            <p>Example of positive gamma: long straddle. Example of negative gamma: short straddle or covered call (partially).</p>
          </div>
        </>
      )}
    </div>
  );
}
