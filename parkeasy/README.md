# ParkEasy Hyderabad 🅿️

Real-time parking finder for Hyderabad, India with 40+ locations, simulated live availability, crowdsource reporting, and peer-to-peer spot listing.

## Quick Start

### Prerequisites
- Node.js >= 18

### Install
```bash
cd parkeasy
mkdir -p backend/uploads
npm run install:all
```

### Run (starts both frontend + backend)
```bash
npm run dev
```

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

## Features

* 🗺️ Interactive map with color-coded parking pins (green/yellow/red)
* 📊 Simulated real-time availability based on time, day, and area type
* 📢 Crowdsource: report parking as Available / Filling / Full
* 🏠 List your private parking spot (P2P) with photo upload
* 🔍 Search, filter by type/status/price, sort by distance/price/availability
* 📍 "Near Me" geolocation support
* 📱 Fully mobile-responsive with bottom sheet UI
* 🌙 Dark mode UI with smooth animations

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/parkings | All parkings with live availability |
| GET | /api/parkings/:id | Single parking detail |
| POST | /api/parkings/:id/report | Submit crowd report { status } |
| POST | /api/listings | List a P2P spot (multipart form) |
| GET | /api/listings | All P2P listings |
| GET | /api/stats | Dashboard stats |

## Tech Stack

React 18 + Vite | Express.js | react-leaflet + OpenStreetMap | Tailwind CSS | Framer Motion
