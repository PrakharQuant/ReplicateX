import { useState } from 'react';
import { onePeriodReplication } from '../lib/finance';

export default function ArbitrageDetector() {
  const defaults = { S0: 100, Su: 120, Sd: 80, K: 100, r: 0.05, type: 'call' as 'call' | 'put', marketPrice: 12, capital: 1000 };
  const [params, setParams] = useState(defaults);
  const repl = onePeriodReplication(params);
  const theoretical = repl.C0;
  const market = params.marketPrice;

  const update = (key: string, value: any) => setParams((p) => ({ ...p, [key]: value }));
  const reset = () => setParams(defaults);

  const mispriced = Math.abs(market - theoretical) > 0.01;
  const overpriced = market > theoretical;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-400">Arbitrage Detector</h1>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
      <p className="text-gray-400">
        If the market price differs from the replication price, a risk-free profit exists under the model assumptions.
      </p>

      <div className="card grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="text-sm">S₀<input type="number" className="input mt-1" value={params.S0} onChange={(e) => update('S0', +e.target.value)} /></label>
        <label className="text-sm">S_u<input type="number" className="input mt-1" value={params.Su} onChange={(e) => update('Su', +e.target.value)} /></label>
        <label className="text-sm">S_d<input type="number" className="input mt-1" value={params.Sd} onChange={(e) => update('Sd', +e.target.value)} /></label>
        <label className="text-sm">K<input type="number" className="input mt-1" value={params.K} onChange={(e) => update('K', +e.target.value)} /></label>
        <label className="text-sm">r<input type="number" step="0.01" className="input mt-1" value={params.r} onChange={(e) => update('r', +e.target.value)} /></label>
        <label className="text-sm">Type
          <select className="input mt-1" value={params.type} onChange={(e) => update('type', e.target.value as any)}>
            <option value="call">Call</option><option value="put">Put</option>
          </select>
        </label>
        <label className="text-sm">Market Price<input type="number" step="0.01" className="input mt-1" value={params.marketPrice} onChange={(e) => update('marketPrice', +e.target.value)} /></label>
        <label className="text-sm">Initial Capital<input type="number" className="input mt-1" value={params.capital} onChange={(e) => update('capital', +e.target.value)} /></label>
      </div>

      {!repl.valid ? (
        <div className="card text-red-400">{repl.error}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-cyan-400 mb-3">Pricing Comparison</h2>
            <p>Theoretical (replication) price: <span className="text-teal-400 font-mono text-lg">{theoretical.toFixed(4)}</span></p>
            <p>Market price: <span className="text-teal-400 font-mono text-lg">{market.toFixed(4)}</span></p>
            <p className={`mt-2 font-semibold ${mispriced ? 'text-yellow-400' : 'text-green-400'}`}>
              {mispriced ? (overpriced ? 'Overpriced — sell the derivative' : 'Underpriced — buy the derivative') : 'Fairly priced (within 0.01)'}
            </p>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-cyan-400 mb-3">Arbitrage Strategy</h2>
            {mispriced ? (
              <div className="space-y-2 text-sm">
                <p>
                  {overpriced
                    ? `Sell the derivative at ${market.toFixed(2)} and buy the replicating portfolio (Δ = ${repl.delta.toFixed(4)}, B = ${repl.B.toFixed(2)}).`
                    : `Buy the derivative at ${market.toFixed(2)} and short the replicating portfolio.`}
                </p>
                <p>Initial cash flow: <span className="text-teal-400 font-mono">{(overpriced ? market - theoretical : theoretical - market).toFixed(4)}</span> per unit (locked-in profit)</p>
                <p className="text-gray-400">At maturity the derivative and portfolio cancel, leaving the initial profit grown at the risk-free rate. Net exposure is zero in both states.</p>
              </div>
            ) : (
              <p className="text-gray-400">No arbitrage under these assumptions.</p>
            )}
          </div>

          <div className="card md:col-span-2">
            <h2 className="text-lg font-semibold text-cyan-400 mb-3">Payoff Table (per unit)</h2>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="py-2">State</th>
                  <th>Stock</th>
                  <th>Derivative</th>
                  <th>Portfolio</th>
                  <th>Net (after trade)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-navy-700">
                  <td>Up</td>
                  <td>{params.Su}</td>
                  <td>{repl.Cu.toFixed(2)}</td>
                  <td>{repl.Cu.toFixed(2)}</td>
                  <td className="text-teal-400">0</td>
                </tr>
                <tr>
                  <td>Down</td>
                  <td>{params.Sd}</td>
                  <td>{repl.Cd.toFixed(2)}</td>
                  <td>{repl.Cd.toFixed(2)}</td>
                  <td className="text-teal-400">0</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-xs text-yellow-500">
              Warning: Transaction costs, bid-ask spreads, execution risk, funding constraints and model risk can eliminate or reverse practical arbitrage opportunities. This simulator assumes frictionless trading.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
