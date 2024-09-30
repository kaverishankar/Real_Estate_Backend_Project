import express from 'express';
import jwt from 'jsonwebtoken';
import { Product } from '../db-utils/models.js';

const ProdRouter = express.Router();

// 1. Get all available products (sold: false)
ProdRouter.get('/available', async (req, res) => {
    try {
        // Fetch all products where `sold` is false
        const products = await Product.find({ sold: false });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get a specific product by SKU (irrespective of availability)
ProdRouter.get('/available/:sku', async (req, res) => {
    try {
        // Find product by SKU (unique identifier)
        const product = await Product.findOne({ sku: req.params.sku });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get all products of a particular seller (irrespective of availability)
ProdRouter.get('/seller/:sellerId', async (req, res) => {
    try {
        // Find products belonging to a specific seller by their userId
        const products = await Product.find({ 'sellerInfo.userId': req.params.sellerId });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

ProdRouter.get('/:sku', async (req, res) => {
    try {
        const product = await Product.findOne({ sku: req.params.sku });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. Create a new product (default to `sold: false`)
ProdRouter.post('/', async (req, res) => {
    try {
        const userInfo = jwt.verify(
            req.headers['authorization'],
            process.env.JWT_SECRET
        );

        if (userInfo.userType === 'seller') {
            const productBody = {
                ...req.body,
                sold: false,
                sellerInfo: {
                    ...userInfo,
                },
            };
            const newProduct = new Product(productBody);
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } else {
            res.status(400).json({ msg: 'Only a seller can add a product' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Update an existing product (including marking as sold or not sold)
ProdRouter.put('/:sku', async (req, res) => {
    try {

        // Find and update the product
        const updatedProduct = await Product.findOneAndUpdate(
            { sku: req.params.sku }, // Using `sku` as an identifier
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(201).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 6. Delete an existing product
ProdRouter.delete('/:sku', async (req, res) => {
    try {
        // Find and delete the product by SKU
        const deletedProduct = await Product.findOneAndDelete({ sku: req.params.sku });

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default ProdRouter;
