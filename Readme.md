# HNG Stage 1A — Advanced Todo Card Component

An interactive, stateful, and fully accessible todo task card built with semantic HTML, vanilla CSS, and vanilla JavaScript. Extended from Stage 0 as part of the HNG Frontend internship.

---

## Live Demo

> https://hng-14-stage-one-a.vercel.app/

---

## What Changed from Stage 0

| Feature      | Stage 0                    | Stage 1A                                                   |
| ------------ | -------------------------- | ---------------------------------------------------------- |
| Status       | Display only               | Interactive dropdown with 3 states                         |
| Priority     | Badge only                 | Badge + animated left border indicator                     |
| Description  | Always fully visible       | Collapsible with expand/collapse toggle                    |
| Edit mode    | Alert placeholder          | Full edit form with save/cancel                            |
| Time display | Countdown only             | Countdown + overdue indicator + "Completed" state          |
| Overdue      | Red text on time remaining | Separate overdue indicator element                         |
| Form inputs  | None                       | Title, description, priority dropdown, date + time pickers |

---

## Features

- Fully semantic HTML structure using `<article>`, `<time>`, `<ul>`, and `<button>`
- Dark mode design with a consistent CSS custom property system
- Live countdown timer updating every 60 seconds with tolerance sync
- Priority indicator — left border accent that changes colour per priority level
- Collapsible description — auto-collapses long text with an accessible expand/collapse toggle
- Status dropdown — interactive combobox with keyboard support (Enter/Space to open, click to select, outside click to close)
- Edit mode — full form that populates from current task state, saves changes, or cancels and restores
- Overdue detection — separate indicator element that appears when the due date has passed
- Completed state — timer stops and displays "Completed" when task is marked done
- Checkbox toggle synced with status dropdown and visual state
- Focus management — focus returns to the edit button when the form is closed
- Fully keyboard navigable with visible focus styles
- Responsive from 320px to 1200px

---

## File Structure

```
├── index.html       # Markup and component structure
├── styles.css       # All styling and CSS variables
└── index.js         # Component logic and interactivity
```

---

## How It Works

### HTML (`index.html`)

The page contains two `<article>` elements — the main task card (`.root`) and the edit form (`.edit`). Only one is visible at a time, toggled by JS.

**Main card structure:**

- A visually hidden `<label>` linked to the checkbox via `for`/`id`
- `<h2>` for the task title — clicking it also toggles the checkbox
- Description wrapped in a collapsible `<span>` with `data-testid="test-todo-collapsible-section"` and a matching `id`
- Expand/collapse `<button>` with `aria-expanded` and `aria-controls` pointing to the collapsible section
- `<time>` element with `datetime` attribute for the due date
- Two `<span>` elements for time remaining and overdue indicator — only one is visible at a time
- Status combobox (`role="combobox"`, `aria-haspopup="listbox"`) wrapping the status badge and a `<ul role="listbox">`
- Priority indicator `<div>` absolutely positioned as a left border accent

**Edit form structure:**

- All inputs have matching `<label for="">` elements
- Custom priority dropdown using `role="combobox"` and `role="listbox"` with full keyboard support
- Separate `<input type="date">` and `<input type="time">` for the due date
- Save and cancel buttons with `type="button"` to prevent form submission

### CSS (`styles.css`)

All colours are defined as CSS custom properties in `:root`:

```css
/* backgrounds */   --bg-base, --bg-page, --bg-elevated, --bg-hover
/* text */          --text-primary, --text-secondary, --muted
/* borders */       --border, --border-hover, --accent
/* priority */      --priority-{low|med|high}-{bg|text}
/* status */        --status-{pending|progress|done}-{bg|text}
```

**Key design decisions:**

- The priority indicator is an absolutely positioned `<div>` with `left: 0` and `height: 100%`, creating a left border accent. The card has matching `padding-left: calc(1rem + 5px)` so content is never obscured.
- Description collapse uses `-webkit-line-clamp: 3` — pure CSS truncation with no JS measurement needed. The `.collapsed` class is toggled by JS.
- Status and priority dropdowns use `.open` class toggling rather than inline `display` manipulation, keeping all styling in CSS.
- Date and time inputs use `color-scheme: dark` to theme the browser's native calendar picker, with `filter: invert(0.5)` on the picker indicator icon.
- Focus styles use `:focus-visible` throughout so keyboard users get clear outlines without affecting mouse interaction.

### JavaScript (`index.js`)

All task data lives in a single `taskInfo` object — the single source of truth:

```js
let taskInfo = {
  title: "Complete Stage 0 Task",
  desc: "...",
  priority: "medium",
  status: "pending",
  "due-date": new Date(...),
  complete: false,
};
```

#### `buildComponent()`

Reads from `taskInfo` and updates every DOM element — title, description, status badge and class, priority badge and indicator class, due date text and `datetime` attribute, checkbox state, and expand toggle visibility. Recalculates `isLong` on every call so the toggle button correctly appears or disappears after a description is edited.

#### `checkRemaining()`

Calculates time breakdown using modulo so each unit is a true component:

```js
let days = Math.floor(timeDiff / oneDay);
let hours = Math.floor((timeDiff % oneDay) / (1000 * 60 * 60));
let minutes = Math.floor((timeDiff % (oneDay / 24)) / (1000 * 60));
```

