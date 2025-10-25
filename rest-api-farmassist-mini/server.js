// FarmAssist Mini - REST API Server
// This is a complete REST API for managing farm products

// Import required modules
const express = require('express');
const cors = require('cors');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

/**
 * Middleware are functions that process requests before they reach route handlers
 * 
 * CORS (Cross-Origin Resource Sharing): Allows requests from different domains
 * This is essential for web applications where frontend and backend are separate
 */
app.use(cors());

/**
 * express.json(): Parses incoming JSON requests and makes the data available in req.body
 * This middleware converts JSON strings in requests to JavaScript objects
 */
app.use(express.json());

// =============================================================================
// DATA STORAGE (In-memory array)
// =============================================================================

/**
 * In-memory storage for products
 * In a real application, this would be a database
 * Fields:
 * - id: Unique identifier (auto-incremented)
 * - name: Product name
 * - category: Product category (Vegetables, Fruits, Dairy, etc.)
 * - price: Product price in USD
 */
let products = [
  { id: 1, name: 'Organic Tomatoes', category: 'Vegetables', price: 3.50 },
  { id: 2, name: 'Fresh Apples', category: 'Fruits', price: 2.75 },
  { id: 3, name: 'Farm Eggs', category: 'Dairy', price: 4.25 }
];
let nextId = 4; // Counter for generating new IDs

// =============================================================================
// REST API ENDPOINTS
// =============================================================================

/**
 * WHAT IS REST API?
 * REST (Representational State Transfer) is an architectural style for designing APIs
 * - Uses HTTP protocols (GET, POST, PUT, DELETE)
 * - Stateless (each request contains all information needed)
 * - Resources are identified by URLs
 * - Returns structured data (usually JSON)
 * 
 * HTTP VERBS MAPPING TO CRUD OPERATIONS:
 * - GET    → READ   (Retrieve data)
 * - POST   → CREATE (Create new resource)
 * - PUT    → UPDATE (Update existing resource)
 * - DELETE → DELETE (Remove resource)
 */

// =============================================================================
// GET /api/products - LIST ALL PRODUCTS
// =============================================================================

/**
 * GET Request - Read Operation
 * Purpose: Retrieve all products from the database
 * HTTP Status Codes:
 * - 200 OK: Successfully retrieved data
 */
app.get('/api/products', (req, res) => {
  console.log('GET /api/products - Fetching all products');
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// =============================================================================
// GET /api/products/:id - GET SINGLE PRODUCT
// =============================================================================

/**
 * GET with ID - Read Operation (Single Resource)
 * Purpose: Retrieve a specific product by its ID
 * HTTP Status Codes:
 * - 200 OK: Product found and returned
 * - 404 Not Found: Product with given ID doesn't exist
 */
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  console.log(`GET /api/products/${productId} - Finding product`);
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    console.log(`Product with ID ${productId} not found`);
    return res.status(404).json({
      success: false,
      message: `Product with ID ${productId} not found`
    });
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
});

// =============================================================================
// POST /api/products - CREATE NEW PRODUCT
// =============================================================================

/**
 * POST Request - Create Operation
 * Purpose: Add a new product to the database
 * HTTP Status Codes:
 * - 201 Created: Successfully created new resource
 * - 400 Bad Request: Invalid input data
 */
app.post('/api/products', (req, res) => {
  console.log('POST /api/products - Creating new product');
  
  const { name, category, price } = req.body;
  
  // Input validation
  if (!name || !category || !price) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'Please provide name, category, and price'
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    console.log('Validation failed: Invalid price');
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number'
    });
  }
  
  // Create new product
  const newProduct = {
    id: nextId++,
    name,
    category,
    price
  };
  
  products.push(newProduct);
  console.log(`New product created with ID: ${newProduct.id}`);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

// =============================================================================
// PUT /api/products/:id - UPDATE PRODUCT
// =============================================================================

/**
 * PUT Request - Update Operation
 * Purpose: Update an existing product completely
 * HTTP Status Codes:
 * - 200 OK: Successfully updated
 * - 404 Not Found: Product not found
 * - 400 Bad Request: Invalid input data
 */
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  console.log(`PUT /api/products/${productId} - Updating product`);
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    console.log(`Product with ID ${productId} not found for update`);
    return res.status(404).json({
      success: false,
      message: `Product with ID ${productId} not found`
    });
  }
  
  const { name, category, price } = req.body;
  
  // Input validation
  if (!name || !category || !price) {
    console.log('Validation failed: Missing required fields for update');
    return res.status(400).json({
      success: false,
      message: 'Please provide name, category, and price'
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    console.log('Validation failed: Invalid price for update');
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number'
    });
  }
  
  // Update product
  products[productIndex] = {
    id: productId,
    name,
    category,
    price
  };
  
  console.log(`Product with ID ${productId} updated successfully`);
  
  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
});

// =============================================================================
// DELETE /api/products/:id - DELETE PRODUCT
// =============================================================================

/**
 * DELETE Request - Delete Operation
 * Purpose: Remove a product from the database
 * HTTP Status Codes:
 * - 200 OK: Successfully deleted
 * - 404 Not Found: Product not found
 */
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  console.log(`DELETE /api/products/${productId} - Deleting product`);
  
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    console.log(`Product with ID ${productId} not found for deletion`);
    return res.status(404).json({
      success: false,
      message: `Product with ID ${productId} not found`
    });
  }
  
  // Remove product from array
  const deletedProduct = products.splice(productIndex, 1)[0];
  console.log(`Product with ID ${productId} deleted successfully`);
  
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
});

// =============================================================================
// 404 HANDLER - CATCH ALL UNMATCHED ROUTES
// =============================================================================

/**
 * 404 Handler - Catch all unmatched routes
 * This middleware runs when no other routes match the request
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

/**
 * Global Error Handler
 * This catches any errors that occur in route handlers
 */
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚜 FarmAssist Mini API Server Started`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`📚 Endpoint: http://localhost:${PORT}/api/products`);
  console.log(`=========================================`);
  console.log('Sample products loaded:');
  products.forEach(product => {
    console.log(`  - ${product.name} (${product.category}): $${product.price}`);
  });
  console.log(`=========================================`);
});