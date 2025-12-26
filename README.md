# Employee Management System

## Project Overview

A comprehensive employee management system built with React, TypeScript, and Node.js.

## Features

- Employee registration and profile management
- Document upload and management
- PDF generation with document merging
- Admin dashboard for employee oversight
- Real-time data persistence

## Technologies Used

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **Backend**: Node.js, Express
- **PDF Generation**: jsPDF, pdf-lib
- **File Storage**: Local file system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   cd backend
   npm install
   npm start
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

### Electron App

To build as a desktop application:

```bash
# Development
npm run electron-dev

# Build for current platform
npm run electron-build

# Build for specific platforms
npm run electron-build-win
npm run electron-build-mac
npm run electron-build-linux
```

## Project Structure

- `/src` - Frontend React application
- `/backend` - Node.js backend server
- `/public` - Static assets and Electron configuration

## License

MIT License