When `taskInfo.complete` is true, shows "Completed" in the done colour and returns early. When overdue, hides the time-remaining span and shows the overdue indicator. Runs on load then via a synced `setInterval`.

#### Status synchronisation

Three things always stay in sync — the checkbox, the status badge, and `taskInfo.status`. Every path that changes status sets both `taskInfo.complete` and `taskInfo.status` together, then calls `buildComponent()` and `checkRemaining()`.

#### Edit mode

Opening edit mode populates all form fields from the current `taskInfo`. Saving reads values back into `taskInfo`. Cancelling discards form values and restores the previous view. In both cases focus returns to the edit button.

#### Custom dropdowns

Both dropdowns follow the same pattern — a trigger with `aria-haspopup="listbox"` and `aria-expanded`, a hidden `<ul role="listbox">`, and a document-level click listener to close on outside click. Enter/Space opens the dropdown and the first option receives focus when the list opens.

---

## Accessibility

| Feature             | Implementation                                                         |
| ------------------- | ---------------------------------------------------------------------- |
| Checkbox label      | Visually hidden `<label>` linked via `for`/`id`                        |
| Icon buttons        | `aria-label` on each `<button>`                                        |
| Focus styles        | `:focus-visible` outline using `--accent` throughout                   |
| Live time updates   | `aria-live="polite"` on the time remaining span                        |
| Status dropdown     | `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`          |
| Priority dropdown   | Same combobox pattern with `aria-labelledby`                           |
| Expand toggle       | `aria-expanded` and `aria-controls` pointing to collapsible section id |
| Collapsible section | Matching `id` for `aria-controls` reference                            |
| Semantic structure  | `<article>`, `<h2>`, `<time>`, `<ul role="list">`, `<button>`          |
| Keyboard navigation | Tab → checkbox → status control → expand toggle → edit → delete        |
| Edit form labels    | All inputs have `<label for="">`                                       |
| Focus return        | Focus returns to edit button when form closes                          |

---

## Design Decisions

**Priority left border over dot/icon** — the border accent is visible at a glance without competing with the priority badge text. It gives the card a distinct personality per priority level.

**Separate overdue indicator** — keeping time-remaining and overdue as two separate elements makes the testid contract explicit and the JS logic easier to reason about.

**Character count for collapse threshold** — using `taskInfo.desc.length > 150` rather than measuring DOM height avoids layout thrashing and works consistently before and after fonts load.

**Split date + time inputs** — two native inputs (`type="date"` and `type="time"`) rather than `type="datetime-local"` gives better cross-browser styling control and cleaner mobile UX.

---

## Known Limitations

- The delete button shows an alert — full delete behaviour was out of scope for this stage.
- `color-scheme: dark` on date/time inputs styles the browser's native calendar popup in Chromium browsers but has no effect in Firefox, where the popup appears in the OS default theme.
- The status dropdown does not close on Escape — clicking outside or selecting an option are the two close paths.

---

## Colour Palette

| Token                    | Value     | Usage                                     |
| ------------------------ | --------- | ----------------------------------------- |
| `--bg-page`              | `#111111` | Page background                           |
| `--bg-base`              | `#0a0a0a` | Card background                           |
| `--bg-elevated`          | `#1e1e1e` | Input and dropdown backgrounds            |
| `--accent`               | `#7f77dd` | Focus rings, icons, checkbox, save button |
| `--priority-high-text`   | `#f87171` | High priority indicator and badge         |
| `--priority-med-text`    | `#fbbf24` | Medium priority indicator and badge       |
| `--priority-low-text`    | `#4ade80` | Low priority indicator and badge          |
| `--status-progress-text` | `#afa9ec` | In Progress badge                         |
| `--status-done-text`     | `#5dcaa5` | Done badge and Completed text             |

---

## Testing

All interactive elements include `data-testid` attributes:

| Element             | `data-testid`                      |
| ------------------- | ---------------------------------- |
| Card root           | `test-todo-card`                   |
| Title               | `test-todo-title`                  |
| Description         | `test-todo-description`            |
| Collapsible section | `test-todo-collapsible-section`    |
| Expand toggle       | `test-todo-expand-toggle`          |
| Priority badge      | `test-todo-priority`               |
| Priority indicator  | `test-todo-priority-indicator`     |
| Due date            | `test-todo-due-date`               |
| Time remaining      | `test-todo-time-remaining`         |
| Overdue indicator   | `test-todo-overdue-indicator`      |
| Status badge        | `test-todo-status`                 |
| Status control      | `test-todo-status-control`         |
| Checkbox            | `test-todo-complete-toggle`        |
| Tags list           | `test-todo-tags`                   |
| Work tag            | `test-todo-tag-work`               |
| Urgent tag          | `test-todo-tag-urgent`             |
| Design tag          | `test-todo-tag-design`             |
| Edit button         | `test-todo-edit-button`            |
| Delete button       | `test-todo-delete-button`          |
| Edit form           | `test-todo-edit-form`              |
| Title input         | `test-todo-edit-title-input`       |
| Description input   | `test-todo-edit-description-input` |
| Priority select     | `test-todo-edit-priority-select`   |
| Due date input      | `test-todo-edit-due-date-input`    |
| Save button         | `test-todo-save-button`            |
| Cancel button       | `test-todo-cancel-button`          |

---

## Running Locally

No build tools or dependencies required. Open `index.html` directly in a browser.

---

## Author

> HopeAda
