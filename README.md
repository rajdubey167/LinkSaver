# LinkSaver

A modern web application for saving and organizing your bookmarks with features like tags, summaries, and drag-and-drop reordering.

## Features

- Save bookmarks with automatic title and summary extraction
- Organize bookmarks with tags
- Drag and drop reordering
- Search and filter bookmarks
- Sort by date or title
- Responsive design
- User authentication

## Tech Stack

- Frontend:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - DND Kit for drag and drop

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development servers:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd frontend
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

- Frontend is deployed on Vercel
- Backend requires a separate deployment with MongoDB database

## License

MIT 