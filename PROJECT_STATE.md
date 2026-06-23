# Project Overview

## Purpose

This project is a scroll-animated influencer / creator acquisition website for Meaningful Plushies. The site is meant to feel like an Apple-style product page: premium, clean, image-led, with scroll-pinned product reveals and smooth transitions. The business goal is to convince creators and influencers to work with Meaningful Plushies by showing the product experience, social proof, brand momentum, and creator programme benefits.

## Tech Stack

- Next.js 15.5.19
- React 19
- GSAP + ScrollTrigger
- CSS in `app/globals.css`
- Local/static media under `public/` and asset references through `lib/assets.js`
- Image-sequence canvas rendering for product videos instead of `video.currentTime` scroll scrubbing

## Deployment Platform

- GitHub repository: `IvanPJH05/meaningful-plushies-pitchdeck`
- Deployment target: Vercel
- Asset fallback base URL is currently hardcoded in `lib/assets.js`:
  `https://i-want-to-develop-a-9l9dwbl1d-ivanpjh05s-projects.vercel.app`

This fallback is used so the deployed app can still load large media from a known Vercel deployment even when all media assets are not copied into the current source tree.

# Current Architecture

## Major Components

- `components/SiteHeader.js`
  - Sticky top navigation.
  - Shows Meaningful Plushies logo, "Influencer Studio", section links, and "Book intro".

- `components/HeroReveal.js`
  - First hero/banner animation.
  - Starts with cloud background and logo.
  - Scroll or logo tap transitions into Home 2 plushie image, then fades toward the first object section.
  - Logo click animates to the first object state.

- `components/ObjectScrollSection.js`
  - Main scroll-pinned product/object sequence after the hero.
  - Includes plushie character fade sequence, speaker image sequence, NFC image sequence, speaker copy, NFC copy, and clickable NFC certificate pills.
  - Uses GSAP ScrollTrigger and CSS variables to control object opacity, position, scale, and text reveal.

- `components/ScrollImageSequence.js`
  - Canvas-based image sequence renderer.
  - Preloads frames.
  - Draws the current frame to canvas based on scroll progress.
  - Has mobile/reduced-motion fallback behavior.

- `components/CustomerReviewsSection.js`
  - Customer review section.
  - Currently intended to be non-scroll-pinned, with an Apple-style slider displaying 3 reviews at once.
  - Preloads nearby review images to reduce delay when clicking next/previous.

- `components/AboutUsSection.js`
  - About Us scroll section.
  - Current plan: scroll-pinned section that transitions from "About Us" to "What's Next".
  - Uses manual scroll progress from `getBoundingClientRect`.

- `components/CreatorProgramSection.js`
  - VIP creator programme section.
  - Current work area and current bug source.
  - Intended to be a scroll-pinned section with several creator programme slides, then details such as TikTok view bonus, content ideas, video popup cards, and contact CTA.

## Important Files

- `app/page.js`
  - Controls page order:
    1. `SiteHeader`
    2. `HeroReveal`
    3. `ObjectScrollSection`
    4. `CustomerReviewsSection`
    5. `AboutUsSection`
    6. `CreatorProgramSection`

- `app/globals.css`
  - Main styling and animation layout.
  - Contains sticky wrappers, responsive rules, typography, review slider styling, NFC pills, About Us, and Creator Programme styles.

- `lib/assets.js`
  - Central helper for asset URLs.
  - Uses `NEXT_PUBLIC_ASSET_BASE_URL` if provided, otherwise falls back to a deployed Vercel asset host.

- `next.config.mjs`
  - Next.js configuration.

- `package.json`
  - Scripts and dependencies.

## Data Flow

- Static content is mostly hardcoded inside React components.
- Media paths are passed through `assetUrl(path)` from `lib/assets.js`.
- Scroll-based components calculate progress from the current section position.
- CSS variables are set inline on section wrappers to drive opacity, transforms, and active states.
- `ScrollImageSequence` receives `frameBase`, `frameCount`, and current progress, then draws frames to canvas.
- Review images are generated from a numeric array and loaded as `/assets/reviews/review-XX.webp`.

