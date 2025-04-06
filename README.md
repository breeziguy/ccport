# Crescent Client Portal

A modern client portal application built with Next.js 15, Tailwind CSS, and Supabase for authentication and database services. This application allows clients to browse available staff, view detailed profiles, request staff, and manage their client profile.

## Features

- 🔒 Authentication with Supabase Auth
- 👤 Client profile management
- 🔍 Staff discovery and filtering
- 📋 Staff detail pages
- 📱 Responsive design for all devices
- 🌗 Light and dark mode support
- 🚀 Fast and modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **UI Components**: Shadcn UI
- **Deployment**: Vercel (recommended)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ccport.git
   cd ccport
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder Structure

- `src/app` - Next.js app router pages
- `src/components` - UI components
- `src/context` - React context providers
- `src/lib` - Utility functions and types
- `src/middleware.ts` - Next.js middleware for authentication

## License

[MIT](LICENSE)
