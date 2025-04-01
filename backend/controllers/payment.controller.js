import { PAYSTACK_SECRET_KEY } from "../config/env.js";
import axios from "axios";
// import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const initializePayment = async (req, res) => {
  try {
    const { products, email } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    let totalAmount = 0;
    products.forEach((product) => {
      totalAmount += Math.round(product.price * product.quantity);
    });

    // finds coupon codeand applies it to totalAmount if the total amount is past a certain price

    // let coupon = null;
    // if (couponCode) {
    //   coupon = await Coupon.findOne({
    //     code: couponCode,
    //     userId: req.user._id,
    //     isActive: true,
    //   });
    //   if (coupon) {
    //     totalAmount -= Math.round(
    //       totalAmount * (coupon.discountPercentage / 100)
    //     );
    //   }
    // }

    const amountInKobo = totalAmount * 100;

    const newOrder = new Order({
      user: req.user._id,
      products: products.map((product) => ({
        product: product._id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: totalAmount,
      paystackReference: null,
      paymentStatus: "pending",
    });

    const saveOrder = await newOrder.save();

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: email,
        amount: amountInKobo,
        callback_url: "http://localhost:3000/api/payments/callback",
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      await Order.findByIdAndUpdate(saveOrder._id, {
        paystackReference: response.data.data.reference,
      });

      return res.json({
        message: "Payment initialized successfully",
        reference: response.data.data.reference,
        authorization_url: response.data.data.authorization_url,
      });
    }
    return res.status(400).json({ message: "Payment initialization failed" });
  } catch (error) {
    console.error(
      "Error in initializePayment controller",
      error.response?.data || error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const updatedOrder = await Order.findOneAndUpdate(
        { paystackReference: paymentData.reference },
        { paymentStatus: "success" },
        { new: true }
      );

      return res.json({
        message: "Payment verified successfully",
        order: updatedOrder,
      });
    } else {
      return res.json({
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error(
      "Error in verifyPayment controller",
      error.response?.data || error.message
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