# Features Completed

- Next.js app structure created.
- Vercel-oriented project setup exists.
- Brand typography and visual language established:
  - Grandstander-style rounded display typography.
  - Muted blue-gray color scheme.
  - White backgrounds.
  - Soft bordered cards and pills.
  - Premium Apple-like spacing and product framing.
- Sticky site header created.
- Animated hero banner created.
- Hero logo click behavior created.
- Home 2 image fade behavior created.
- First plushie object section created.
- Character sequence created:
  - Billy
  - Tootsie
  - Dragon Warrior
  - Hunnie
- Character text updated:
  - Billy: `CUSTOMISED VOICE / TALKING PLUSHIE`
  - Tootsie: `OVER 1000+ / MEANINGFUL MOMENTS / CREATED`
  - Dragon Warrior: `HAND MADE / WITH LOVE`
  - Hunnie: `THE NEW STANDARD / FOR PLUSHIES`
- Speaker section created.
- Speaker image-sequence implementation created to replace scroll-scrubbed video.
- Speaker "Voice Capacity" selector created:
  - 5 seconds
  - 10 seconds
  - 20 seconds
- Speaker copy created:
  - `ULTRA CLEAR SOUND`
- NFC card image-sequence implementation created.
- NFC section text created:
  - `MEANINGFUL ID`
  - `Powered by NFC technology`
  - `THE FUTURE OF PLUSHIES`
  - `Tap to access your plushie's digital birth certificate`
- NFC certificate pills created:
  - Plushie's Name
  - Plushie's Gender
  - Plushie's Birth Date
  - Plushie's Birth Place
  - Plushie's Favourite Person
  - Plushie Belongs to
  - Meaningful Note
- NFC pill selection is currently click-only. The scroll-based auto-selection was intentionally removed.
- Customer reviews section created.
- Review assets integrated as WebP review images.
- Review slider converted away from the broken grid/list preview toward 3-card Apple-style slider.
- Review heading requested to become:
  - Eyebrow: `WHAT CUSTOMERS THINK`
  - Main heading: `REAL MEANINGFUL MOMENTS`
- About Us section created.
- About Us content created:
  - Headline: `A YOUNG PLUSHIE BRAND / WITH REAL MOMENTUM`
  - Body: development started September 2025, launch January 10, one TikTok post went viral, second restock sold out in 2 days.
  - CTA/pill: `SOLD OUT IN 2 DAYS`
- What's Next slide created:
  - Headline: `EXPANDING TO / TIKTOK SHOP`
  - Body about growing with creators.
  - CTA/pill: `GROW WITH CREATORS`
- Creator programme section created.
- Creator programme slides/content created:
  - VIP Creator Benefits
  - Grow with us on TikTok Shop
  - Simple creator rules
  - Optional sales boost
  - Show the Meaningful ID
- Creator benefits pills/cards created:
  - Free Meaningful Plushie for you and your partner
  - 11% TikTok Shop affiliate commission
  - Earn up to RM500 per video
  - Early access to new drops
- Creator details section created:
  - TikTok view bonus
  - Content ideas
  - Local video popup/modal behavior
  - WhatsApp contact CTA
- Local creator example videos were wired into video popup cards.
- Everything below the creator programme was removed as requested.

# Features In Progress

- Fixing the scroll-pinned behavior of the VIP Creator Programme section.
- Making the creator programme truly stay pinned while its internal slides/details animate.
- Preventing blank white space during scroll transitions.
- Preventing creator programme details from overlapping the next/previous content.
- Ensuring About Us scroll transition works reliably from the first slide to "What's Next".
- Ensuring review, About Us, and VIP creator programme sections have tasteful scroll-in animations without breaking layout.
- Ensuring all sections fit the screen across desktop and mobile instead of relying on fixed resolution assumptions.

# Known Bugs

## 1. VIP Creator Programme Does Not Stay Pinned

