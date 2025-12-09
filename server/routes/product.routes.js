import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    
    const products = await Product.find(filter).limit(100);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: err.message 
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: err.message 
    });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        error: 'Name and price are required fields'
      });
    }
    
    const product = new Product({ 
      name, 
      price, 
      imageUrl, 
      category, 
      description, 
      stock 
    });
    
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ 
      success: false,
      error: 'Bad request', 
      details: err.message 
    });
  }
});

export default router;

