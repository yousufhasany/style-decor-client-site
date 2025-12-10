# StyleDecor - Smart Home & Decoration Services Platform

A modern, full-featured web application for booking smart home automation and decoration services. Built with React, Firebase, Framer Motion, and Tailwind CSS.

## 🚀 Features

### ✨ User Features
- **Animated Home Page** - Beautiful hero section with Framer Motion animations
- **Dynamic Services Listing** - Browse all decoration and smart home services
- **Advanced Filtering** - Search by name, filter by type, and set budget range
- **Service Details** - Detailed view with booking functionality
- **User Authentication** - Firebase auth with email/password and Google Sign-In
- **Profile Management** - Upload profile pictures to ImgBB/Cloudinary
- **User Dashboard** - View bookings, stats, and manage appointments
- **Responsive Design** - Mobile-first design using Tailwind CSS + DaisyUI

### 🔐 Authentication
- Email/Password registration and login
- Google OAuth integration
- Profile picture upload (ImgBB/Cloudinary)
- Protected routes for authenticated users
- Auto-fill booking forms for logged-in users

### 📱 Pages
1. **Home** - Hero section, featured services, top decorators, CTA sections
2. **Services** - Grid view with search, filters (type, budget), and sorting
3. **Service Details** - Full service info, booking form, decorator profile
4. **Contact** - Contact form with info cards and social media links
5. **Dashboard** - User stats, booking history, profile management
6. **Register/Login** - Auth pages with Google Sign-In option

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0, Vite
- **Routing**: React Router DOM 7.10.1
- **Styling**: Tailwind CSS 4.1.17, DaisyUI 5.5.8
- **Animations**: Framer Motion
- **Authentication**: Firebase 12.6.0
- **HTTP Client**: Axios 1.13.2
- **Notifications**: React Hot Toast
- **Image Upload**: ImgBB API / Cloudinary

## 📦 Installation

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd client
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Configure environment variables**

Create a \`.env\` file in the root directory:

\`\`\`env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# ImgBB API Key (for image uploads)
VITE_IMGBB_API_KEY=your_imgbb_api_key_here

# Firebase Configuration (already configured)
# If you want to use your own Firebase project, update config/firebase.js
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
\`\`\`

The app will open at \`http://localhost:5173\`

## 🔧 Configuration

### Firebase Setup
Firebase is already configured in \`src/config/firebase.js\`. If you want to use your own Firebase project:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Update the config in \`src/config/firebase.js\`

### Image Upload
The app supports image uploads via ImgBB. To enable:

1. Get an API key from [ImgBB](https://api.imgbb.com/)
2. Add it to your \`.env\` file as \`VITE_IMGBB_API_KEY\`

Alternatively, you can configure Cloudinary in \`src/pages/Register.jsx\`.

### Backend API
The app expects a backend API at \`http://localhost:3000/api\`. Update \`VITE_API_BASE_URL\` in your \`.env\` to point to your backend server.

#### Expected API Endpoints:
- \`GET /services\` - Get all services
- \`GET /services/:id\` - Get single service
- \`GET /decorators/top\` - Get top decorators
- \`POST /bookings\` - Create a booking
- \`GET /bookings/user/:userId\` - Get user bookings
- \`POST /users\` - Create user record
- \`POST /contact\` - Send contact message

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── Navbar.jsx          # Navigation with auth dropdown
│   ├── Footer.jsx          # Footer component
│   └── ProtectedRoute.jsx  # Route protection HOC
├── contexts/
│   └── AuthContext.jsx     # Firebase auth context
├── pages/
│   ├── Home.jsx            # Landing page with animations
│   ├── Services.jsx        # Services listing with filters
│   ├── ServiceDetails.jsx  # Single service view + booking
│   ├── Contact.jsx         # Contact form
│   ├── Dashboard.jsx       # User dashboard
│   ├── Register.jsx        # Registration with image upload
│   ├── Login.jsx           # Login page
│   ├── About.jsx           # About page
│   └── NotFound.jsx        # 404 page
├── services/
│   └── api.js              # Axios instance + API methods
├── config/
│   └── firebase.js         # Firebase configuration
└── styles/
    └── custom.css          # Custom styles
\`\`\`

## 🎨 Customization

### Colors
Primary color is purple (\`#9333ea\`). To change:
1. Update Tailwind config in \`tailwind.config.js\`
2. Replace \`purple-600\` classes throughout the app

### Logo
Update the logo in \`Navbar.jsx\`:
\`\`\`jsx
<span className="text-xl font-bold text-gray-900">YourBrand</span>
\`\`\`

### Mock Data
The app includes mock data for development when the backend is unavailable. Remove the fallback mock data once your API is ready.

## 🚀 Build for Production

\`\`\`bash
npm run build
\`\`\`

The build files will be in the \`dist\` folder.

## 📝 Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint

## 🔑 Key Features Implementation

### Authentication Flow
1. User registers with email/password or Google
2. Profile image uploaded to ImgBB
3. Firebase creates auth user
4. Backend API creates user record
5. User redirected to home/dashboard

### Booking Flow
1. User browses services
2. Clicks "View Details" on a service
3. If not logged in, redirected to login
4. If logged in, booking form is pre-filled
5. User submits booking
6. Booking saved to backend
7. User redirected to dashboard

### Service Filtering
- Text search across title and description
- Filter by service type (Wedding, Birthday, etc.)
- Budget range slider (₹0 - ₹50,000)
- Real-time results update

## 🐛 Troubleshooting

### Firebase Auth Issues
- Ensure Firebase config is correct
- Check Firebase Console for enabled auth methods
- Verify domain is whitelisted in Firebase

### Image Upload Fails
- Verify ImgBB API key is correct
- Check file size (must be < 5MB)
- Ensure internet connection

### API Errors
- Check backend server is running
- Verify \`VITE_API_BASE_URL\` is correct
- Check browser console for CORS issues

## 📄 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@styledecor.com or open an issue on GitHub.

---

Built with ❤️ using React, Firebase, and Tailwind CSS
