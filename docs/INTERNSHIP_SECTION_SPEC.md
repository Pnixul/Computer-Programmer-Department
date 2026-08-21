# Internship Section: UX/UI Specification
## Hybrid Direction (Story Spotlight + Pathway Clarity)

---

## 1. Section Hierarchy & Overall Structure

The Internship section consists of three main layers, in sequence:

### Layer 1: Section Header
- Standard header pattern (eyebrow + title + descriptive paragraph)
- Eyebrow: "ฝึกประสบการณ์วิชาชีพ" (Internship Experience)
- Title: "ดำเนินการปฏิบัติงาน และเรียนรู้จากสถานประกอบการ" or similar (Learn Through Real Workplace Experience)
- Body copy: 2–3 sentences explaining that internship is a key part of the student journey, emphasizing authentic workplace learning.

### Layer 2: Internship Pathway Overview (NEW)
- **Purpose:** Clearly communicate that ปวช. and ปวส. follow different internship structures without splitting the section.
- **Visual treatment:** Compact, side-by-side comparison (desktop) or stacked (mobile).
- **Content per pathway:**
  - Education level name (ปวช. or ปวส.)
  - Duration (e.g., "Approximately 1 Semester" / "Approximately 1 Academic Year")
  - One short sentence describing scope or approach (e.g., "Gain hands-on experience in your chosen workplace" / "Deeper integration with workplace projects and team")
- **Style:** Two information cards or blocks, visually distinct but not competing for attention. Use blue-soft background with navy text; small accent yellow bar or dot to connect to DESIGN.md.
- **Spacing:** Positioned immediately below the section header, with clear visual separation from the stories below (more whitespace below this layer).

### Layer 3: Real Internship Experiences (PRIMARY FOCUS)
- **Purpose:** Showcase individual student internship stories through varied, editorial composition.
- **Content structure:** 3 total internship stories (1 featured + 2 additional) for the homepage demo.
- **Visual treatment:** Desktop uses asymmetrical, alternating layout; mobile simplifies to single-column storytelling.
- **Call-to-action:** No "View all" or archive link at this stage; stories stand alone as the primary demo content.

---

## 2. Internship Pathway Overview Treatment

### Visual Design Strategy
The pathway overview uses a **visual comparison with timeline indicators** to clearly show the difference between ปวช. and ปวส. internship structures without implying progression or hierarchy.

**Important Note:** The visual connection between the two pathways represents a comparison of different internship structures, NOT a mandatory progression from ปวช. to ปวส. Each student follows their own path based on their program level.

### Desktop Composition
- **Layout:** Side-by-side (2-column grid, responsive gap)
- **Visual elements per pathway:**
  - Numbered circle indicator (1 for ปวช., 2 for ปวส.) — Navy border/white background for ปวช., blue fill/soft background for ปวส.
  - Vertical line connector (blue-border gradient from ปวช. down—purely visual reference, not progression)
  - Education level label (uppercase, smaller text, navy/blue)
  - Duration display (prominent, 20–24px font)
  - Descriptive paragraph (body copy, 2–3 lines, muted gray)
  - No card styling; clean, editorial layout
- **Color scheme:**
  - ปวช.: Navy border circle, navy text, no fill background
  - ปวส.: Blue fill circle, blue-soft background, blue text accent
- **Spacing:** Responsive gap between columns (32–48px depending on viewport)
- **Optional visual note:** Small disclaimer beneath explaining that internship experiences vary by student and program

### Mobile Composition
- **Layout:** Stacked vertically (full width)
- **Spacing:** 32px gap between pathways
- **Elements:** Same as desktop, but optimized for vertical reading
- **Visual line:** Hidden on mobile (not necessary for vertical stacking)

### Visual Integration
- Positioned below section header with responsive margin (48–56px)
- Lighter visual weight than internship stories
- Sets context for what follows without competing for attention
- Educational/informational tone, not promotional

---

## 3. Real Internship Experiences: Story Layout

### Desktop Composition Strategy

**Principle:** Asymmetrical, alternating left-right composition. Stories are presented with generous whitespace, image-forward on desktop, with varied card widths and placements to create visual rhythm.

**Featured Story (Story 1 — Top, anchor position)**
- Layout: Asymmetrical two-column grid with unequal widths
  - Left side (60% width): Large media/image placeholder or student photo
  - Right side (40% width): Text content card
