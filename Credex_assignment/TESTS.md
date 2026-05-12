# TESTS.md

## Automated Tests

### Audit Engine Logic
- **Filename**: `src/lib/audit-engine.test.ts`
- **What it covers**:
  1. **Cursor Downgrade**: Verifies Business -> Pro recommendation for teams with < 3 seats.
  2. **ChatGPT Optimization**: Verifies Plus -> Team recommendation for teams with 5+ seats.
  3. **Credex Opportunities**: Verifies that high spend (> $500/mo) triggers the Credex credit recommendation.
  4. **Claude Right-sizing**: Verifies Team -> Pro recommendation for teams with < 5 seats.
  5. **Savings Calculation**: Verifies that total monthly and annual savings are mathematically correct.
  6. **Optimal Spend Detection**: Verifies that `isOptimal` is `true` when total savings < $100 ("You're spending well" case).
  7. **Alternative Tool Suggestion**: Verifies that a cheaper alternative tool is surfaced when the current plan is already optimal and use case matches.

### How to Run Tests
```bash
npm test
```
The tests are run using Jest and are integrated into the GitHub Actions CI pipeline.
