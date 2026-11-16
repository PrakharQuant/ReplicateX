export default function Foundations() {
  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-teal-400">Mathematical Foundations</h1>
      <p className="text-gray-400">
        The core ideas that make no-arbitrage pricing possible. Each concept is stated formally, explained intuitively, illustrated numerically, and placed in the context of derivatives pricing.
      </p>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">1. Law of One Price</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> If two portfolios deliver identical cash flows in every state of the world, they must have the same price today; otherwise an arbitrage exists.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Intuitive:</strong> You cannot have two different prices for the same thing in a frictionless market. Someone would buy the cheap one and sell the expensive one.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Example:</strong> In the one-period lab, the replicating portfolio of Δ shares and B cash produces exactly the same payoffs as the option, therefore the option price equals the portfolio cost.
        </p>
        <p className="text-sm text-gray-400">Role: This is the foundation of all relative pricing. We do not need absolute utility or risk aversion; we only need the prices of the replicating instruments.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">2. No-Arbitrage Principle</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> There exists no portfolio with non-positive initial cost, non-negative terminal value in every state, and strictly positive value in at least one state (or a positive probability of positive value with no chance of loss).
        </p>
        <p className="text-sm text-gray-300">
          <strong>Intuitive:</strong> Free lunches are not available. If a strategy makes money with no risk and no investment, the market cannot be in equilibrium.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Numerical:</strong> If a call is trading at 15 while the replicating portfolio costs 11.90, sell the call, buy the portfolio, pocket 3.10 today, and have zero net cash flow at maturity.
        </p>
        <p className="text-sm text-gray-400">Role: It pins down unique prices for redundant securities. It also implies the existence of a risk-neutral measure.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">3. Replicating Portfolios</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> A portfolio (Δ, B) of the underlying and the risk-free asset such that Δ S_u + B(1+r) = C_u and Δ S_d + B(1+r) = C_d.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Intuitive:</strong> We synthesise the derivative by trading the underlying and borrowing/lending. The derivative is redundant.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Example:</strong> Classic numbers give Δ = 0.5, B ≈ −38.10 for the call.
        </p>
        <p className="text-sm text-gray-400">Role: Direct construction of the price and the hedge. In multi-period models the portfolio is rebalanced dynamically.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">4. Risk-Neutral Valuation</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> The price is the discounted expected payoff under the unique probability measure Q that makes the discounted asset price a martingale: C₀ = e^{-rT} E^Q[payoff].
        </p>
        <p className="text-sm text-gray-300">
          <strong>Intuitive:</strong> Because the hedge eliminates risk, we can pretend all investors are risk-neutral and simply discount the expected payoff at the risk-free rate. The physical probabilities never appear.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Important:</strong> Risk-neutral probabilities are not real-world probabilities. They are the probabilities that make pricing consistent with no arbitrage.
        </p>
        <p className="text-sm text-gray-400">Role: Computational convenience. In the binomial model q = (R − d)/(u − d) is exactly this measure.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">5. Binomial Option Pricing</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> Discrete-time multiplicative tree. At each step the stock moves to uS or dS. Backward induction: V = [q V_u + (1−q) V_d]/R, with early-exercise check for American options.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Intuitive:</strong> A simple discrete approximation to continuous price paths that still permits exact replication at every node.
        </p>
        <p className="text-sm text-gray-400">Role: Pedagogical and numerical workhorse. Converges to Black–Scholes as the number of steps grows.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">6. Dynamic Hedging</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> Continuously (or frequently) adjusting the stock holding to equal the option’s delta so that the portfolio remains instantaneously riskless.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Intuitive:</strong> You cannot hedge once and forget; the required number of shares changes as the stock moves and time passes.
        </p>
        <p className="text-sm text-gray-400">Role: Makes the continuous-time replication argument work. Discrete hedging leaves residual gamma risk.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">7. Black–Scholes Model</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> Stock follows dS = μ S dt + σ S dW. The option price satisfies the Black–Scholes PDE, whose solution is the familiar formula involving the cumulative normal distribution.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Assumptions:</strong> Constant σ, constant r, no dividends, continuous trading, no transaction costs, European exercise, lognormal returns.
        </p>
        <p className="text-sm text-gray-400">Role: The continuous-time limit of the binomial model and the industry standard for European vanilla options.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">8. Completeness of Financial Markets</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> A market is complete if every contingent claim can be replicated by a dynamic portfolio of the traded assets. In the Black–Scholes and binomial models the market is complete (one source of randomness, one risky asset).
        </p>
        <p className="text-sm text-gray-300">
          <strong>Limitation:</strong> Real markets are incomplete (jumps, stochastic volatility, liquidity constraints). Incomplete markets admit a range of no-arbitrage prices rather than a unique price.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-xl font-semibold text-cyan-400">9. Delta–Gamma Relationship</h2>
        <p className="text-sm text-gray-300">
          <strong>Formal:</strong> Gamma = ∂Δ/∂S = ∂²V/∂S². For a European call, gamma is positive and peaks near the strike.
        </p>
        <p className="text-sm text-gray-300">
          <strong>Intuitive:</strong> Delta tells you the hedge today; gamma tells you how quickly that hedge becomes wrong. High gamma means frequent rebalancing is necessary.
        </p>
        <p className="text-sm text-gray-400">Role: Explains the residual error in discrete hedging and the profitability of long-volatility positions when realised moves are large.</p>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold text-cyan-400 mb-2">Assumptions and Limitations of Replication</h2>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
          <li>Frictionless markets: no transaction costs, no bid-ask spreads, unlimited borrowing and short selling.</li>
          <li>Continuous rebalancing is possible (or discrete rebalancing is frequent enough).</li>
          <li>The model is correctly specified (volatility is known and constant, no jumps).</li>
          <li>The market is complete.</li>
          <li>Counterparty risk is zero.</li>
          <li>In practice these idealisations fail, so the theoretical price is a benchmark, not a guaranteed executable value.</li>
        </ul>
      </section>
    </div>
  );
}