### Description

When scrolling through the creator programme section, the section does not reliably stay pinned in the viewport. It can scroll away, reveal blank white space, or allow the next content/details to overlap before the current content has faded out.

### Files Involved

- `components/CreatorProgramSection.js`
- `app/globals.css`

### Current Suspect

The most suspicious CSS is:

```css
.creator-program-section {
  height: 190vh;
  min-height: 1320px;
  overflow: clip;
  overflow-x: clip;
  position: relative;
}

.creator-program-sticky {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: clip;
}
```

The sticky element is `.creator-program-sticky`, but its ancestor `.creator-program-section` has `overflow: clip`. Sticky positioning can fail or behave inconsistently when an ancestor has overflow clipping/scrolling behavior. This should be checked before any other animation changes.

### What Has Already Been Tried

- Converted the creator programme from a simple static/slider section to a scroll-based section.
- Added `.creator-program-sticky` as an inner pinned layer.
- Layered `.creator-program-inner` and `.creator-program-details` inside the sticky layer.
- Increased section height and minimum height.
- Changed transition thresholds in `CreatorProgramSection.js`.
- Removed a sibling z-index rule that was causing visual overlap.
- Tried to reduce blank space by setting:
  - `height: 190vh`
  - `min-height: 1320px`
  - `overflow: clip`
- Changed the progress bar into a solid bar.
- Enlarged the "VIP Creator Programme" label.
- Centered creator benefit pill text.

### What Failed

- The section still does not consistently pin.
- Blank white scroll space still appears.
- Content below can visually overlap.
- The current layout appears to violate the standard sticky-wrapper pattern because the outer section is clipping overflow.

## 2. Creator Programme Scroll Release / Details Overlap

### Description

When the creator programme transitions from intro slides to the detailed TikTok bonus/content idea area, the previous content can remain visible while the new content appears. The user wants the current frame to fade away first or move far enough out that the content below cannot overlap.

### Files Involved

- `components/CreatorProgramSection.js`
- `app/globals.css`

### What Has Already Been Tried

- Added state classes:
  - `is-visible`
  - `is-details-active`
- Added `is-exiting` to `.creator-program-inner`.
- Adjusted `INTRO_EXIT_START` and `DETAILS_START`.
- Used CSS opacity transitions for intro/details.

### What Failed

- The timing still allows content to overlap visually.
- The sticky section itself is not stable, so fine-tuning transitions has not solved the root issue.

## 3. Blank White Space After Creator Programme Slide

### Description

After scrolling past the visible creator programme content, the viewport can show a large blank white area. This makes the site feel broken and violates the design rule that there should not be a fully blank white screen during section transitions.

### Files Involved

- `components/CreatorProgramSection.js`
- `app/globals.css`

### What Has Already Been Tried

- Changed creator section height.
- Changed fade thresholds.
- Tried making details layer appear earlier.

### What Failed

- The blank area still appears because the sticky section and scroll distance are not coordinated correctly.

## 4. About Us Scroll Switch Is Unreliable

### Description

The About Us section is meant to switch from "About Us" to "What's Next" during scroll. It has previously failed to stay in place, shown blank space, or displayed slides in a way that one overlaps the other.

### Files Involved

- `components/AboutUsSection.js`
- `app/globals.css`

### What Has Already Been Tried

- Added sticky wrapper:
  - `.about-us-section`
  - `.about-us-sticky`
- Used CSS variables from manual scroll progress:
  - `--about-first-opacity`
  - `--about-second-opacity`
  - `--about-first-y`
  - `--about-second-y`

### What Failed

- Depending on scroll position, the section can still show too much blank space or not transition clearly.

## 5. Header Can Block Section Content

### Description

The sticky top navigation can visually cover section titles or upper content, especially in scroll-pinned sections.

### Files Involved

- `components/SiteHeader.js`
- `app/globals.css`
- Sections affected:
  - `ObjectScrollSection`
  - `CustomerReviewsSection`
  - `AboutUsSection`
  - `CreatorProgramSection`

