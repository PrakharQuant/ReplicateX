/**
 * ReplicateX Core Quantitative Finance Library
 * All calculations are pure functions for testability and browser execution.
 * Units: prices in currency units, rates as decimals (0.05 = 5%), time in years, vol as decimal.
 */

export interface OnePeriodParams {
  S0: number;
  Su: number;
  Sd: number;
  K: number;
  r: number; // period risk-free rate
  type: 'call' | 'put';
}

export interface OnePeriodResult {
  delta: number;
  B: number; // cash amount (positive = invest, negative = borrow)
  C0: number;
  Cu: number;
  Cd: number;
  valid: boolean;
  error?: string;
}

/**
 * One-period binomial replicating portfolio.
 * Δ = (Cu - Cd) / (Su - Sd)
 * B = (Cd - Δ * Sd) / (1 + r)
 * C0 = Δ * S0 + B
 */
export function onePeriodReplication(params: OnePeriodParams): OnePeriodResult {
  const { S0, Su, Sd, K, r, type } = params;

  if (Su <= Sd) {
    return { delta: 0, B: 0, C0: 0, Cu: 0, Cd: 0, valid: false, error: 'Su must be greater than Sd' };
  }
  if (r <= -1) {
    return { delta: 0, B: 0, C0: 0, Cu: 0, Cd: 0, valid: false, error: 'Risk-free rate must be > -1' };
  }

  const Cu = type === 'call' ? Math.max(Su - K, 0) : Math.max(K - Su, 0);
  const Cd = type === 'call' ? Math.max(Sd - K, 0) : Math.max(K - Sd, 0);

  const delta = (Cu - Cd) / (Su - Sd);
  const B = (Cd - delta * Sd) / (1 + r);
  const C0 = delta * S0 + B;

  return { delta, B, C0, Cu, Cd, valid: true };
}

export interface CRRParams {
  S0: number;
  K: number;
  T: number; // years
  sigma: number;
  r: number; // annual continuous or discrete? We'll use continuous compounding for R = exp(r Δt)
  n: number; // steps
  type: 'call' | 'put';
  style: 'european' | 'american';
}

export interface CRRResult {
  price: number;
  stockTree: number[][];
  optionTree: number[][];
  deltaTree: number[][];
  q: number;
  u: number;
  d: number;
  valid: boolean;
  error?: string;
  noArbOk: boolean;
}

/**
 * Cox-Ross-Rubinstein binomial tree with backward induction.
 * u = exp(σ √Δt), d = 1/u, R = exp(r Δt), q = (R - d)/(u - d)
 */
export function crrBinomial(params: CRRParams): CRRResult {
  const { S0, K, T, sigma, r, n, type, style } = params;

  if (n < 1 || !Number.isInteger(n)) {
    return emptyCRR('Number of steps must be a positive integer');
  }
  if (T <= 0 || sigma < 0 || S0 <= 0 || K <= 0) {
    return emptyCRR('Invalid parameters: S0, K, T > 0, sigma >= 0');
  }

  const dt = T / n;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const R = Math.exp(r * dt);
  const q = (R - d) / (u - d);

  const noArbOk = d < R && R < u && q > 0 && q < 1;

  // Build stock tree
  const stockTree: number[][] = [];
  for (let i = 0; i <= n; i++) {
    stockTree[i] = [];
    for (let j = 0; j <= i; j++) {
      stockTree[i][j] = S0 * Math.pow(u, j) * Math.pow(d, i - j);
    }
  }

  // Option tree - terminal payoffs
  const optionTree: number[][] = [];
  optionTree[n] = [];
  for (let j = 0; j <= n; j++) {
    const ST = stockTree[n][j];
    optionTree[n][j] = type === 'call' ? Math.max(ST - K, 0) : Math.max(K - ST, 0);
  }

  // Delta tree (at each node before maturity)
  const deltaTree: number[][] = [];

  // Backward induction
  for (let i = n - 1; i >= 0; i--) {
    optionTree[i] = [];
    deltaTree[i] = [];
    for (let j = 0; j <= i; j++) {
      const cont = (q * optionTree[i + 1][j + 1] + (1 - q) * optionTree[i + 1][j]) / R;
      let value = cont;
      if (style === 'american') {
        const ST = stockTree[i][j];
        const exercise = type === 'call' ? Math.max(ST - K, 0) : Math.max(K - ST, 0);
        value = Math.max(exercise, cont);
      }
      optionTree[i][j] = value;

      // Delta at this node
      const Su = stockTree[i + 1][j + 1];
      const Sd = stockTree[i + 1][j];
      const Cu = optionTree[i + 1][j + 1];
      const Cd = optionTree[i + 1][j];
      deltaTree[i][j] = Su !== Sd ? (Cu - Cd) / (Su - Sd) : 0;
    }
  }

  return {
    price: optionTree[0][0],
    stockTree,
    optionTree,
    deltaTree,
    q,
    u,
    d,
    valid: true,
    noArbOk,
  };
}

