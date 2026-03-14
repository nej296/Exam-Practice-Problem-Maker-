# Exam Scheduler and Practice Problems

A study tool for scheduling exams and creating practice problem sets. Organize classes by semester, add exams with dates and locations, build practice sets with multiple question types, attach PDFs per question, and study using flashcards, quiz mode, or timed practice exams.

## Features

### Exam Scheduler
- Organize classes by semester (e.g., Spring 2026, Fall 2026)
- Add multiple exams per class with date, time, and location
- View all exams at a glance in a semester grid

### Practice Problem Creator
- Create practice sets for any class
- **Question types:** Open-ended, Multiple Choice (A–D), True/False
- **Per-question PDF import:** Attach a PDF to each question and/or answer for reference
  - Import PDF for "What should this question ask?"
  - Import PDF for "What is the correct answer?" (all question types)
- PDFs are displayed inline when studying

### Study Modes
- **Flashcards** — Flip through questions one at a time, reveal answers on click
- **Quiz Mode** — Answer questions one by one, get scored at the end, review missed questions
- **Practice Exam with Timer** — Timed exam simulation with countdown, question navigator, and score summary

### Data Storage
- All data stored in browser `localStorage` (no backend required)
- Data persists across sessions

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Lucide React | Icons |

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/nej296/Exam-Practice-Problem-Maker-.git
cd Exam-Practice-Problem-Maker-
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                 # Routes and app shell
├── main.tsx
├── components/
│   ├── layout/             # Header, PageContainer, Modal
│   ├── scheduler/          # Semester grid, class cards, exam management
│   ├── practice/           # Class selector, problem creator, study mode selector
│   └── study/              # Flashcards, Quiz, Practice Exam modes
├── context/
│   └── AppContext.tsx      # Global state and actions
├── types/
│   └── index.ts            # TypeScript interfaces
└── utils/
    ├── storage.ts          # localStorage load/save
    └── helpers.ts          # ID generation, shuffle, etc.
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Redirects to `/scheduler` |
| `/scheduler` | Semester grid — view all semesters and classes |
| `/scheduler/:semesterId` | Semester detail — classes, exams, practice sets |
| `/practice` | Select a class to create practice problems |
| `/practice/:semesterId/:classId` | Create practice problems for a class |
| `/practice/:semesterId/:classId/success` | After creating — choose study mode |
| `/study/:semesterId/:classId/:setId` | Select study mode (flashcards, quiz, timed exam) |
| `/study/:semesterId/:classId/:setId/session` | Active study session |

## Data Model

- **Semester** — Contains classes (e.g., Spring 2026)
- **Class** — Name, optional instructor, exams, practice sets
- **Exam** — Label, date, time, location
- **Practice Set** — Name, list of problems
- **Problem** — Type (open-ended / multiple-choice / true-false), question text, answer, optional PDFs per question and answer

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## License

MIT