### What Has Already Been Tried

- Added top padding to some sticky sections.
- Adjusted section layout heights.

### What Failed

- Some screenshots still show top headings partially hidden or too close to the nav.

## 6. NFC Certificate Pills Can Overflow on Smaller Viewports

### Description

When an NFC certificate pill is selected, its expanded state can push content downward, making the lower pills partially off-screen.

### Files Involved

- `components/ObjectScrollSection.js`
- `app/globals.css`

### What Has Already Been Tried

- Reduced selected pill height.
- Made pill selection click-only.
- Adjusted CSS variables:
  - `--nfc-pill-active-height`
  - `--nfc-pill-rest-height`

### What Failed

- The section still needs better responsive constraints so all pills fit within the visible screen.

# Design Rules

## UI/UX Rules

- The site should feel premium and Apple-like.
- Use the Meaningful Plushies brand style:
  - White backgrounds.
  - Pastel sky/plushie visual mood.
  - Muted blue-gray text and controls.
  - Rounded pill buttons.
  - Soft borders and subtle shadows.
- Use the Grandstander-style font throughout the themed content.
- Keep the interface clean and readable.
- Avoid cluttered layouts.
- Avoid plain empty white screens between sections.
- Header must not block important text.
- Repeated cards should have consistent border width, radius, image sizing, and spacing.
- Images should use consistent aspect ratios within a section.
- Buttons/pills should have centered text.
- Main headings should fit within their container and avoid clipping.
- Section layouts should adapt to the viewport instead of assuming one fixed resolution.

## Animation Rules

- Motion should feel like Apple product pages.
- Avoid robotic linear movement unless specifically requested.
- Use easing by purpose:
  - Entering: `power3.out`
  - Exiting: `power2.in`
  - Floating: `sine.inOut`
  - Premium product reveals: `expo.out`
  - Large movements: `power4.out`
- Overlap transitions by about 15-25% so the next object starts appearing before the previous one fully disappears.
- Avoid abrupt starts/stops.
- Use slight anticipation where it helps:
  - small scale-up before movement
  - slight overshoot before settling
- Scroll-pinned sections should use the standard sticky-wrapper pattern:
  - Outer wrapper controls scroll distance.
  - Inner wrapper is sticky and controls the pinned viewport.
- For video-like product animations, use image sequences with canvas, not `video.currentTime` scrubbing.

## Mobile Requirements

- All sections must fit mobile screens.
- Do not depend on fixed desktop widths/heights.
- Use mobile fallbacks for heavy image sequences where needed.
- Avoid horizontal overflow.
- Text must not overlap with images or controls.
- Pill groups must remain visible and usable.
- Header spacing must be accounted for on mobile and desktop.

# Important Constraints

- Do not rewrite the animation system randomly.
- Do not make broad unrelated changes while fixing a single broken section.
- Do not switch speaker/NFC back to video currentTime scrubbing.
- Do not remove user-provided assets unless explicitly requested.
- Do not remove existing completed sections without user approval.
- Do not let any scroll transition create a fully blank white viewport.
- Do not let the sticky header cover important content.
- Do not change the order of major sections unless requested.
- Do not change the brand font/color direction.
- Do not add unrelated frameworks or abstractions.
- Do not revert user changes wholesale.
- When fixing sticky behavior, first inspect ancestors for:
  - `overflow: hidden`
  - `overflow: auto`
  - `overflow: scroll`
  - `overflow: clip`
  - `transform`
  - `filter`
  - `perspective`
  - `contain`

# Next Tasks

1. Fix `CreatorProgramSection` sticky behavior from first principles.
2. Remove or relocate overflow clipping that breaks sticky, especially on `.creator-program-section`.
3. Convert creator programme to the standard sticky-wrapper pattern:
   - Outer wrapper: `position: relative`, `height: 300vh` or enough scroll distance.
   - Inner pinned layer: `position: sticky`, `top: 0`, `height: 100vh`, `overflow: hidden`.