- Media side:
  - Aspect ratio: 4/3 (landscape, strong on desktop)
  - Background: Surface card styling (white, 16px radius, subtle shadow)
  - Placeholder treatment: Show "Student Photo Placeholder" or similar (details in Section 5)
  - Actual content: When real data arrives, shows student's internship workspace photo or portrait
- Content card (right side):
  - Background: Same as media (white surface card)
  - Padding: 32px
  - Typography:
    - Top: Small eyebrow "ปวช." or "ปวส." badge (yellow accent dot + navy text, uppercase label)
    - Below: Company/Workplace name as small label (14px muted)
    - Below: Role/Position as subsection-title (28px bold navy)
    - Below: Short description (2–3 sentences, body copy)
    - Below: List of skills/tools used as inline tag pills
    - Bottom: Optional "Read more" link if full stories exist elsewhere
- Spacing between media and text: 32px (md: 40px, lg: 48px)
- Negative space: Generous padding above and below this featured story (40px–56px)

**Additional Stories (Stories 2–3)**
- Layout: Alternating left-right composition
  - Story 2: Text left, media right (opposite of Story 1)
  - Story 3: Text left, media right (same as Story 2)
- Media/text proportions: 50/50 or 45/55 (more balanced than featured story)
- Card sizing: Full container width (100%)
- Content cards (text side):
  - Same padding and typography as featured story
  - Eyebrow badge, company, role, description, skills tags
  - No "Read more" link; story preview contains sufficient information
- Spacing between stories: 56px–64px vertical gap (creates rhythm, not monotonous)
- Media aspect ratio: Consistent 4/3 or 16/9 (choose one per section consistency)

**Visual Hierarchy Differentiation**
- Featured story (top): Largest, asymmetrical (60/40), anchors the section
- Stories 2–5: Slightly smaller text, more balanced proportions, but still generous
- If more than 5–6 stories exist, consider grouping or pagination ("View all internship stories") to avoid infinite scroll

### Mobile Composition Strategy

**Simplification principle:** All stories collapse into a single-column, full-width flow. Narrative clarity trumps desktop expressivity.

- **Featured Story:**
  - Image on top (full width, 4/3 aspect)
  - Text card below (full width)
  - No left-right asymmetry; straightforward stacking

- **Additional Stories:**
  - Image on top, text card below (consistent stacking)
  - Full width throughout
  - No alternation; uniform single-column flow

- **Spacing:**
  - 24px vertical gap between story image and text card (within a story)
  - 40px vertical gap between stories (clear visual break)

- **Typography adjustments:**
  - Headline/role text may scale down slightly on very small screens (<=375px)
  - Use responsive `clamp()` to ensure readability without manual breakpoint tweaks

- **Image sizing:**
  - Full viewport width minus container padding (typically 20px–40px total)
  - Maintain 4/3 or 16/9 aspect; image fills available width

**Why this works on mobile:**
- Single column is natural for storytelling and reading
- Image-first creates visual interest even without asymmetry
- ปวช./ปวส. badge is still visible on the text card, maintaining clarity
- No horizontal scrolling or layout confusion
- Parents and prospective students can scroll through stories at natural rhythm

---

## 5. Student Story Card Structure

Each story card (whether featured or additional) contains the following information hierarchy:

### Information Elements (in refined order)

1. **Education Level Badge** (Top-left of content)
   - Visual: Yellow dot (2.5px diameter) + uppercase text
   - Text: "ปวช." or "ปวส." in 11–12px bold, tracking 0.12em, navy color
   - Example: `● ปวช.`
   - Purpose: Immediately signals program level

2. **Workplace/Company Name** (Below education badge)
   - Visual: Section label, uppercase, 11–12px, tracking 0.12em, muted gray
   - Text label: "สถานที่ฝึกงาน" (Internship Location)
   - Content: Company name, 18–20px font-semibold, navy text
   - Format: Company name as it appears officially (e.g., "Botnoi")
   - Purpose: Establishes workplace credibility

3. **Role/Position** (Prominent headline)
   - Visual: Text-2xl (24px) on mobile, text-3xl (30px) on tablet, text-4xl (36px) on desktop, bold navy
   - Leading: snug (1.1)
   - Format: e.g., "Frontend Developer Intern"
   - Purpose: Clear, scannable job title

