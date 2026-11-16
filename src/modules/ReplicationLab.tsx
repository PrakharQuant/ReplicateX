import { useState } from 'react';
import { onePeriodReplication } from '../lib/finance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReplicationLab() {
  const defaults = { S0: 100, Su: 120, Sd: 80, K: 100, r: 0.05, type: 'call' as 'call' | 'put' };
  const [params, setParams] = useState(defaults);
  const result = onePeriodReplication(params);

  const update = (key: string, value: any) => setParams((p) => ({ ...p, [key]: value }));
  const reset = () => setParams(defaults);

  const chartData = result.valid
    ? [
        { S: params.Sd, payoff: result.Cd },
        { S: params.Su, payoff: result.Cu },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-400">Replication Laboratory</h1>
        <button className="btn" onClick={reset}>Reset to Defaults</button>
      </div>
      <p className="text-gray-400">
        One-period binomial model. Construct a portfolio of the stock and risk-free bond that exactly matches the option payoff in both states.
      </p>

      <div className="card grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <label className="text-sm">S₀<input type="number" className="input mt-1" value={params.S0} onChange={(e) => update('S0', +e.target.value)} /></label>
        <label className="text-sm">S_u<input type="number" className="input mt-1" value={params.Su} onChange={(e) => update('Su', +e.target.value)} /></label>
        <label className="text-sm">S_d<input type="number" className="input mt-1" value={params.Sd} onChange={(e) => update('Sd', +e.target.value)} /></label>
        <label className="text-sm">K<input type="number" className="input mt-1" value={params.K} onChange={(e) => update('K', +e.target.value)} /></label>
        <label className="text-sm">r (period)<input type="number" step="0.01" className="input mt-1" value={params.r} onChange={(e) => update('r', +e.target.value)} /></label>
        <label className="text-sm">Type
          <select className="input mt-1" value={params.type} onChange={(e) => update('type', e.target.value as any)}>
            <option value="call">Call</option>
            <option value="put">Put</option>
          </select>
        </label>
      </div>

      {!result.valid ? (
        <div className="card text-red-400">{result.error}</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card space-y-3">
              <h2 className="text-lg font-semibold text-cyan-400">Results</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>Δ (shares): <span className="text-teal-400 font-mono">{result.delta.toFixed(6)}</span></div>
                <div>B (cash): <span className="text-teal-400 font-mono">{result.B.toFixed(6)}</span></div>
                <div>C₀: <span className="text-teal-400 font-mono text-lg">{result.C0.toFixed(4)}</span></div>
                <div>C_u: {result.Cu.toFixed(2)}</div>
                <div>C_d: {result.Cd.toFixed(2)}</div>
              </div>
              <div className="pt-3 border-t border-navy-700 text-sm space-y-2">
                <p><strong>Plain English:</strong> Buy {result.delta.toFixed(4)} shares and {result.B < 0 ? 'borrow' : 'invest'} {Math.abs(result.B).toFixed(2)} in the risk-free asset. This portfolio costs exactly {result.C0.toFixed(4)} today and matches the option payoff perfectly tomorrow.</p>
                <p className="font-mono text-xs text-gray-400">
                  Δ = (C_u − C_d)/(S_u − S_d) = {result.delta.toFixed(6)}
                </p>
                <p className="font-mono text-xs text-gray-400">
                  B = (C_d − Δ S_d) / (1+r) = {result.B.toFixed(6)}
                </p>
                <p className="font-mono text-xs text-gray-400">
                  C₀ = Δ S₀ + B = {result.C0.toFixed(4)}
                </p>
              </div>
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold text-cyan-400 mb-2">Payoff Comparison</h2>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1e3a5f" />
                  <XAxis dataKey="S" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: '#0f1f3a', border: '1px solid #152a4a' }} />
                  <Line type="monotone" dataKey="payoff" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 6 }} name="Option / Portfolio" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 text-center">The two curves coincide exactly at the two possible terminal stock prices.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