4. Add comments in the CSS/JS naming:
   - Which wrapper controls scroll distance.
   - Which wrapper is the sticky viewport.
5. Verify creator programme pins at the top, animates while pinned, and releases normally.
6. Ensure no blank white page appears during or after creator programme transitions.
7. Ensure the creator details content does not overlap the intro slides.
8. Fix About Us scroll transition after creator programme sticky behavior is stable.
9. Review header spacing across all pinned sections.
10. Make NFC certificate pill group fit on screen when a pill is selected.
11. Finish review heading update:
    - Eyebrow bigger.
    - Main heading: `REAL MEANINGFUL MOMENTS`.
12. Ensure review slider preloads the next/previous images and uses consistent borders.
13. Confirm all creator example video popups still work.
14. Run a production build.
15. Push to GitHub and let Vercel deploy once the site is stable.

# Current Scroll Animation Issue

## Exact Section Name

`CreatorProgramSection` / VIP Creator Programme.

## Relevant Files

- `components/CreatorProgramSection.js`
- `app/globals.css`
- `app/page.js`

## Current Behavior

- The creator programme does not consistently stay fixed in the viewport.
- Scrolling can move the section away instead of keeping it pinned.
- Large blank white space can appear.
- The details/content below can overlap the still-visible creator programme.
- The user specifically reported:
  - "this doesn't stay in place"
  - "when you scroll, it's just blank space"
  - "the content just goes above this then it only fades away"
  - "make sure there's no plain white space"

## Expected Behavior

- When the creator programme reaches the top of the viewport, it should pin.
- The visual content should remain visible for the full scroll duration.
- The internal stage animation should progress while the section is pinned.
- The intro content should fade/move away cleanly before detail content visually takes over.
- The section should release normally only after the scroll distance ends.
- There should never be a full blank white screen during the transition.

## Debugging Attempts Already Made

- Added `position: sticky` to `.creator-program-sticky`.
- Set the creator section to a large height.
- Added and tuned manual scroll progress calculations.
- Added intro/detail transition thresholds.
- Added opacity and translate transitions for content layers.
- Changed progress bar styling.
- Changed text sizing and spacing.
- Tried preventing overlap with z-index and later removed a sibling z-index rule.
- Changed section overflow to `overflow: clip`, likely in an attempt to contain overlap.

## Likely Cause

The likely cause is not the animation math itself. The likely cause is the sticky DOM structure and CSS containment:

- The sticky element is `.creator-program-sticky`.
- Its parent `.creator-program-section` currently has `overflow: clip`.
- Sticky elements often fail or behave unexpectedly when a parent clips overflow.
- The outer wrapper currently has `height: 190vh`, which may not provide enough scroll distance for all the intended stages and details.

## Minimal Fix Direction

Do not rewrite the animation system first. First restore the standard sticky-wrapper contract:

```css
/* Scroll-distance wrapper. This controls how long the pinned animation lasts. */
.creator-program-section {
  position: relative;
  height: 300vh;
  overflow: visible;
}

/* Sticky viewport. This is the layer that remains fixed during the scroll sequence. */
.creator-program-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
```

Then retest. Only after sticky is stable should the transition timing be adjusted.

# Local Development Notes

- Development server has been run with:
  - `npm.cmd run dev -- --hostname 127.0.0.1 --port 3001`
- Local URL:
  - `http://127.0.0.1:3001`
- A previous production build passed with:
  - `npm.cmd run build`
- `git` was not available in the current PowerShell environment during the latest inspection, so repository status could not be checked with `git status` from this shell.

# Handoff Summary

The site is visually far along, with the major sections and assets in place. The biggest issue is now structural: the VIP Creator Programme scroll-pinned section is not respecting the sticky-wrapper pattern. The next engineer should avoid more timing tweaks until the sticky parent/child CSS is corrected. The leading suspect is `overflow: clip` on `.creator-program-section`, combined with insufficient scroll height for the number of stages being animated.