4. **Short Description** (Body text, 2–3 sentences)
   - Visual: `.body-copy` class (16px, muted gray, 2x line height)
   - Content guidelines:
     - What the student worked on (specific projects or responsibilities)
     - Technologies or approaches used
     - Key insight or skill reinforced
   - Example: "Worked on frontend development and UX/UI improvements for Botnoi Voice and related product interfaces. Contributed to GPT Gen Image UX/UI enhancements, Gemini TTS interface improvements, and responsive design refinements across web platforms."
   - Purpose: Authentic voice, realistic scope

5. **Skills/Tools Used** (Tag pills, inline)
   - Visual: `.tag-pill` component—blue-soft bg, navy text, rounded full, 6–14px padding responsive
   - Content: 3–6 technology names or skill areas
   - Examples: "Angular", "TypeScript", "Tailwind CSS", "Git", "Figma", "UX/UI"
   - Placeholder style (for incomplete stories): Outlined pill (no bg fill, border only)
   - Purpose: Concrete evidence of technical/professional skills

### Featured Story Special Styling
- **Internship Visual** occupies prominent 60% of desktop real estate
- **Content area** 40% desktop, with generous internal spacing (20–24px)
- **Typography:** Slightly larger than additional stories for visual hierarchy
- **Spacing between elements:** 20px (vs. 16px on additional stories)

### Additional Stories Styling
- **Internship Visual & Content:** Balanced proportions (45–55% split)
- **Typography:** Same hierarchy as featured, slightly smaller sizes
- **Spacing:** Consistent 56–64px gap between stories (vertical rhythm)

---

## 5a. Real Featured Example: Botnoi Frontend Developer Intern

**Program Level:** ปวช. (Vocational Certificate)

**Workplace:** Botnoi

**Role:** Frontend Developer Intern

**Experience:**
Worked on frontend development and UX/UI improvements for Botnoi Voice and related product interfaces. Contributed to GPT Gen Image UX/UI enhancements, Gemini TTS interface improvements, and responsive design refinements across web platforms.

**Skills/Tools:**
- Angular
- TypeScript
- Tailwind CSS
- Git
- Figma
- UX/UI

**Internship Visual:**
- Type: screenshot
- Label: "Project Screenshot / Product Interface"
- Current state: Placeholder presentation frame with browser chrome
- Future: Real approved Botnoi project screenshot or product interface capture
- Note: Use existing screenshot with permission; do not fabricate or recreate Botnoi interfaces

**Copy Strategy:**
- Straightforward, factual description of work responsibilities
- No exaggeration of outcomes or overstated achievements
- Focus on actual tools, technologies, and real projects worked on
- Authentic voice that shows genuine learning experience

---

## 5b. Placeholder Stories: Honest ปวส. Internship Examples

**Story 2 & Story 3:** Both marked as ปวส. (Higher Vocational Certificate)

**Status:** Awaiting real internship data collection

**Placeholder Content Strategy:**
- Workplace: "รอข้อมูลประสบการณ์จริง" (Awaiting real internship information)
- Role: "บทบาท / ลักษณะงาน" (Role / Type of Work)
- Description: "ข้อมูลประสบการณ์ฝึกงานของนักศึกษาระดับปวส. จะถูกเพิ่มเมื่อสิ้นสุดการฝึกงาน บทบาท ลักษณะงาน และทักษะที่ได้เรียนรู้จะถูกแชร์เป็นตัวอย่างจริงในส่วนนี้" (ปวส. internship stories will be added upon completion. Real roles, work types, and acquired skills will be shared as examples here.)
- Skills: "ทักษะและเครื่องมือ" (Skills and Tools)
- Visual: Placeholder presentation frame with gray background
- Visual Label: "ขออพื่อข้อมูล" (Awaiting Information)

**Visual Styling for Placeholders:**
- Outlined tag pills (border only, no fill) instead of solid blue-soft
- Italic descriptive text to signal placeholder content
- Same structural hierarchy as real stories, but clearly not yet populated
- Visual distinction that communicates "coming soon" without looking incomplete or broken

---

## 6. Placeholder Content Strategy

### Guiding Principle
Placeholders are **clearly temporary and non-fabricated**. They communicate future content without pretending to be real data.

