# FGS Staffing Agency - Client Portal

This is the client portal for the FGS Staffing Agency management system, built using Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Secure login and registration for clients
- **Client Dashboard**: Overview of current staff, subscriptions, and account details
- **Staff Directory**: Browse available staff and make selections
- **Staff Hiring**: Request staff for specific roles
- **Subscription Management**: View, upgrade, or cancel subscription plans
- **Profile Management**: Update client information

## Prerequisites

- Node.js (v16 or higher)
- A Supabase account

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd client-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env.local` file in the root of the project with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
client-portal/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── auth/          # Authentication pages
│   │   ├── clients/       # Client area pages
│   │   │   ├── dashboard/ # Client dashboard
│   │   │   ├── hiring/    # Staff hiring
│   ├── lib/               # Utility functions and libraries
│   │   └── supabase.ts    # Supabase client
│   ├── components/        # Reusable components
│   ├── middleware.ts      # Auth middleware
├── public/                # Static assets
```

## Database Schema

The application uses the following Supabase tables:

### Clients
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `email`: String
- `name`: String
- `phone`: String
- `status`: String (active, inactive)
- `subscription_id`: UUID (foreign key to subscriptions table)

### Staff
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `name`: String
- `position`: String
- `experience`: Number
- `salary`: Number
- `available`: Boolean
- `bio`: Text
- `image_url`: String

### Subscriptions
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `plan_id`: String
- `client_id`: UUID (foreign key to clients table)
- `status`: String (active, canceled, pending)
- `current_period_end`: Timestamp

## Deployment

This project can be easily deployed to Vercel or Netlify:

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## License

This project is licensed under the MIT License.
