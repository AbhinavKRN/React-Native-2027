# 🚀 Quick Start Guide - Assignment 1

## Getting Started in 5 Minutes

### Step 1: Setup Backend (2 minutes)

```bash
# Navigate to server folder
cd server

# Install dependencies (if not already done)
npm install

# Create .env file
# Copy contents from env.example.txt and create a file named .env
# Update MONGODB_URI if needed

# Seed the database
npm run seed

# Start the server
npm start
```

✅ Server should be running on `http://localhost:5000`

---

### Step 2: Update Frontend API URL (1 minute)

Open `app/(main)/home.tsx` and update line ~27:

```typescript
// For Android Emulator
const API_BASE = "http://10.0.2.2:5000/api";

// For iOS Simulator  
const API_BASE = "http://localhost:5000/api";

// For Physical Device (replace with YOUR computer's IP)
const API_BASE = "http://192.168.1.XXX:5000/api";
```

**Find Your IP:**
- Windows: Run `ipconfig` in terminal
- Mac/Linux: Run `ifconfig` or `ip addr`

---

### Step 3: Run the App (2 minutes)

```bash
# Go back to project root
cd ..

# Start Expo
npx expo start

# Press 'a' for Android or 'i' for iOS
# Or scan QR code with Expo Go app
```

---

## ✅ What Was Implemented

### Backend (Server)
- ✅ Product model with Mongoose (`server/models/product.model.js`)
- ✅ Three API endpoints (`server/routes/product.routes.js`):
  - GET `/api/products` - List all products
  - GET `/api/products/:id` - Get single product
  - POST `/api/products` - Create new product
- ✅ Database seed script with 8 products (`server/seed.js`)
- ✅ Updated server to include product routes (`server/index.js`)

### Frontend (React Native)
- ✅ Updated home screen to fetch from API (`app/(main)/home.tsx`)
- ✅ Loading state with spinner
- ✅ Error handling with retry button
- ✅ Display products with images from Unsplash
- ✅ Add to cart functionality
- ✅ Refresh button to reload products

### Documentation
- ✅ Comprehensive assignment guide (`assignment-1.md`)
- ✅ Environment configuration guide (`server/env.example.txt`)
- ✅ This quick start guide

---

## 🧪 Test the API

Open a new terminal and test:

```bash
# List all products
curl http://localhost:5000/api/products

# Search products
curl "http://localhost:5000/api/products?q=apple"

# Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99,"category":"Fruits","stock":10}'
```

---

## 🐛 Troubleshooting

**Problem**: App can't connect to backend  
**Solution**: Check API_BASE URL, ensure server is running, check firewall

**Problem**: MongoDB connection error  
**Solution**: Ensure MongoDB is running or use MongoDB Atlas

**Problem**: Images not loading  
**Solution**: Check internet connection, images use Unsplash CDN

---

## 📖 Full Documentation

For complete details, see: `assignment-1.md`

---

**Total Setup Time**: ~5-10 minutes  
**Files Created/Modified**: 6 backend + 1 frontend + 3 docs  
**API Endpoints**: 3  
**Sample Products**: 8  
**Ready to Demo**: ✅ YES

