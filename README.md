# Weather Dashboard & Activity Planner

**Student Name:** Sawaiz Mehboob
**Roll Number:** F24BDOCS1M01309
**Course:** Web Technologies — BSCS 4th Semester

---

## What This Project Does

A two-panel web application that displays weather data for Pakistani cities and suggests activities based on the weather condition. Built with vanilla JavaScript, HTML/CSS, and JSON Server as a mock REST backend.

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- JSON Server (mock REST API)

---

## Project Structure

project/

├── index.html      → User panel

├── admin.html      → Admin panel

├── style.css       → All styling

├── app.js          → User panel JavaScript

├── admin.js        → Admin panel JavaScript

├── db.json         → JSON Server data file

└── README.md       → This file

---

## How to Run

**Step 1 — Install JSON Server**

**Step 2 — Start JSON Server**

**Step 3 — Open the app**

Open `index.html` in your browser. JSON Server must be running or the app won't load data.

---

## Features

### User Panel (index.html)
- Displays weather cards for all cities fetched from JSON Server
- Search by city name
- Filter by weather condition
- Activity suggestions on each card based on weather condition
- Add new city via form with inline validation
- Loading and error states

### Admin Panel (admin.html)
- Displays all weather entries in a table
- 3 summary statistics — total cities, average temperature, most common condition
- Edit any entry — loads into form, saves with PUT request
- Delete any entry with confirmation dialog
- Visually distinct from user panel

---

## HTTP Methods Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /weather | Fetch all cities |
| GET | /weather/:id | Fetch single city for edit |
| POST | /weather | Add new city |
| PUT | /weather/:id | Update existing city |
| DELETE | /weather/:id | Delete a city |



