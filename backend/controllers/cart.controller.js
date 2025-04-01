import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingProduct = user.cartItems.find(
      (item) => item.product == productId
    );
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    return res.status(200).json({
      message: "Product added to cart successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    return res.status(200).json({
      message: "Cart cleared successfully",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    const existingProduct = user.cartItems.find(
      (item) => item.product == productId
    );
    if (existingProduct) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.product !== productId
        );
        await user.save();
        return res.status(200).json({
          message: "Product removed from cart successfully",
          cartItems: user.cartItems,
        });
      }
      existingProduct.quantity = quantity;
      await user.save();
      return res.status(200).json({
        message: "Product quantity updated successfully",
        cartItems: user.cartItems,
      });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    // add quantity to each product

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (item) => item.product == product._id
      );
      return {
        ...product.toJSON(),
        quantity: item.quantity,
      };
    });
  } catch (error) {
    console.log("Error in getCartItems controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
