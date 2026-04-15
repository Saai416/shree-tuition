# Design Brief

## Purpose & Context
Premium single-page landing for Shree Tuition for Mathematics — builds trust with parents/students through visual-first storytelling, strong results, and sticky conversion flow.

## Tone & Aesthetic
Bold, confident, approachable. Premium modern education: trustworthy authority (deep navy), energetic progress (electric cyan), clean asymmetrical layouts, subtle motion discipline.

## Color Palette

| Token | OKLCH | Usage |
|-------|-------|-------|
| Primary | 0.32 0.18 265 | Trust, authority, headers, primary CTAs |
| Accent | 0.65 0.16 200 | Highlights, WhatsApp button, active states |
| Secondary | 0.48 0.08 260 | Supporting text, borders, secondary actions |
| Background | 0.98 0.01 270 | Page background, card bases |
| Muted | 0.93 0.02 268 | Section alternation, subtle divisions |
| Foreground | 0.22 0.06 265 | Body text, primary reading |

## Typography
- **Display**: General Sans (geometric, bold, modern—headlines, hero text)
- **Body**: Satoshi (clean, professional, highly readable—copy, body text)
- **Mono**: Geist Mono (technical elements, backlogs)

## Elevation & Depth
- **Cards**: Glassmorphic treatment—`bg-white/30` + `backdrop-blur-md` + soft border for premium depth
- **Shadows**: `shadow-subtle` (2px/8px, 0.08 opacity) for ambient depth; `shadow-elevated` (8px/24px, 0.12 opacity) for raised cards
- **Zones**: Header on white with subtle bottom border; sections alternate `bg-background` and `bg-muted/10`; footer on primary with white text

## Structural Zones

| Zone | Surface Treatment |
|------|---|
| Header/Nav | bg-white, border-b border-border, sticky positioning |
| Hero | Full-width image container with navy overlay gradient, headline + subtext overlay, CTA buttons |
| Trust Strip | bg-muted/10, icon+text pairs, horizontal rhythm |
| Split Sections | Left image (asymmetrical), right text minimal—alternating directions |
| Testimonial Cards | glassmorphic, soft shadows, star badges, minimal text |
| Gallery | Masonry/asymmetrical grid, hover zoom effect on images |
| CTA Sections | bg-primary or gradient, white text, overlay on images |
| Contact | Clean layout, map embed, minimal borders |
| Footer | bg-primary, white foreground, minimal content |

## Spacing & Rhythm
- **Base unit**: 0.75rem radius, 16px padding increments
- **Section spacing**: 4rem vertical, 2rem horizontal on mobile; 6rem vertical, 3rem horizontal on desktop
- **Density**: Cards packed tightly (12px gaps); sections breathed (white space intentional)

## Component Patterns
- **Buttons**: Rounded-lg, secondary hover state with subtle lift (shadow elevation)
- **Icons**: lucide-react, primary or accent colored, 24px–32px
- **Input fields**: bg-input, subtle border, ring on focus (accent color)
- **Badges**: Pill-shaped, minimal padding, accent text on muted background

## Motion
- **Fade-in-up**: 0.6s ease-out on scroll-into-view for sections (respect motion preferences)
- **Pulse-subtle**: 2s infinite on WhatsApp sticky button—gentle attention without harshness
- **Hover zoom**: 1.1x scale on gallery images, smooth transition
- **Micro-hover**: Button shadow elevation + opacity shift on hover

## Constraints
- **No excessive gradients**: Gradients only on hero background, button hover, and accent text—never throughout copy
- **No bouncy animations**: Cubic-bezier easing only, no cubic-bezier bounce
- **No gimmicky effects**: Glassmorphism is subtle (30% opacity, soft blur); no neon glows
- **Mobile-first**: Responsive scales, sticky CTA visible on all viewports

## Signature Detail
**Asymmetrical split sections** with image on left/right alternating; **sticky glassmorphic WhatsApp button** with pulse animation; **masonry gallery with hover zoom**—these create distinction without noise. Every interaction fades/slides in smoothly, never jarring.

## Dark Mode
Optional; light mode is primary. If implemented, adjust card opacity to `bg-white/10`, increase shadow darkness, maintain accent brightness.
