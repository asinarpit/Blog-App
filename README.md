# Blog Application

A modern blog application with React, Typescript, Node.js, Express, and MongoDB.

## Features

- Blog listing with filters
- Category filtering
- Search functionality
- Blog detail view
- Like/Comment system
- User authentication
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:

```
git clone <repository-url>
cd blog-app
```

2. Install dependencies for both frontend and backend:

```
cd backend
npm install
cd ../frontend
npm install
```

3. Set up environment variables:

   - Create a `.env` file in the backend directory (see `.env.example` for required variables)
   - Create a `.env` file in the frontend directory with `VITE_API_BASE_URL=http://localhost:8000/api`

4. Start the application:

   - On Windows, simply run the `start.bat` file by double-clicking it
   - OR run the following commands in separate terminal windows:

     ```
     # Terminal 1
     cd backend
     npm run dev

     # Terminal 2
     cd frontend
     npm run dev
     ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api

## Using the Blog Page

The new Blog page (`/blogs`) features:

- A search bar to find blogs by title or content
- Category filters to filter blogs by topic
- Sorting options (newest, oldest, most popular)
- Responsive design for mobile and desktop

Enjoy exploring the blogs!
