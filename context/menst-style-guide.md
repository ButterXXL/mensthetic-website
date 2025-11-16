# Mensthetic Style Guide (live-mapped)

## Design Token Usage
- **Colors**: use tokens `--menst-*` (see extracted palette)
- **Typography**: Headings bold, tight tracking; Body 16/26
- **Buttons**: `.btn--menst-primary` (accent bg, white text, r=lg)
- **Cards**: `.card--menst` (white, shadow-1, r=lg)
- **Chips**: neutral bg, subtle border, rounded-full

## Component Mapping
### Buttons
- **Primary CTA**: `.btn--menst-primary` - Main actions, booking
- **Secondary**: `.btn--menst-quiet` - Support actions, navigation

### Content Structure
- **Service Cards**: `.card--menst` - Treatment descriptions
- **Before/After**: Grid with consistent aspect ratios
- **Team Cards**: `.card--menst` with professional imagery

### Forms
- **Inputs**: `.input--menst` - Contact forms, booking
- **Labels**: Clear, accessible, positioned above inputs
- **Validation**: Inline feedback with --menst-danger for errors

### Navigation
- **Main Nav**: Clean, minimal, desktop horizontal
- **Mobile Nav**: Hamburger → overlay with large touch targets
- **Footer**: Organized sections, legal links prominent

## Typography Scale
- **H1**: 2.5rem/1.2 (desktop), 2rem/1.2 (mobile)
- **H2**: 2rem/1.3
- **H3**: 1.5rem/1.4
- **Body**: 1rem/1.6
- **Small**: 0.875rem/1.5

## Responsive Breakpoints
- Mobile: 390px - 767px
- Tablet: 768px - 1199px
- Desktop: 1200px+