# METRICS.md

## North Star Metric
**Total Potential Savings Surfaced (TPSS)**.
- **Why**: This is the "Aha!" moment for the user and the primary driver for Credex. If we aren't surfacing significant savings, we aren't providing value.

## Input Metrics
1. **Audit Completion Rate**: % of users who land and finish the form. (Indicates form friction/UX quality).
2. **Email Capture Rate**: % of users who provide an email after seeing results. (Indicates trust and value perception).
3. **Viral K-Factor**: Number of new audits generated per shared URL. (Indicates organic growth potential).

## First Instrumentation
- **Segment/PostHog**: Track `Form Started`, `Tool Added`, `Audit Generated`, and `Lead Captured`.
- **Conversion Funnel**: Visualize where users drop off in the multi-step form.

## Pivot Decision Trigger
If the **Conversion from Audit -> Consultation** stays below 1% for 1,000 completed audits, we pivot the value proposition. It means either:
- The savings aren't "painful" enough to move the needle.
- The Credex credit offer is confusing or untrusted.
- The target user is too small (e.g., hobbyists instead of startups).
