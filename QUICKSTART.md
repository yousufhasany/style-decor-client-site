# 🚀 Quick Start Guide - StyleDecor Client

## What's Been Built

A complete, production-ready React application with:

### ✅ Pages Created
1. **Home** - Animated hero, services grid, top decorators section
2. **Services** - Full filtering system (search, type, budget range)
3. **Service Details** - Detailed view with booking form
4. **Register** - Email/password + Google auth, profile image upload
5. **Login** - Email/password + Google auth
6. **Dashboard** - User stats, booking management (protected route)
7. **Contact** - Contact form with info cards

### ✅ Features Implemented
- ✨ **Framer Motion animations** throughout
- 🔐 **Firebase Authentication** (email + Google)
- 🎨 **Tailwind CSS + DaisyUI** styling
- 🔒 **Protected routes** for authenticated users
- 📱 **Fully responsive** mobile-first design
- 🖼️ **Image upload** (ImgBB/Cloudinary)
- 📊 **User dashboard** with stats and bookings
- 🔍 **Advanced filtering** (search + filters)
- 🎯 **Auto-fill forms** for logged-in users
- 🍞 **Toast notifications** for user feedback

### ✅ Components Created
- `Navbar` - With auth dropdown and profile menu
- `Footer` - Site footer
- `ProtectedRoute` - Route protection HOC
- `AuthContext` - Firebase auth state management

## 📋 Environment Setup

1. **Create `.env` file** (copy from `.env.example`):
\`\`\`env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_IMGBB_API_KEY=your_key_here
\`\`\`

2. **Get ImgBB API Key** (for profile images):
   - Go to https://api.imgbb.com/
   - Sign up and get your API key
   - Add it to `.env`

## 🏃 Running the App

\`\`\`bash
# Development server
npm run dev
# Opens at http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
\`\`\`

## 🧪 Testing Without Backend

The app includes **mock data** for development, so you can test all features without a backend server:

- Services listing will show sample services
- Service details will display mock service info
- Dashboard will show sample bookings
- Top decorators section will show mock data

## 🔑 Firebase Authentication

**Already configured!** The app uses a pre-configured Firebase project with:
- ✅ Email/Password authentication
- ✅ Google OAuth
- ✅ Profile management

You can test with:
- Register a new account
- Or use Google Sign-In

## 📱 Testing the Features

### 1. Browse Services
- Go to `/services`
- Try the search bar
- Use type filter dropdown
- Adjust budget slider

### 2. Book a Service
- Click any service card
- Click "View Details"
- If not logged in, you'll be redirected to login
- After login, the booking form auto-fills with your info
- Fill event details and submit

### 3. User Dashboard
- After logging in, click your profile icon
- Select "Dashboard" or go to `/dashboard`
- View your stats and bookings

### 4. Profile Management
- Click your profile picture in navbar
- View profile dropdown with user info
- Logout option available

## 🎨 Customization

### Change Primary Color
Replace `purple-600` with your color throughout:
- Navbar: `bg-purple-600`
- Buttons: `bg-purple-600 hover:bg-purple-700`
- Links: `text-purple-600`

### Update Logo/Branding
Edit `src/components/Navbar.jsx`:
\`\`\`jsx
<span className="text-xl font-bold">YourBrand</span>
\`\`\`

### Modify Services
When backend is ready, remove mock data from:
- `src/pages/Home.jsx`
- `src/pages/Services.jsx`
- `src/pages/ServiceDetails.jsx`

## 🔗 Backend API Requirements

The app expects these endpoints:

\`\`\`
GET    /services              - List all services
GET    /services/:id          - Get single service
POST   /bookings              - Create booking
GET    /bookings/user/:userId - Get user's bookings
POST   /users                 - Create user record
GET    /decorators/top        - Get top decorators
POST   /contact               - Send contact message
\`\`\`

## 🐛 Common Issues

### "Unknown at rule @tailwind"
- This is a false positive from VS Code
- The build works fine (Tailwind is properly configured)

### Images not uploading
- Check ImgBB API key in `.env`
- Ensure file size < 5MB
- Verify internet connection

### Authentication errors
- Firebase is already configured
- Check browser console for specific errors
- Ensure popups are not blocked (for Google Sign-In)

## 📦 What's Next?

1. **Connect Backend**: Update `VITE_API_BASE_URL` to your API
2. **Remove Mock Data**: Once API is working, remove fallback data
3. **Add More Features**: Reviews, favorites, payment integration
4. **Deploy**: Build and deploy to Vercel/Netlify

## 🎉 You're All Set!

Run `npm run dev` and start exploring your new application!

---

**Need help?** Check the full documentation in `PROJECT_README.md`
