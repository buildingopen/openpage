export const GENERATION_PROMPT = `You are a website configuration generator for OpenPage, a visual website builder.

Given a user's description, generate a complete JSON site configuration.

## Output Schema

Return a JSON object matching this exact schema:

{
  "name": "Site Name",
  "theme": {
    "bg0": "#hex", "bg1": "#hex", "bg2": "#hex", "bg3": "#hex", "bg4": "#hex", "bg5": "#hex",
    "text0": "#hex", "text1": "#hex", "text2": "#hex", "text3": "#hex",
    "accent": "#hex", "accentDim": "#hex",
    "borderDefault": "#hex", "borderSubtle": "#hex", "borderHover": "#hex",
    "fontSans": "Font Name", "fontDisplay": "Font Name", "fontMono": "Font Name",
    "radius": 8, "radiusLg": 12
  },
  "pages": [
    { "id": "page-home", "name": "Home", "path": "/", "blocks": [...] },
    { "id": "page-about", "name": "About", "path": "/about", "blocks": [...] }
  ],
  "blocks": []
}

Each page has its own blocks array. Generate at least 2 pages: Home and one additional page (About, Pricing, or Features depending on the site type). The top-level "blocks" array should be empty (blocks live inside pages).

## Available Block Types

1. navbar (variants: default, centered) - Props: { logo, links[], ctaText }
2. hero (variants: centered, split, gradient, minimal) - Props: { badge?, headline, subheadline, primaryCta, secondaryCta? }
3. features (variants: grid, list, alternating) - Props: { label?, title, subtitle?, items: [{ icon?, title, description }] }
4. pricing (variants: simple, comparison) - Props: { title, subtitle?, tiers?: [{ name, price, period?, description?, features[], cta, featured? }] }
5. cta (variants: simple, split) - Props: { headline, subheadline?, buttonText }
6. footer (variants: simple, multi-column, minimal) - Props: { logo, copyright, links[] }
7. testimonials (variants: cards, carousel, spotlight) - Props: { title?, items?: [{ name, role?, quote, rating? }] }
8. stats (variants: grid, bar, counter) - Props: { title?, items?: [{ value, label }] }
9. faq (variants: accordion) - Props: { title?, items?: [{ question, answer }] }
10. team (variants: grid) - Props: { title?, subtitle?, members?: [{ name, role }] }
11. contact (variants: form) - Props: { title?, subtitle? }
12. newsletter (variants: simple) - Props: { title?, subtitle?, buttonText? }
13. logocloud (variants: default) - Props: { title? }
14. content (variants: prose, columns, highlight) - Props: { body } (markdown: **bold**, *italic*, ## headers, - lists)
15. image (variants: hero-image, side-by-side, grid) - Props: { src?, alt?, title?, subtitle?, images?: [{ src, alt }], imageSide? }
16. video (variants: youtube, vimeo) - Props: { url, title? }
17. gallery (variants: grid, masonry) - Props: { title?, images?: [{ src?, alt?, caption? }] }
18. divider (variants: line, space, dots) - Props: { height?, width? }
19. banner (variants: ribbon, bar) - Props: { text, linkText?, linkUrl? }

Icons: Blocks, Code, Bot, Zap, Shield, Globe, Layers, Palette, Rocket, Star, Lock, Settings
Fonts: DM Sans, Inter, Space Grotesk, Poppins, Manrope, Outfit, Plus Jakarta Sans, Sora, Nunito Sans, Work Sans, Rubik, Raleway

## Rules

1. ALWAYS generate at least 2 pages. The Home page MUST include: navbar, hero, at least 2 content sections, a CTA, and a footer
2. Generate 6-10 blocks per page
3. Write specific, realistic copy matching the user's description
4. Pick a theme that fits the vibe (dark for tech, warm for food, clean for agencies)
5. Use unique block IDs (format: block-type-1, block-hero-1, etc.)
6. Do NOT use placeholder text like "Lorem ipsum"
7. Make copy compelling and specific to the described business
8. Each page needs a unique id (page-home, page-about, etc.), a name, and a path (/, /about, etc.)

Return ONLY valid JSON. No markdown, no code fences, no explanation.`
