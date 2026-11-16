import { describe, it, expect } from 'vitest';
import {
  onePeriodReplication,
  crrBinomial,
  blackScholes,
  putCallParity,
  normCdf,
} from '../lib/finance';

describe('One-period Replication', () => {
  it('prices ATM call correctly with classic numbers', () => {
    const res = onePeriodReplication({
      S0: 100, Su: 120, Sd: 80, K: 100, r: 0.05, type: 'call',
    });
    expect(res.valid).toBe(true);
    // Cu = 20, Cd = 0
    // delta = 20/40 = 0.5
    // B = (0 - 0.5*80)/1.05 = -40/1.05 ≈ -38.0952
    // C0 = 0.5*100 - 38.0952 ≈ 11.9048
    expect(res.delta).toBeCloseTo(0.5, 6);
    expect(res.B).toBeCloseTo(-40 / 1.05, 6);
    expect(res.C0).toBeCloseTo(100 * 0.5 - 40 / 1.05, 4);
    expect(res.Cu).toBe(20);
    expect(res.Cd).toBe(0);
  });

  it('replicates put payoff', () => {
    const res = onePeriodReplication({
      S0: 100, Su: 120, Sd: 80, K: 100, r: 0.05, type: 'put',
    });
    // Pu = 0, Pd = 20
    // delta = (0-20)/40 = -0.5
    // B = (20 - (-0.5)*80)/1.05 = (20+40)/1.05 = 60/1.05
    expect(res.delta).toBeCloseTo(-0.5, 6);
    expect(res.C0).toBeGreaterThan(0);
  });

  it('rejects Su <= Sd', () => {
    const res = onePeriodReplication({
      S0: 100, Su: 80, Sd: 90, K: 100, r: 0.05, type: 'call',
    });
    expect(res.valid).toBe(false);
  });
});

describe('CRR Binomial', () => {
  it('one-step matches one-period formula', () => {
    const res = crrBinomial({
      S0: 100, K: 100, T: 1, sigma: Math.log(1.2), r: Math.log(1.05), n: 1,
      type: 'call', style: 'european',
    });
    expect(res.valid).toBe(true);
    expect(res.price).toBeGreaterThan(0);
    // Continuous compounding gives a slightly different value from discrete one-period
    expect(res.price).toBeCloseTo(11.25, 1);
  });

  it('increases price with more steps toward BS', () => {
    const low = crrBinomial({
      S0: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, n: 1,
      type: 'call', style: 'european',
    });
    const high = crrBinomial({
      S0: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, n: 50,
      type: 'call', style: 'european',
    });
    expect(high.price).toBeGreaterThan(0);
    expect(Math.abs(high.price - low.price)).toBeLessThan(5);
  });

  it('American put >= European put', () => {
    const eu = crrBinomial({
      S0: 100, K: 100, T: 1, sigma: 0.3, r: 0.05, n: 10,
      type: 'put', style: 'european',
    });
    const am = crrBinomial({
      S0: 100, K: 100, T: 1, sigma: 0.3, r: 0.05, n: 10,
      type: 'put', style: 'american',
    });
    expect(am.price).toBeGreaterThanOrEqual(eu.price - 1e-8);
  });

  it('checks no-arbitrage condition', () => {
    const res = crrBinomial({
      S0: 100, K: 100, T: 1, sigma: 0.2, r: 0.05, n: 5,
      type: 'call', style: 'european',
    });
    expect(res.noArbOk).toBe(true);
  });
});

describe('Black-Scholes', () => {
  it('computes known ATM call price approximately', () => {
    // S=100, K=100, T=1, r=0.05, sigma=0.2
    // Approximate BS call ~ 10.45
    const res = blackScholes({ S0: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, type: 'call' });
    expect(res.valid).toBe(true);
    expect(res.price).toBeCloseTo(10.4506, 2);
    expect(res.delta).toBeCloseTo(0.6368, 2);
  });

  it('satisfies put-call parity', () => {
    const call = blackScholes({ S0: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, type: 'call' });
    const put = blackScholes({ S0: 100, K: 100, T: 1, r: 0.05, sigma: 0.2, type: 'put' });
    const parity = putCallParity(100, 100, 1, 0.05, call.price, put.price);
    expect(Math.abs(parity)).toBeLessThan(1e-6);
  });

  it('handles T=0 boundary', () => {
    const res = blackScholes({ S0: 110, K: 100, T: 0, r: 0.05, sigma: 0.2, type: 'call' });
    expect(res.price).toBe(10);
    expect(res.delta).toBe(1);
  });

  it('normal CDF is accurate at 0', () => {
    expect(normCdf(0)).toBeCloseTo(0.5, 4);
  });
});
