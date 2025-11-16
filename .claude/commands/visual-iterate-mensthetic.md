title: "Mensthetic Visual Iterate"
description: "Open live app, capture screenshots/logs, compare vs brand spec, patch, re-verify."
run: |
  1) playwright.browser_navigate("https://app--mensthetic-1fba0955.base44.app/")
  2) playwright.browser_resize(1440,900); playwright.browser_take_screenshot("menst-desktop.png")
  3) playwright.browser_resize(768,1024); playwright.browser_take_screenshot("menst-tablet.png")
  4) playwright.browser_resize(390,844);  playwright.browser_take_screenshot("menst-mobile.png")
  5) playwright.browser_console_messages(); playwright.browser_network_requests()
  6) Compare vs ./context/menst-acceptance-criteria.md & ./context/menst-style-guide.md; propose minimal diffs; apply; re-run 1–5 to confirm

validation_steps:
  - Check all section IDs present (sec.menst-*)
  - Verify booking CTA visibility on first viewport
  - Validate H1 length ≤ 3 lines on mobile
  - Confirm no console errors
  - Test button minimum sizes (44×44px)
  - Verify color contrast ratios
  - Check before/after grid consistency
  - Validate focus indicators on all interactive elements

success_criteria:
  - All acceptance criteria pass
  - Design tokens implemented consistently
  - Mobile-first responsive design
  - Clinical, premium brand aesthetic maintained
  - Zero accessibility violations