### Featured Story (Botnoi Real Data)
- All information factual and verified
- Copy concise, natural, grounded in provided details
- No invented achievements or exaggerated responsibilities
- Visual area ready for approved project screenshot

### Additional Stories (ปวส. Placeholders)
- Explicitly marked with Thai labels indicating "Awaiting Information"
- No fabricated student names, companies, positions, or outcomes
- Same structural design as real stories (not "broken" or empty)
- Clear visual distinction (outlined pills, italic text) signals incomplete data
- Design remains intentional and polished despite being placeholder

### No Fabrication Rule
- Never invent real student names
- Never create fake company names for ปวส. examples
- Never describe fictional internship achievements
- Never claim specific skills or projects as examples
- Let the structure and placeholder labels communicate what will eventually go there

### Replacement Timeline
When real ปวส. internship data becomes available:
1. Collect from current ปวส. student internship supervisors/records
2. Interview students near end of their internship
3. Document: company name, student role, 2–3-sentence description, 3–6 confirmed skills/tools
4. Gather workplace or work artifact photos (with permission)
5. Replace placeholder in priority order (Story 2 first, then Story 3)
   - Purpose: Establishes workplace credibility

3. **Role/Position** (Prominent headline)
   - Visual: Subsection-title typography (28px bold navy on desktop, smaller on mobile)
   - Format: e.g., "Junior Web Developer" or "IT Support Specialist"
   - Purpose: Clear, scannable job title

4. **Short Description** (Body text, 2–3 sentences)
   - Visual: Body copy typography (16px, muted gray, 2x line height)
   - Content guidelines:
     - What the student worked on (specific project or responsibility)
     - How it applied their learning
     - Key insight or skill gained
   - Example: "I helped develop and maintain the company's customer support portal using Vue.js and Node.js. Working directly with the development team, I learned the full lifecycle of web application development—from design through deployment. This experience confirmed my interest in backend development."
   - Purpose: Authentic voice, realistic scope

6. **Skills/Tools Used** (Tag pills, inline)
   - Visual: tag-pill component per DESIGN.md (blue-soft bg, navy text, rounded full)
   - Content: 3–6 technology names or skill areas
   - Examples: "Vue.js", "Node.js", "Figma", "Customer Support"
   - Purpose: Concrete evidence of technical/professional skills

---

## 5. Placeholder Content Strategy

### Guiding Principle
Placeholders must be **clearly temporary and distinct** from real content. They signal to content teams and users that real data will replace them. Never fabricate real student names, companies, or outcomes.

### Placeholder Visual Treatment

**For Education Level Badge & Metadata:**
- Use standard eyebrow format but with placeholder text
- Example: `● [PROGRAM LEVEL]` where [PROGRAM LEVEL] is grayed out and italicized

**For Workplace/Company Name:**
- Visual: Light gray text, italic or slightly faded
- Example: "[Company Name Placeholder]" or "Company Name TBD"
- Avoid: "ABC Corp", "XYZ Inc." (fake names)

**For Role/Position:**
- Visual: Headline size, but faded/muted (gray-400 or lighter)
- Example: "[Student Role Placeholder]" or "Internship Role — To Be Confirmed"

**For Description:**
- Visual: Body copy with placeholder styling (muted, possibly italic)
- Example: "Short description of internship experience, what the student worked on, skills gained, and insights. This will be replaced with real student story when internship data is collected."

**For Skills/Tools Tags:**
- Visual: tag-pill styling, but faded or with different background (e.g., blue-border outline instead of solid blue-soft fill)
- Example: 
  - `[Skill Placeholder]`
  - `[Technology TBD]`
  - Avoid creating realistic skill names if they're not confirmed

**For Media/Images:**
- Continue using media-placeholder class (current implementation)
- Visual: Surface card with dashed inner border, yellow accent mark, placeholder text
- Text: "Student Photo Placeholder" or "Internship Experience Photo Placeholder"
- Clear visual distinction from real photos when they arrive

### Content Density for Placeholders
- Start with 2 full placeholder stories (featured + 1 additional)
  - Enough to show the full visual pattern on desktop (one complete alternation cycle)
  - Enough to demonstrate the mobile flow
- Add 1–2 more placeholder stories as scaffolding for development
- When real data arrives, replace placeholders in priority order:
  1. Featured story (ปวช. or ปวส., whichever has the first real data)
  2. Additional stories (fill chronologically as data is collected)

