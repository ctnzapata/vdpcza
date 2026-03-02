# Design System: VDPCZA (Brutal Minimalist Glass)
**Project Info:** Rediseño Frontend Premium & Minimalista

## 1. Visual Theme & Atmosphere
- **Atmosphere:** "Cosmic Solitude." Deep, dark expanses punctuated by highly polished, glass-like elements. The interface uses generous negative space with soft, extremely diffused auras to guide the eye.
- **Aesthetic Philosophy:** Brutal Minimalism. We remove all unnecessary explicit borders, relying exclusively on high-contrast typography, pure padding, and pure shadows to define spatial areas. The UI should feel like solid chunks of frosted glass hovering in a pitch-black void.

## 2. Color Palette & Roles
- **Obsidian Void (Background)** (`#030303`): Serves as the infinite canvas that makes all light elements pop.
- **Cosmic Rose (Primary Accent)** (`rgb(244 63 94)` / `rose-500`): Used for primary interactions, key numeric indicators, and soft background glows (Auroras). Represents love and passion.
- **Starlight Indigo (Secondary Accent)** (`rgb(99 102 241)` / `indigo-500`): Used for complementary glows and secondary state highlights.
- **Pure White (Text & Highlights)** (`#FFFFFF`): Mapped across various opacities (`/100`, `/80`, `/40`, `/20`, `/0.02`) to create hierarchy without introducing new hues. Forms the basis of the brutal glass reflections.

## 3. Typography Rules
- **Display Font:** `Playfair Display` (Serif). Used for large, elegant quotes, main headings, and moments of high emotional impact. Usually italicized and rendered with pure white `text-white/90`.
- **System/Data Font:** `Outfit` (Sans-serif). Used structurally for numbers, interface text, labels, and micro-copy. 
- **Micro-Copy Treatment:** `text-[9px] uppercase tracking-[.4em] font-black`. Essential for the brutalist edge—highly spaced, tiny text used to balance massive, elegant typography.

## 4. Component Stylings
- **Glass Tiles (`glass-card`):** Pill-shaped or generously rounded (`rounded-[40px]`), utilizing intense backdrop blurs (`backdrop-blur-[40px]`) with barely perceptible backgrounds (`bg-white/[0.015]`). Borders are near-invisible (`border-none` or `ring-white/5`).
- **Pills/Buttons:** Fully rounded (`rounded-full`), completely borderless, using low-opacity whites (`bg-white/[0.03]`) that transition smoothly on hover. 
- **Icons & Controls:** Strokes are adjusted contextually. Active items gain a stroke increase and `drop-shadow` instead of a muddy background highlight. 

## 5. Layout Principles
- **Whitespace Strategy:** Extreme. Margins and paddings are doubled from standard UI frameworks (`p-10`, `space-y-16`) to let the few elements "breathe".
- **Shadows:** Deep, low, and wide (`0 30px 60px -10px rgba(0,0,0,0.5)`). They emphasize elevation rather than confinement.
- **Animation:** Fluid, easing-heavy transitions over raw speed (`transition-all duration-500`). Hover states physically lift the elements (`-translate-y-2`) to invite interaction.
