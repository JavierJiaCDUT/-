# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Retro Paper Terminal is a retro-styled typewriter application built with React 19, TypeScript, and Vite. The app simulates a vintage Motorola terminal/beeper device that prints text onto draggable paper cards with a typewriter animation effect.

## Development Commands

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Runs on `http://localhost:3000` (configured in vite.config.ts to bind to 0.0.0.0:3000)

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm preview
```

## Architecture Overview

### Component Structure

**App.tsx** - Root component managing application state
- Manages card state: position, z-index, typing animation status
- Implements drag-and-drop logic using Pointer Events API
- Coordinates Terminal (input) and PaperCard (output) components
- Card spawning logic centers new cards at `SPAWN_OFFSET_Y = 420px` with slight randomization

**Terminal.tsx** - Retro terminal input interface
- Styled as a vintage Motorola Fix-Beeper device with CRT screen effects
- Power toggle button to enable/disable input
- Submit via button click or `Shift+Enter` keyboard shortcut
- Uses `lucide-react` icons for UI elements

**PaperCard.tsx** - Draggable output cards
- Typewriter animation effect (50ms per character)
- Paper texture overlay for realism
- Slight random rotation based on card ID for organic feel
- Delete button to remove cards
- Drag handle with grip icon

**types.ts** - Shared TypeScript interfaces
- `CardData`: Core data structure for output cards
- `Position`: x/y coordinate type

### State Management

State is managed entirely in App.tsx using React hooks:
- `cards` array: all active paper cards
- `maxZIndex`: tracks highest z-index for bring-to-front behavior
- `draggingId`: tracks which card is currently being dragged
- `dragOffset`: ref storing pointer offset during drag

### Drag & Drop Implementation

Uses Pointer Events API (not mouse events) for better cross-device support:
1. `onPointerDown`: Captures pointer, calculates offset, brings card to front
2. `onPointerMove`: Updates card position while dragging
3. `onPointerUp`: Releases pointer capture, ends drag

Key detail: Pointer capture (`setPointerCapture`) ensures drag continues even if pointer moves outside element boundaries.

### Styling Architecture

- **Tailwind CSS**: Loaded via CDN in index.html
- **Custom Tailwind Config**: Extended with custom fonts, colors, animations
- **Fonts**:
  - Courier Prime for typewriter text
  - VT323 for terminal display
- **Color Scheme**:
  - `retro-green` (#33ff00): Terminal text with glow effect
  - Dark zinc tones for chassis/UI
  - Paper white (#fdfbf7) for cards
- **Animations**:
  - Typewriter cursor blink (1s step-end loop)
  - Card slide-out entrance (0.5s ease-out)
  - CRT scanline and RGB chromatic aberration effects

### Path Aliases

TypeScript and Vite both configured with `@/` alias pointing to project root:
```typescript
import { CardData } from '@/types';
```

## Key Technical Patterns

### Typewriter Effect
PaperCard uses `useEffect` + `setInterval` to animate text character-by-character. The `isTyping` flag determines whether to animate or show full text immediately.

### Card Positioning
- Cards spawn centered horizontally: `containerRect.width / 2 - 160` (160 = half of card width)
- Vertical position: `SPAWN_OFFSET_Y` with ±10px randomness
- Horizontal randomness: ±20px
- Z-index increments with each new card or when brought to front

### Component Communication
Parent-to-child via props:
- `onPrint` callback: Terminal → App (create new card)
- `onPointerDown` callback: PaperCard → App (handle drag start)
- `onDelete` callback: PaperCard → App (remove card)

## Browser Compatibility

The app uses modern browser features:
- Pointer Events API
- CSS Grid/Flexbox
- `crypto.randomUUID()`
- ES2022+ features

Target: Modern browsers (Chrome/Edge/Firefox/Safari latest versions)