### Placeholder Timeline Communication
- Include a note near the "View all internship stories" link or in a footer callout:
  - "📌 Internship stories are being collected from students. Check back soon for real experiences."
  - Keep this note visible until at least 50% of stories are real data

---

## 6. Visual Hierarchy & Distinctiveness

### Why This Layout Differs from Learning & Projects Sections

| Aspect | Learning Section | Projects Section | Internship Section (This) |
|--------|------------------|------------------|-------------------------|
| **Primary Focus** | Sequential skill/knowledge progression | Peer-created technical artifacts | Individual workplace narratives |
| **Composition** | Scrollable card-based timeline or cards | Featured project + list view | Asymmetrical, alternating story layout |
| **Visual Style** | Skill icons, descriptive cards | Project showcase, gallery-like | Photo-forward, editorial, story-driven |
| **Desktop Expression** | Vertical or horizontal scroll | Grid or featured + sidebar | Alternating left-right with strong whitespace |
| **Content Hierarchy** | Skills → what you learn | Portfolio pieces → technical depth | People → roles → real work → skills |
| **Image Placement** | Decorative or secondary | Central (project screenshots/demos) | Equal priority with text (story context) |

### Internship Section Visual Identity
- **Mood:** Documentary/journalistic, authentic, trust-building
- **Palette:** Navy and muted gray as primary text; yellow accents on badges and visual breaks
- **Whitespace:** Generous, intentional; breathing room between stories signals editorial quality
- **Imagery:** Photo-forward; student faces/workspaces when available, creating human connection
- **Typography:** Standard system fonts; no custom typesetting; clarity over expression

### Visual Distinctiveness Checklist
- ✓ No grid of uniform cards (Projects handles that)
- ✓ Asymmetrical composition signals "story", not "list"
- ✓ Generous whitespace separates stories (no cramped layouts)
- ✓ Education level badge creates a persistent visual cue not seen in other sections
- ✓ Media and text are equally sized/weighted (not image-as-background or text-as-caption)
- ✓ Alternating left-right on desktop creates rhythm distinct from sequential Learning section

---

## 7. Content Density Recommendations

### Initial Story Count (Homepage Demo)
- **Total stories:** 3 (1 featured + 2 additional)
- **Desktop:** All 3 stories visible without scrolling (or minimal scroll)
- **Mobile:** Stories stack single-column; all 3 may require scroll depending on device size

### Rationale
- 3 stories provide enough diversity to show ปวช./ปวส. variation and different roles
- Focused, curated selection feels editorial rather than overwhelming
- No pagination or "View all" CTA at this stage; stories stand alone as a demo
- Placeholder strategy is clear: what you see is the complete section

### Minimum Viable Content (for launch)
- 1 featured story (clearly labeled placeholder)
- 2 additional stories (mix of ปวช./ปวส. if possible, or clearly placeholder)
- Pathway overview (always present, informational)
- Section header

### Future Expansion Path
- As real internship data is collected, replace placeholders with genuine stories in priority order
- When 6+ confirmed stories exist, consider a dedicated internship portfolio page (future decision)
- Desktop can accommodate additional stories with continued alternation; mobile may need pagination

---

## 8. UX Risks & Mitigation

### Risk 1: Incomplete Data Creates Visual Imbalance
**Scenario:** ปวส. data is sparse; featured story and most stories are ปวช. only.

**Impact:** Section feels lopsided; ปวส. pathway appears less developed or less appealing.

**Mitigation:**
- Explicitly label placeholders: "[ปวส. Story Coming Soon]" or similar
- If ปวส. data is significantly behind, consider a dedicated "ปวส. Internship Stories" callout or button linking to a future page
- Do not invent ปวส. stories; better to show incomplete than fabricated

### Risk 2: Alternating Layout Feels Chaotic Without Strong Content
**Scenario:** Placeholder text is inconsistent in length; images are missing; stories feel disjointed.

**Impact:** Desktop composition looks awkward or unfinished instead of editorial.

**Mitigation:**
- Enforce consistent description length during content collection (2–3 sentences, ~100 words)
- Use consistently sized image placeholders (4/3 aspect, same pixel dimensions)
- Create a content template/checklist for teams collecting internship data
- Review mock-ups with real data early; adjust spacing/sizing if needed

