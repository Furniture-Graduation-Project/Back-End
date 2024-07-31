import { body, validationResult } from "express-validator";
import Cart from "../models/cart.js";

// Validation rules
const validateCartItem = [
  body("UserID").isString().withMessage("UserID must be a string"),
  body("ProductID").isString().withMessage("ProductID must be a string"),
  body("ProductOption")
    .isString()
    .withMessage("ProductOption must be a string"),
  body("Quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than 0"),
  body("Price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),
];

// Get Cart by UserID
export const getCart = async (req, res) => {
  try {
    const { UserID } = req.params;
    const cart = await Cart.findOne({ UserID });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to Cart
export const addItemToCart = [
  ...validateCartItem,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { UserID, ProductID, ProductOption, Quantity, Price } = req.body;

    try {
      let cart = await Cart.findOne({ UserID });

      if (!cart) {
        cart = new Cart({ UserID, items: [] });
        await cart.save();
      }

      const existingItem = cart.items.find(
        (item) =>
          item.ProductID === ProductID && item.ProductOption === ProductOption
      );

      if (existingItem) {
        existingItem.Quantity += Quantity;
        existingItem.Price += Price;
      } else {
        cart.items.push({ ProductID, ProductOption, Quantity, Price });
      }

      await cart.save();
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Update item in Cart
export const updateCartItem = [
  ...validateCartItem,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { UserID } = req.params;
    const { ProductID, ProductOption, Quantity, Price } = req.body;

    try {
      const cart = await Cart.findOne({ UserID });

      if (!cart) return res.status(404).json({ message: "Cart not found" });

      const item = cart.items.find(
        (item) =>
          item.ProductID === ProductID && item.ProductOption === ProductOption
      );

      if (item) {
        item.Quantity = Quantity;
        item.Price = Price;
        await cart.save();
        res.status(200).json(cart);
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Remove item from Cart
export const removeItemFromCart = async (req, res) => {
  const { UserID, ProductID, ProductOption } = req.params;

  try {
    const cart = await Cart.findOne({ UserID });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.ProductID === ProductID && item.ProductOption === ProductOption
    );

    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Cart
export const deleteCart = async (req, res) => {
  const { UserID } = req.params;

  try {
    const cart = await Cart.findOneAndDelete({ UserID });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
