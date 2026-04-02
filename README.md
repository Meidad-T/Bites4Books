# AI-README: Bites2Books Web App

## 📌 Project Overview

Bites2Books is a **supportive, reward-based web app** designed to encourage positive daily habits through a gentle points system. The core idea is simple:

* User logs a completed action (e.g., eating)
* They earn **points**
* Points contribute toward **unlocking books (rewards)**

The tone of the app must remain:

* Supportive (not pressuring)
* Positive (celebrating effort, not enforcing behavior)
* Clean and minimal (low cognitive load)

---

## 🎯 Target UX Style

Design inspiration:

* Clean, modern, minimal
* Smooth animations
* Visually similar in polish to the Starbucks website/app

Key characteristics:

* Soft color palette (no harsh reds or aggressive tones)
* Rounded UI elements
* Clear hierarchy
* Friendly and encouraging language

---

## 🏠 Home Page (Main Dashboard)

### 1. Greeting Section

* Large, bold text at the top:

  ```
  Hello MaiMai!
  ```
* This should feel warm and personal

---

### 2. Points + Progress Bar

* A **large, thick progress bar** with:

  * Rounded corners
  * Smooth animation when progressing
* Display:

  * Current points (starting at **10 points**)
  * Milestones (example: 25, 50, 100 points)

#### Behavior:

* Progress bar fills based on current points
* Milestones visually marked (small indicators or dots)
* Optional glow or highlight when milestone is reached

---

### 3. Action Button (Core Interaction)

* Primary CTA:

  * Example: **“I did it”** or **“Log Progress”**
* On click:

  * Adds points (configurable)
  * Triggers:

    * Animation (confetti, glow, or subtle bounce)
    * Encouraging message

---

### 4. Hero Section

A visually appealing section explaining the purpose of the app.

Include:

* Title (e.g. “Small Steps, Big Stories”)
* Short description:

  * Reinforce positivity and growth
* Optional:

  * Rotating “news” or updates
  * Motivational messages

---

## 🔍 Explore Page (Books)

### Goal:

Allow browsing and discovering books.

---

### 📚 Data Source (IMPORTANT)

Use a **free, no-key or free-tier forever API**:

Recommended:

* Open Library API (https://openlibrary.org/developers/api)

---

### Features:

* Fetch books dynamically
* Categorize by:

  * Genre (Fantasy, Romance, Mystery, etc.)
* Provide:

  * Search bar
  * Genre filters

---

### UI Layout:

* Grid of book cards
* Each card includes:

  * Cover image
  * Title
  * Author

---

### Actions:

* “Add to Wishlist” button

  * Saves book to local state/storage
  * Visual feedback (icon change, animation)

---

## ❤️ Wishlist Page

### Purpose:

Display saved books the user wants to redeem later.

---

### Features:

* Show all added books
* Same card layout as Explore
* Ability to:

  * Remove from wishlist
  * (Future) Redeem using points

---

## 💾 Data Storage

For now:

* Use **localStorage** (simple + persistent)

Store:

* Points
* Wishlist
* Progress state

---

## ⚙️ Future Considerations

(Do NOT implement yet, but structure code to allow)

* Authentication (user accounts)
* Cloud database
* Push notifications
* Reward redemption system
* Multiple reward types (not just books)

---

## 🎨 Design Requirements

* Rounded corners everywhere (buttons, cards, progress bars)
* Smooth transitions (CSS animations)
* Mobile-first design
* Clean spacing and padding
* No clutter

---

## 🧠 Tone & Language Guidelines

DO:

* Encourage effort
* Use soft, positive wording
* Celebrate small wins

DO NOT:

* Use guilt-based messaging
* Mention weight, calories, or body metrics
* Create pressure or urgency

---

## 🧩 Suggested Tech Stack

* HTML
* CSS (or Tailwind for speed)
* JavaScript (Vanilla or React)

Optional:

* Service Worker (for PWA support)
* IndexedDB (if scaling beyond localStorage)

---

## 🚀 MVP Scope (What to Build First)

1. Home page

   * Greeting
   * Points system
   * Progress bar
   * Button to add points

2. Explore page

   * Fetch books from API
   * Display + filter

3. Wishlist page

   * Add/remove books
   * Persist data

---

## 💡 Core Principle

This is NOT just a rewards app.

It is:

> A gentle, supportive companion that turns small efforts into meaningful rewards.

Every design and code decision should reflect that.

---

## END
