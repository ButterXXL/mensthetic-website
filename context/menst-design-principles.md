# Mensthetic Design Principles

## Brand Intent
- Masculine, minimal, clinical confidence (no gimmicks)
- High contrast, generous whitespace, clear hierarchy
- Motion subtle (--menst-motion), never "flashy"
- A11y-first: labels, focus-visible, target ≥ 44×44

## Visual Language
- **Colors**: Use --menst-* token system exclusively
- **Typography**: Headings bold with tight tracking; Body 16/26 line-height
- **Spacing**: Generous whitespace using --menst-s-* scale
- **Motion**: Subtle, purposeful transitions using --menst-motion-*
- **Shadows**: Minimal, elegant using --menst-shadow-*

## Component Hierarchy
1. **Primary Actions**: .btn--menst-primary (accent background)
2. **Secondary Actions**: .btn--menst-quiet (outline style)
3. **Content Cards**: .card--menst (elevated, clean)
4. **Tags/Labels**: .chip--menst (subtle, rounded)
5. **Form Inputs**: .input--menst (focused, accessible)

## Accessibility Requirements
- Focus indicators always visible
- Minimum touch targets 44×44px
- Color contrast ratios: Body text ≥7.0, UI elements ≥4.5
- Semantic HTML structure
- Screen reader friendly labels