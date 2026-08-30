---
name: The Archives of Arda
description: High Fantasy Middle-Earth illuminated codex and royal project ledger
colors:
  bg-deep: "#0e110f"
  bg-surface: "#171c18"
  bg-panel: "#1e241f"
  bg-card: "#242c26"
  bg-card-hover: "#2c362f"
  bg-parchment: "#f2e8d5"
  gold-primary: "#c5a059"
  gold-bright: "#dfba6d"
  gold-dark: "#8c6f38"
  gold-muted: "#5e4c27"
  text-gold: "#e2c275"
  text-parchment: "#ede4d1"
  text-muted: "#a39b89"
  text-faint: "#6e6758"
  seal-red: "#8f291e"
  seal-green: "#2d5a37"
  seal-amber: "#6e4e1a"
  iron-border: "#2e3831"
typography:
  display:
    fontFamily: "'Cinzel Decorative', 'Cinzel', Georgia, serif"
    fontSize: "clamp(1.8rem, 3.4vw, 2.75rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "0.06em"
  headline:
    fontFamily: "'Cinzel', Georgia, serif"
    fontSize: "1.18rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.03em"
  body:
    fontFamily: "'Spectral', 'EB Garamond', Georgia, serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.02em"
  label:
    fontFamily: "'Cinzel', Georgia, serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.gold-primary}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  card-chronicle:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-parchment}"
    rounded: "{rounded.sm}"
    padding: "18px 20px"
---

# Design System: The Archives of Arda

## Overview

**Creative North Star: "The Royal Cartographer's Illuminated Codex"**

A high-fantasy, Middle-earth-inspired visual system built on the physical aesthetics of illuminated manuscripts, ancient tomes, and elven craft. Generic modern cards, gradient overlays, and neon badges are completely banned in favor of deep earth pigments (Mirkwood slate `#0e110f`, chiseled stone `#1e241f`), antique gold leaf (`#c5a059`), and solid wax seal accents.

**Key Characteristics:**
- Zero gradients: pure solid pigments, authentic metallic foil tones, and deep wood/slate contrast.
- Single-viewport hero composition: locked to `100vh` / `100dvh` with an illuminated outer frame.
- Celtic & Gondorian filigree corner knots, White Tree heraldry, and runic cartography emblems.
- High-contrast serif typography pairing majestic display capitals (`Cinzel Decorative`, `Cinzel`) with legible book text (`Spectral`, `EB Garamond`).

## Colors

The palette is composed of solid earth, slate, and antique metal pigments with zero digital gradients.

### Primary
- **Antique Elven Gold** (`#c5a059`): Primary filigree, borders, active states, and focal accents.
- **Sun of Valinor Gold** (`#dfba6d`): High-salience illuminated titles and active text.

### Neutral
- **Deep Mirkwood Night** (`#0e110f`): Core background canvas and document ground.
- **Dark Woodland Slate** (`#171c18`): Raised surfaces and codex ledger container.
- **Chiseled Stone** (`#1e241f`): Inner controls, seals, and sub-panels.
- **Deep Forest Leather** (`#242c26`): Chronicle project cards.
- **Pale Vellum Inscription** (`#ede4d1`): Primary body text and descriptive lore.
- **Faded Ink / Runic Grey** (`#a39b89`): Secondary metadata, subtitles, and rune tags.

### Named Rules
**The Zero-Gradient Doctrine.** No linear, radial, or conic gradients may ever appear. Contrast and atmosphere are achieved through physical pigment hierarchy and solid gold leaf inlays.

## Typography

**Display Font:** `Cinzel Decorative`, `Cinzel`, Georgia, serif
**Body Font:** `Spectral`, `EB Garamond`, Georgia, serif
**Uncial/Runic Font:** `Uncial Antiqua`, `MedievalSharp`

### Hierarchy
- **Display** (900, `clamp(1.8rem, 3.4vw, 2.75rem)`, 1.15): Sovereign hero titles and realm proclamations.
- **Headline** (700, `1.18rem`, 1.3): Chronicle tome titles with gold highlight.
- **Body** (400, `0.92rem`, 1.45): Parchment descriptions and lore summaries.
- **Label / Runic** (600, `0.78rem`, `0.06em` tracking, uppercase): Filter tabs, seal actions, and colophon notes.

## Layout

Single-viewport architecture (`100vh` / `100dvh`, `overflow: hidden`) framed by an outer double rule with 4 corner filigree knots. Space is apportioned into header heraldry, central hero title & epigraph, and a central codex ledger containing interactive search and project cards.

## Elevation & Depth

Depth is achieved through solid tonal stone layering (`#0e110f` → `#171c18` → `#242c26`), 1px gold/iron borders, and natural soft drop shadows (`box-shadow: 0 12px 36px rgba(0,0,0,0.65)`).

## Shapes

- Corner radius is crisp and architectural (`4px` for cards/buttons, `8px` for the ledger container).
- Ornate corner filigrees frame the viewport.

## Components

### Buttons & Filter Tabs
- **Shape:** Crisp architectural corners (`4px` radius).
- **Primary / Active:** Solid antique gold fill (`#c5a059`) with deep slate text (`#0e110f`).
- **Inactive:** Solid stone panel (`#1e241f`) with iron border (`#2e3831`) and muted gold hover.

### Chronicle Project Cards
- **Background:** Deep Forest Leather (`#242c26`) with 1px chiseled iron border.
- **Hover:** Lifts (`translateY(-2px)`) with antique gold border highlight and rune arrow glide.
- **Internal Padding:** `18px 20px`.

### Search Rune Input
- **Background:** Chiseled stone (`#1e241f`) with gold focus ring and search rune icon.

## Do's and Don'ts

### Do:
- **Do** maintain strict zero-gradient solid pigments on all elements.
- **Do** frame interactive views with high-craft elven/dwarven heraldry and filigree.
- **Do** ensure all text maintains at least 4.5:1 contrast against dark slate grounds.

### Don't:
- **Don't** use generic modern web gradients, glows, or pill badges.
- **Don't** allow the desktop hero layout to overflow or create page scrollbars.
