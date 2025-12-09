import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// GET /api/products - Get all products (with pagination, search, category filter)
router.get('/', async (req, res) => {
  try {
    const { q, category, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    // Search by name
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination info
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);
    
    // Fetch products with pagination
    const products = await Product.find(filter)
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 }); 
    
    res.json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: pageNum,
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

// PUT /api/products/:id - Update a product
router.put('/:id', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, imageUrl, category, description, stock },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ 
      success: false,
      error: 'Bad request', 
      details: err.message 
    });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: err.message 
    });
  }
});

export default router;

