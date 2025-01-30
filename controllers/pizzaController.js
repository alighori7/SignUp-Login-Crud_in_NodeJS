const Pizza = require('../models/piza');

// Create a new pizza
exports.createPizza = async (req, res) => {
    try {
        const { name, size, price, quantity, date } = req.body;
        const pizza = new Pizza({ name, size, price, quantity, date });
        await pizza.save();
        res.status(201).json({ message: 'Pizza created successfully', pizza });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Get all pizzas
exports.getPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find();
        res.status(200).json(pizzas);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Get a single pizza by ID
exports.getPizzaById = async (req, res) => {
    try {
        const pizza = await Pizza.findById(req.params.id);
        if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
        res.status(200).json(pizza);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Update a pizza
exports.updatePizza = async (req, res) => {
    try {
        const { name, size, price, quantity, date } = req.body;
        const pizza = await Pizza.findByIdAndUpdate(
            req.params.id,
            { name, size, price, quantity, date },
            { new: true }
        );
        if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
        res.status(200).json({ message: 'Pizza updated successfully', pizza });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// Delete a pizza
exports.deletePizza = async (req, res) => {
    try {
        const pizza = await Pizza.findByIdAndDelete(req.params.id);
        if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
        res.status(200).json({ message: 'Pizza deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Server error' });
    }
};
