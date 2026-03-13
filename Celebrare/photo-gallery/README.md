# Photo Gallery Web App

A responsive photo gallery built with React, Vite, and Tailwind CSS. Features real-time search, favourites with localStorage persistence, and optimized performance.

## Features

- 📸 Fetches 30 photos from Picsum Photos API
- 🔍 Real-time search filter by author name
- ❤️ Mark photos as favourites (persists across page refreshes)
- 📱 Responsive grid layout (1/2/3/4 columns based on screen size)
- ⚡ Performance optimized with useCallback and useMemo
- 🎣 Custom hook for data fetching
- 🔄 Loading and error states

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 3.3
- JavaScript (ES6+)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Gallery.jsx       # Main gallery component
│   ├── PhotoCard.jsx     # Individual photo card
│   ├── SearchBar.jsx     # Search input
│   ├── Loading.jsx       # Loading spinner
│   └── Error.jsx         # Error message
├── hooks/
│   └── useFetchPhotos.js # Custom hook for API calls
├── reducers/
│   └── favouritesReducer.js # Reducer for favourites state
├── App.jsx
└── main.jsx
```

## Key Implementation Details

### Custom Hook: useFetchPhotos
Encapsulates API fetch logic and returns `{ photos, loading, error }`.

### State Management
- Uses `useReducer` for managing favourites (TOGGLE_FAVOURITE, LOAD_FAVOURITES actions)
- localStorage for persistence across sessions

### Performance Optimization
- `useCallback` on search handler to prevent unnecessary re-renders
- `useMemo` to compute filtered photo list only when dependencies change

## API

Uses [Picsum Photos API](https://picsum.photos/) - a free service providing placeholder images.
