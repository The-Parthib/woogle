# Woogle

> Read your WhatsApp chats beautifully.

Woogle is a privacy-first web app that lets you visualise exported WhatsApp chat files in a clean, dark-themed conversational interface — no server, no uploads, everything runs in the browser.

---

## Features

- **Drag & drop** or click-to-upload a `.txt` WhatsApp export
- **Conversational view** — sent and received bubbles, date separators, and system messages
- **Jump to Date** — calendar picker to instantly navigate to any day in the chat
- **Group chat support** — colour-coded sender names
- **Skeleton loading** — smooth shimmer while parsing large files
- **Scroll shortcuts** — jump to top or bottom from any position
- **Fully mobile-responsive**

---

## How to Use

Export your chat from WhatsApp:

```
Open WhatsApp → Open a chat → ⋮ Menu → More → Export Chat → Without Media
```

Save the `.txt` file, then upload it to Woogle.

### Read & navigate

- Scroll through your chat from the beginning
- Tap the **calendar icon** in the header to jump to any date
- Use the **↑ ↓ buttons** (bottom-right) to jump to the top or latest message

---

## Running Locally

**Requirements:** Node.js ≥ 18, pnpm

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

---

## Project Structure

```
src/
├── App.jsx                  # Screen state machine (landing → upload → chat)
├── components/
│   ├── LandingScreen.jsx    # Hero / entry screen
│   ├── FileUpload.jsx       # File picker with drag-and-drop
│   ├── ChatScreen.jsx       # Main chat viewer
│   ├── ChatBubble.jsx       # Individual message bubble
│   ├── DateSeparator.jsx    # Day divider pill
│   ├── SystemMessage.jsx    # WhatsApp system event label
│   ├── DatePickerSheet.jsx  # Jump-to-date bottom sheet
│   ├── ChatSkeleton.jsx     # Shimmer placeholder during parsing
│   └── Icons.jsx            # Inline SVG icon components
└── utils/
    ├── parseChat.js         # .txt → structured message array
    └── formatters.js        # Date, time, and file size helpers
```

---

## Privacy

All processing happens **locally in your browser**. Your chat file is never sent to any server.

---

## Tech Stack

- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
