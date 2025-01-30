// controllers/productController.js
const Products = require("../models/products");
const db = require("../config/db");
// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, rating } = req.body;
    const product = new Products({ title, description, price, rating });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, rating } = req.body;
    const product = await Products.findByIdAndUpdate(
      req.params.id,
      { title, description, price, rating },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Products not found" });
    }
    res.status(200).json({ message: "Products deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get products which have prices less than 1000
exports.getProductsUnderPrice = async (req, res) => {
  try {
    const result = await Products.aggregate([
      // Match products with price less than 1000
      { $match: { price: { $lt: 1000 } } },
      // sort the products by price in ascending order
      { $sort: { price: 1 } },
      // Lookup related pizzas
      {
        $lookup: {
          from: "pizzas", // The name of the collection for pizzas
          localField: "_id", // The local field in the products collection
          foreignField: "_id", // The foreign field in the pizzas collection
          as: "relatedPizzas", // Alias for the joined array
        },
      },
      // Add a field to calculate the total number of related pizzas
      { $addFields: { totalItems: { $size: "$relatedPizzas" } } },
      // Project the desired fields
      { $project: { title: 1, price: 1, relatedPizzas: 1, totalItems: 1 } },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [{ $limit: 100 }], // Limit results if needed
        },
      },
    ]);

    // Send the result back to the client
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ success: false, message: error.message });
  }
};
