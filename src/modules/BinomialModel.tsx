import { useState, useMemo } from 'react';
import { crrBinomial } from '../lib/finance';

export default function BinomialModel() {
  const defaults = {
    S0: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, n: 5,
    type: 'call' as 'call' | 'put', style: 'european' as 'european' | 'american',
  };
  const [params, setParams] = useState(defaults);
  const result = useMemo(() => crrBinomial(params), [params]);

  const update = (key: string, value: any) => setParams((p) => ({ ...p, [key]: value }));
  const reset = () => setParams(defaults);

  // For visualization of small trees
  const showTree = params.n <= 6;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-400">Cox–Ross–Rubinstein Binomial Model</h1>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
      <p className="text-gray-400">
        Multi-period recombining tree. Backward induction yields the no-arbitrage price. American style compares exercise vs continuation at every node.
      </p>

      <div className="card grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <label className="text-sm">S₀<input type="number" className="input mt-1" value={params.S0} onChange={(e) => update('S0', +e.target.value)} /></label>
        <label className="text-sm">K<input type="number" className="input mt-1" value={params.K} onChange={(e) => update('K', +e.target.value)} /></label>
        <label className="text-sm">T (years)<input type="number" step="0.1" className="input mt-1" value={params.T} onChange={(e) => update('T', +e.target.value)} /></label>
        <label className="text-sm">σ<input type="number" step="0.01" className="input mt-1" value={params.sigma} onChange={(e) => update('sigma', +e.target.value)} /></label>
        <label className="text-sm">r<input type="number" step="0.01" className="input mt-1" value={params.r} onChange={(e) => update('r', +e.target.value)} /></label>
        <label className="text-sm">Steps n<input type="number" min={1} max={100} className="input mt-1" value={params.n} onChange={(e) => update('n', Math.max(1, Math.min(100, +e.target.value)))} /></label>
        <label className="text-sm">Type
          <select className="input mt-1" value={params.type} onChange={(e) => update('type', e.target.value as any)}>
            <option value="call">Call</option><option value="put">Put</option>
          </select>
        </label>
        <label className="text-sm">Style
          <select className="input mt-1" value={params.style} onChange={(e) => update('style', e.target.value as any)}>
            <option value="european">European</option><option value="american">American</option>
          </select>
        </label>
      </div>

      {!result.valid ? (
        <div className="card text-red-400">{result.error}</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-sm text-gray-400">Option Price</div>
              <div className="text-3xl font-mono text-teal-400">{result.price.toFixed(4)}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-400">Risk-neutral q</div>
              <div className="text-2xl font-mono text-cyan-400">{result.q.toFixed(4)}</div>
              <div className="text-xs text-gray-500">u = {result.u.toFixed(4)}, d = {result.d.toFixed(4)}</div>
            </div>
            <div className="card">
              <div className="text-sm text-gray-400">No-Arbitrage Check</div>
              <div className={`text-xl font-semibold ${result.noArbOk ? 'text-green-400' : 'text-red-400'}`}>
                {result.noArbOk ? 'd < R < u ✓' : 'Violated'}
              </div>
            </div>
          </div>

          {showTree && result.stockTree.length > 0 && (
            <div className="card overflow-x-auto">
              <h2 className="text-lg font-semibold text-cyan-400 mb-3">Stock Price Tree (small n)</h2>
              <div className="text-xs font-mono space-y-1">
                {result.stockTree.map((level, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-8 text-gray-500">t={i}</span>
                    {level.map((s, j) => (
                      <span key={j} className="text-teal-300">{s.toFixed(2)}</span>
                    ))}
                  </div>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-cyan-400 mt-4 mb-3">Option Value Tree</h2>
              <div className="text-xs font-mono space-y-1">
                {result.optionTree.map((level, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-8 text-gray-500">t={i}</span>
                    {level.map((v, j) => (
                      <span key={j} className="text-cyan-300">{v.toFixed(2)}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showTree && (
            <div className="card text-gray-400 text-sm">
              Tree visualization limited to n ≤ 6 for readability. Increase n to see convergence; the price is still computed exactly.
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-semibold text-cyan-400 mb-2">Risk-Neutral vs Physical Probabilities</h2>
            <p className="text-sm text-gray-300">
              The probability q = (R − d)/(u − d) is the unique probability that makes the discounted stock a martingale. It is not the real-world probability of an up move. Pricing uses risk-neutral expectations because the hedge portfolio eliminates risk; the physical drift does not appear in the price.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
