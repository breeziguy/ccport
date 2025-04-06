# Next.js to React + Vite Conversion Plan

## Why Convert?
- **Port conflict issues**: The logs show continuous port conflicts (3000-3010)
- **Webpack cache errors**: Multiple "Caching failed for pack" errors
- **Missing dependency errors**: Issues with components like `@radix-ui/react-dialog`
- **bolt.new compatibility**: Vite is better supported by bolt.new than Next.js

## Conversion Steps

### 1. Setup New Vite Project
```bash
# Create a new Vite project with React + TypeScript
npm create vite@latest ccport-vite -- --template react-ts

# Navigate to the new project
cd ccport-vite

# Install core dependencies
npm install
```

### 2. Migrate Dependencies
```bash
# UI components and styling
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-radio-group
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @tailwindcss/typography tailwindcss-animate

# Auth and data
npm install @supabase/supabase-js
npm install react-router-dom
```

### 3. Project Structure Setup
```bash
# Create necessary directories
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/context
mkdir -p src/pages
mkdir -p src/assets
```

### 4. Core Files Migration

#### 4.1. Configuration Files
- Copy and adapt `tailwind.config.js`
- Create `postcss.config.js`
- Setup routing with `react-router-dom` instead of App Router

#### 4.2. Core Libraries
- Migrate `src/lib/supabase.ts`
- Migrate `src/lib/types.ts`
- Migrate `src/lib/utils.ts`
- Adapt `src/lib/auth.ts` to work without Next.js APIs

#### 4.3. UI Components
- Migrate all UI components from `/components/ui`
- Ensure proper imports for Radix UI components
- Create any missing components

### 5. Feature Migration

#### 5.1. Authentication
- Replace Next.js authentication with React Router + Supabase auth
- Convert auth context to work with React Router
- Create login/register pages as React components

#### 5.2. Pages to Routes
- Convert `/app/clients/dashboard` to React Router routes
- Convert `/app/clients/discover` to React Router routes
- Convert profile pages to React Router routes

#### 5.3. API Connection
- Replace server components with client-side data fetching
- Create custom hooks for data operations

### 6. Testing & Fixes

- Test authentication flow
- Test navigation between pages
- Test data fetching operations
- Fix any styling issues

### 7. Deployment

- Update README with new setup instructions
- Configure for bolt.new deployment

## Specific Issues to Address

1. Missing components:
   - Fix `dialog.tsx` dependency on `@radix-ui/react-dialog`
   - Fix `dropdown-menu.tsx` dependency on `@radix-ui/react-dropdown-menu`
   - Fix `select.tsx` dependency issues in profile completion page

2. Database integration:
   - Ensure proper client table integration (not clients)
   - Fix all database schema mismatches

3. Authentication:
   - Fix profile completion redirects
   - Handle expired token errors better

## Bolt.new Advantages

- Better hot module replacement
- No port conflicts (uses Vite's default behavior)
- Faster development experience
- Single-page application architecture
- Easier deployment 