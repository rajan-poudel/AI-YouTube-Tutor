# AI-YouTube-Tutor
Welcome to the official GitHub Repo for AI YouTube Tutor, the ultimate Chrome extension that enhances your YouTube learning experience with AI-powered summaries, quizzes, and personalized tutoring!

---

## 🎯 GOAL:

Turn any YouTube video into a **smart learning assistant** with:

* Topics covered
* Chapter-wise summaries
* MCQ quizzes
* Key takeaways
* (Later) Chat with video

---

## 🛠 TECH STACK:

* **Frontend**: Chrome Extension (JS + TailwindCSS or React)
* **AI**: OpenAI (GPT-4 Turbo)
* **Transcript**: `youtube-transcript-api` or captions
* **Backend (optional)**: Flask or Node.js
* **Storage (optional)**: Firebase

---

## 🔧 WEEKLY PLAN:

### **Week 1:**

* Set up base Chrome extension
* Extract video ID from YouTube tab
* Fetch transcript using API

### **Week 2:**

* Use OpenAI API to generate:

  * Topics
  * Chapters + summaries
  * Key points

### **Week 3:**

* Add quiz generator (5 MCQs from transcript)
* Build a simple clean UI (popup.html)

### **Week 4:**

* Polish UI
* Fix bugs
* Optional: Add backend to hide API keys
* Test with friends

---

## ⚙️ WORKFLOW:

1. User opens YouTube → extension grabs video ID
2. Fetch transcript
3. Send to OpenAI → get topics, summary, quiz
4. Display everything inside the extension popup

---

## 📦 Features for MVP:

| Feature    | Done When...                   |
| ---------- | ------------------------------ |
| Transcript | Text fetched from video        |
| Topics     | Key points extracted           |
| Summary    | Chapters & summaries shown     |
| Quiz       | 5 MCQs shown with answers      |
| UI         | All info neatly shown in popup |

---

## 🚀 LAUNCH PLAN:

* Share demo on LinkedIn, Reddit, Discord
* Build quick landing page (Notion + Super.so)
* Get user feedback → improve
* Add “Pro” version later

---
