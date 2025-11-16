## Plan & Review

### Before starting work
- Always in plan mode to make a plan
- After get the plan, make sure you Write the plan to claude/tasks/TASK_NAME.md.
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task require external knowledge or certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing
- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

# Mensthetic Visual Rules

- Always validate UI changes against ./context/menst-acceptance-criteria.md and ./context/menst-style-guide.md.
- Use Playwright MCP to open and test:
  URL: https://app--mensthetic-1fba0955.base44.app/
  Viewports: 1440×900, 768×1024, 390×844
  Steps: screenshot each, collect console+network logs, compare vs criteria, propose minimal diffs, apply, re-verify.
- Do not add libraries without asking; keep brand tone clinical, premium, discreet.
- All components must use --menst-* design tokens
- Focus on masculine, minimal, clinical confidence aesthetic
- Ensure accessibility standards are met (contrast, focus indicators, semantic markup)

## Web Animation Guidelines

### Before implementing animations
- Consult The Complete Developer's Guide to Modern Web Animation (MD at /Users/felixaudu/Downloads/The Complete Developer's Guide to Modern Web Animation (1).md)
- Follow Mensthetic's clinical, premium aesthetic - avoid flashy or gimmicky animations
- Ensure animations enhance UX rather than distract
- Test performance impact on mobile devices
- Verify animations respect user's motion preferences (prefers-reduced-motion)

### Performance Standards (per guide)
- Target 60 FPS (16.67ms per frame budget)
- Only animate `transform` and `opacity` for best performance
- Avoid layout-triggering properties (width, height, top, left, padding, margin)
- Use `will-change` property before animation starts, remove after completion
- Force GPU layers with `transform: translateZ(0)` when needed

### Technology Selection Framework
- **Simple transitions**: CSS Transitions/Animations
- **Complex sequences**: GSAP (robust) or Anime.js (lightweight)  
- **Performance critical + modern browsers**: Web Animations API (WAAPI)
- **Legacy browser support**: GSAP
- **Bundle size critical**: CSS or Anime.js

### Accessibility Requirements
- Always respect `prefers-reduced-motion: reduce`
- Provide alternative feedback for reduced motion (text, focus indicators)
- Maintain focus management during animations
- Use `animation-duration: 0.01ms !important` for reduced motion fallback

### 2025 Animation Trends (suitable for Mensthetic)
- **Enhanced hover effects**: Multi-layer, physics-based interactions (clinical feel)
- **Micro-interactions**: Subtle feedback animations that inject personality
- **Performance optimization**: Off-Main-Thread Animation (OMTA)
- **Progressive enhancement**: Feature detection with CSS fallbacks

### Mensthetic-Specific Guidelines
- Favor subtle, professional animations over flashy effects
- Use easing functions like `cubic-bezier(0.4, 0, 0.2, 1)` for smooth, clinical feel
- Implement scroll-driven animations for modern browsers with Intersection Observer fallbacks
- Keep animation durations short: micro-interactions (100-300ms), UI transitions (200-500ms)