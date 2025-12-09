import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery_homework';

const seedProducts = [
  { 
    name: 'Red Apple', 
    price: 40, 
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', 
    category: 'Fruits', 
    stock: 50, 
    description: 'Fresh red apples, crisp and juicy' 
  },
  { 
    name: 'Banana Bunch', 
    price: 30, 
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', 
    category: 'Fruits', 
    stock: 100,
    description: 'Fresh yellow bananas, perfect for smoothies' 
  },
  { 
    name: 'Spinach Pack', 
    price: 20, 
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', 
    category: 'Vegetables', 
    stock: 70,
    description: 'Fresh organic spinach, rich in iron' 
  },
  { 
    name: 'Milk 1L', 
    price: 50, 
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', 
    category: 'Dairy', 
    stock: 200,
    description: 'Fresh full cream milk' 
  },
  { 
    name: 'Paneer 200g', 
    price: 120, 
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', 
    category: 'Dairy', 
    stock: 40,
    description: 'Fresh homemade paneer, high protein' 
  },
  { 
    name: 'Carrot kg', 
    price: 35, 
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', 
    category: 'Vegetables', 
    stock: 80,
    description: 'Fresh carrots, rich in vitamin A' 
  },
  { 
    name: 'Fresh Tomatoes', 
    price: 45, 
    imageUrl: 'https://images.unsplash.com/photo-1546470427-227a26e6eb51?w=400', 
    category: 'Vegetables', 
    stock: 90,
    description: 'Fresh red tomatoes, perfect for cooking' 
  },
  { 
    name: 'Green Grapes', 
    price: 80, 
    imageUrl: 'https://images.unsplash.com/photo-1599819177-38c338a4c1c7?w=400', 
    category: 'Fruits', 
    stock: 60,
    description: 'Sweet and seedless green grapes' 
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB — seeding...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Insert seed products
    const products = await Product.insertMany(seedProducts);
    console.log(`✅ Seed complete: ${products.length} products created`);
    
    // Display created products
    console.log('\n📦 Created Products:');
    products.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} - ₹${p.price} (${p.category}) - Stock: ${p.stock}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

