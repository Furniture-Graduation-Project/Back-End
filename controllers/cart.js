import Cart from "../models/Cart.js";

// Get Cart by UserID
export const getCart = async (req, res) => {
  try {
    const { UserID } = req.params;
    const cart = await Cart.findOne({ UserID });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to Cart
export const addItemToCart = async (req, res) => {
  const { UserID, ProductID, ProductOption, Quantity, Price } = req.body;

  try {
    let cart = await Cart.findOne({ UserID });

    if (!cart) {
      cart = new Cart({ UserID, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.ProductID === ProductID && item.ProductOption === ProductOption
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].Quantity += Quantity;
      cart.items[existingItemIndex].Price += Price;
    } else {
      cart.items.push({ ProductID, ProductOption, Quantity, Price });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item in Cart
export const updateCartItem = async (req, res) => {
  const { UserID } = req.params;
  const { ProductID, ProductOption, Quantity, Price } = req.body;

  try {
    const cart = await Cart.findOne({ UserID });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.ProductID === ProductID && item.ProductOption === ProductOption
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].Quantity = Quantity;
      cart.items[itemIndex].Price = Price;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from Cart
export const removeItemFromCart = async (req, res) => {
  const { UserID, ProductID, ProductOption } = req.params;

  try {
    const cart = await Cart.findOne({ UserID });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.ProductID === ProductID && item.ProductOption === ProductOption)
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Cart
export const deleteCart = async (req, res) => {
  const { UserID } = req.params;

  try {
    const deletedCart = await Cart.findOneAndDelete({ UserID });
    if (!deletedCart)
      return res.status(404).json({ message: "Cart not found" });
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