function emptyCRR(error: string): CRRResult {
  return {
    price: 0,
    stockTree: [],
    optionTree: [],
    deltaTree: [],
    q: 0,
    u: 1,
    d: 1,
    valid: false,
    error,
    noArbOk: false,
  };
}

/**
 * Standard normal CDF approximation (Abramowitz and Stegun)
 */
export function normCdf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.SQRT2;

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * y);
}

export interface BSParams {
  S0: number;
  K: number;
  T: number;
  r: number;
  sigma: number;
  type: 'call' | 'put';
}

export interface BSResult {
  price: number;
  delta: number;
  gamma: number;
  theta: number; // per year
  vega: number; // per 1% vol? we'll return per 1.0 vol, document it
  rho: number;
  d1: number;
  d2: number;
  valid: boolean;
  error?: string;
}

/**
 * Black-Scholes European option pricing and Greeks (non-dividend).
 * Continuous compounding.
 */
export function blackScholes(params: BSParams): BSResult {
  const { S0, K, T, r, sigma, type } = params;

  if (T <= 0 || sigma <= 0 || S0 <= 0 || K <= 0) {
    // Handle T=0 boundary
    if (T === 0) {
      const intrinsic = type === 'call' ? Math.max(S0 - K, 0) : Math.max(K - S0, 0);
      return {
        price: intrinsic,
        delta: type === 'call' ? (S0 > K ? 1 : 0) : (S0 < K ? -1 : 0),
        gamma: 0,
        theta: 0,
        vega: 0,
        rho: 0,
        d1: 0,
        d2: 0,
        valid: true,
      };
    }
    return {
      price: 0, delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0, d1: 0, d2: 0,
      valid: false, error: 'Invalid parameters',
    };
  }

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S0 / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const Nd1 = normCdf(d1);
  const Nd2 = normCdf(d2);
  const n_d1 = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI); // normal pdf

  let price: number;
  let delta: number;
  let rho: number;

  if (type === 'call') {
    price = S0 * Nd1 - K * Math.exp(-r * T) * Nd2;
    delta = Nd1;
    rho = K * T * Math.exp(-r * T) * Nd2;
  } else {
    price = K * Math.exp(-r * T) * normCdf(-d2) - S0 * normCdf(-d1);
    delta = Nd1 - 1;
    rho = -K * T * Math.exp(-r * T) * normCdf(-d2);
  }

  const gamma = n_d1 / (S0 * sigma * sqrtT);
  const vega = S0 * n_d1 * sqrtT; // per unit vol (1.0 = 100%)
  const theta = type === 'call'
    ? -S0 * n_d1 * sigma / (2 * sqrtT) - r * K * Math.exp(-r * T) * Nd2
    : -S0 * n_d1 * sigma / (2 * sqrtT) + r * K * Math.exp(-r * T) * normCdf(-d2);

  return { price, delta, gamma, theta, vega, rho, d1, d2, valid: true };
}

/**
 * Put-call parity check: C - P = S0 - K e^{-rT}
 */
export function putCallParity(S0: number, K: number, T: number, r: number, callPrice: number, putPrice: number): number {
  return callPrice - putPrice - (S0 - K * Math.exp(-r * T));
}

/**
 * Simulate a geometric Brownian motion path for hedging.
 */
export function simulateGBM(S0: number, r: number, sigma: number, T: number, n: number, seed?: number): number[] {
  // Simple LCG for deterministic seed if provided
  let s = seed ?? 12345;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  const path: number[] = [S0];
  const dt = T / n;
  for (let i = 0; i < n; i++) {
    const z = Math.sqrt(-2 * Math.log(rand())) * Math.cos(2 * Math.PI * rand()); // Box-Muller
    const St = path[path.length - 1];
    const next = St * Math.exp((r - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);
    path.push(next);
  }
  return path;
}
