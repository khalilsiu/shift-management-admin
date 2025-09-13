# Evercare Admin Panel

A Next.js 15 application with Server-Side Rendering (SSR), Redux Toolkit, Tailwind CSS, and Zod validation.

## 🚀 Tech Stack

- **Next.js 15** with App Router - Latest React framework with SSR support
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Redux Toolkit** - State management with React Redux
- **Zod** - Schema validation and type inference
- **ESLint** - Code linting and formatting

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Redux Provider
│   ├── page.tsx            # Main page with SSR demonstration
│   └── globals.css         # Global styles
├── components/
│   └── Counter.tsx         # Redux counter demo component
└── lib/
    ├── features/
    │   └── counterSlice.ts  # Redux slice example
    ├── hooks.ts            # Typed Redux hooks
    ├── schemas.ts          # Zod validation schemas
    ├── store.ts            # Redux store configuration
    └── StoreProvider.tsx   # Client-side Redux provider
```

## 🛠️ Setup Complete

### ✅ Next.js 15 with App Router
- Server-Side Rendering (SSR) configured
- TypeScript support enabled
- Modern React 19 features

### ✅ Redux Toolkit Integration
- Store configured with proper TypeScript types
- Client-side provider component
- Example counter slice with actions
- Typed hooks for useSelector and useDispatch

### ✅ Tailwind CSS v4
- Latest version configured
- Responsive design utilities
- Custom styling examples

### ✅ Zod Schema Validation
- User and Shift schemas defined
- Type inference from schemas
- Runtime validation examples

## 🚀 Getting Started

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Key Features Implemented

### Server-Side Rendering
- Data fetching with `fetch()` and `cache: 'no-store'`
- Zod validation on server-rendered data
- SEO-friendly HTML generation

### Redux State Management
- Counter example with increment/decrement actions
- Proper TypeScript integration
- Client-side state hydration

### Schema Validation
- User and Shift data models
- Runtime type checking
- Type inference for development

## 🎯 Ready for Evercare Development

The foundation is now set for building the Evercare admin panel with:
- Shifts listing and management
- Search functionality
- Multi-select operations
- Real-time updates
- Responsive design

Start building your features by adding new components, Redux slices, and API routes as needed!