### Risk 3: Mobile Story Card Becomes Too Long
**Scenario:** On mobile, each story is image + large text block; users may lose context of where one story ends and another begins.

**Impact:** Single-column flow becomes overwhelming; stories blur together.

**Mitigation:**
- Ensure clear 40px+ gap between stories (use responsive spacing tokens)
- Add a subtle bottom border or background color change at story boundaries
- Consider a story counter or progress indicator if stories exceed 5–6 (e.g., "Story 2 of 4")
- Test on actual mobile devices; adjust story block max-width if needed

### Risk 4: Education Level Badge is Overlooked
**Scenario:** Users scan quickly and miss the ปวช./ปวส. badge, conflating the two pathways.

**Impact:** Section fails to communicate the core insight that ปวช. and ปวส. follow different internship structures.

**Mitigation:**
- Make badge visually prominent: yellow accent dot + uppercase text is a strong visual cue
- Pathway overview reinforces duration difference at the top of the section
- If users have low engagement with badges, consider adding visual dividers between ปวช. and ปวส. stories (future enhancement)

### Risk 5: Asymmetrical Desktop Layout Breaks on Narrow Tablets
**Scenario:** On tablet (768px–1024px), the alternating layout may have awkward spacing or text wrapping issues.

**Impact:** Desktop composition doesn't adapt well between desktop and tablet sizes.

**Mitigation:**
- Responsive design: use consistent gap/padding tokens; test at tablet breakpoints during implementation
- If needed, collapse to single-column layout on tablet (< 1024px) instead of forcing alternation
- Alternatively, implement a 2-column grid on tablet as a middle ground (Story 1 left, Story 2 right, then stack at next row)

---

## 9. Implementation Readiness Checklist

Before building this layout, confirm:

- [ ] Real internship data collection process is defined (who will provide student stories, approval process, etc.)
- [ ] Placeholder content guidelines are shared with content teams
- [ ] Responsive breakpoints are confirmed with the team (desktop ≥ 1024px, tablet 768–1023px, mobile < 768px)
- [ ] Story count and expansion strategy are locked (start with 3–4? expand to X?)
- [ ] Destination for "View all" link is decided (in-section infinite scroll, dedicated page, modal, etc.)
- [ ] Image aspect ratio is confirmed (4/3 or 16/9; must be consistent across all stories)
- [ ] Content length constraints are documented (description max characters, skills tag count, etc.)
- [ ] Accessibility requirements are confirmed (color contrast, keyboard navigation, alt text for images)

---

## 10. Visual Mockup Guidance (For Designer/Developer Reference)

### Desktop Wireframe Flow
```
[Section Header]
  ↓ (40px gap)
[Pathway Overview: ปวช. Duration | ปวส. Duration (minimal styling)]
  ↓ (56px gap)
[Featured Story: Image Left (60%) | Text Right (40%)]
  ↓ (56px gap)
[Story 2: Text Left (45%) | Image Right (55%)]
  ↓ (56px gap)
[Story 3: Text Left (45%) | Image Right (55%)]
```

### Mobile Wireframe Flow
```
[Section Header]
  ↓ (32px gap)
[Pathway Overview: ปวช. pathway]
[Pathway Overview: ปวส. pathway]
  ↓ (40px gap)
[Featured Story: Image (full width)]
[Featured Story: Text (full width)]
  ↓ (40px gap)
[Story 2: Image (full width)]
[Story 2: Text (full width)]
  ↓ (40px gap)
[Story 3: Image (full width)]
[Story 3: Text (full width)]
```

---

## Summary

This hybrid specification combines the narrative focus of Direction 2 (Individual Story Spotlight) with the education-level clarity of Direction 1 (Dual Pathway). The result is:

- **A concise Pathway Overview** that explains ปวช./ปวส. differences without dominating the section
- **Editorial, asymmetrical storytelling** on desktop that celebrates real student voices
- **Simplified single-column flow** on mobile that maintains clarity and readability
- **Placeholder strategy** that leaves room for real data without fabrication
- **Visual distinctiveness** from Learning and Projects sections through composition and content focus
- **Clear risk mitigation** for incomplete data, layout issues, and user comprehension

Ready for implementation once real internship data collection begins.
