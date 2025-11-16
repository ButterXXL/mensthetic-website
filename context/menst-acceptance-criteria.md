# Mensthetic Acceptance Criteria

## Structural Requirements
- [ ] All sections exist with proper IDs and are tabbable:
  - `sec.menst-hero`
  - `sec.menst-services` (Hyaluronsäure, Lipolyse, Hormon-Analyse)
  - `sec.menst-before-after`
  - `sec.menst-method`
  - `sec.menst-pricing`
  - `sec.menst-team`
  - `sec.menst-reviews`
  - `sec.menst-faq`
  - `sec.menst-cta-booking`
  - `sec.menst-legal` (Impressum/Datenschutz)

## Performance & UX
- [ ] Booking CTA visible on first viewport (desktop & mobile)
- [ ] H1 ≤ 3 lines at 390×844 (mobile)
- [ ] No console errors; network errors handled gracefully
- [ ] LCP image preloaded; CLS < 0.1 (no layout jumps)
- [ ] Primary buttons: 44×44 min; focus ring visible
- [ ] Body contrast ≥ 7.0; UI elements ≥ 4.5

## Component Standards
- [ ] Before/After grid: consistent aspect ratio, tap-to-zoom optional
- [ ] All interactive elements use --menst-* design tokens
- [ ] Hover states provide clear feedback
- [ ] Loading states for async operations
- [ ] Error states with recovery options

## Mobile Responsiveness
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Readable text without zoom (16px minimum)
- [ ] Horizontal scrolling never required
- [ ] Navigation accessible with one thumb

## Brand Consistency
- [ ] Clinical, premium aesthetic maintained
- [ ] No flashy animations or gimmicks
- [ ] Consistent spacing using --menst-s-* tokens
- [ ] Typography follows brand guidelines