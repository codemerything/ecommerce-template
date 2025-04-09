import cloudinary from "../config/cloudinary.js";
import { redis } from "../config/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await redis.get("featured_products");

    if (featuredProducts) {
      return res.json({ products: JSON.parse(featuredProducts) });
    }

    // if there are no featured products in the redis, fetch them from the database
    //.lean method is used to get plain javascript objects instead of mongoose documents
    // which is good for performance and memory usage
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store the featured products in redis
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json({ products: featuredProducts });
  } catch (error) {
    console.log("Error in getFeaturedProducts", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Creates a new product in the database. If an image is provided, it uploads
 * the image to Cloudinary and stores the image URL in the database. Returns
 * a success message and the created product if successful, or an error
 * message if any errors occur.
 *
 * @param {Object} req - The request object containing the product details
 * to be created, including name, description, price, category, and image.
 * @param {Object} res - The response object used to send back the
 * appropriate HTTP response.
 */

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });

      const product = await Product.create({
        name,
        description,
        price,
        image: cloudinaryResponse?.secure_url
          ? cloudinaryResponse.secure_url
          : "",
        category,
      });

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    }
  } catch (error) {
    console.log("Error in createProduct", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const public_id = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${public_id}`);
        console.log(`deleted image with public_id: ${public_id}`);
      } catch (error) {
        console.log("Error deleting image", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    // delete the product from the database

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          price: 1,
          description: 1,
        },
      },
    ]);

    res.json({ products });
  } catch (error) {
    console.log("Error in getRecommendedProducts", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();

      await updateFeaturedProductsCache();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    // the lean() method is used to get plain javascript objects instead of mongoose documents
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error updating featured products cache", error.message);
  }
};
