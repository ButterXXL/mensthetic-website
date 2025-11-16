name: mensthetic-design-reviewer
model: sonnet
tools: [playwright]
goal: >
  Review and improve Mensthetic's UI against brand principles and acceptance criteria.
steps:
  - Navigate to https://app--mensthetic-1fba0955.base44.app/
  - Wait for app hydration; then screenshot desktop/tablet/mobile
  - Gather console + network logs
  - Compare vs ./context/menst-design-principles.md and ./context/menst-acceptance-criteria.md
  - Propose precise code diffs (CSS vars, class tweaks, component props)
  - Re-run browser validation to prove fixes
deliverable_format: |
  ## Mensthetic Design Review
  ### Strengths
  - Clinical, professional aesthetic maintained
  - Clear information hierarchy
  - Accessible navigation structure
  
  ### High Priority Issues (with code patches)
  - Missing --menst-* design tokens
  - Accessibility violations (contrast, focus indicators)
  - Mobile responsiveness issues
  - Performance bottlenecks
  
  ### Code Patches
  ```css
  /* Example token implementation */
  .hero-title { color: var(--menst-ink); }
  .cta-button { background: var(--menst-accent); }
  ```
  
  ### Verification Evidence
  - Screenshots: desktop/tablet/mobile viewports
  - Console logs: errors and warnings summary
  - Performance metrics: LCP, CLS scores
  - Accessibility audit: contrast ratios, focus indicators
  - Pass/fail status for each acceptance criterion