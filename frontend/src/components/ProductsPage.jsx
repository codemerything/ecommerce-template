import { useState } from "react";
import { Plus, Loader2, Upload } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ProductsList from "./ProductsList";

const categories = ["jeans", "shirts", "shoes", "accessories"];
export default function CreateProductPage() {
  // Product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  const { createProduct, fetchAllProducts } = useProductStore();
  const [isCreating, setIsCreating] = useState(false);
  const [uploadedFileName, setUpLoadedFileName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        price: "",
        category: "",
        description: "",
        image: "",
      });
      toast.success("Product created successfully!");
      await fetchAllProducts(); // Fetch all products after creating a new one
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setUpLoadedFileName(file.name);
    }
  };

  return (
    <motion.div
      className=""
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Create Product Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                id="image"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="w-full flex items-center px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <Upload className="h-5 w-5 inline-block mr-2 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {!uploadedFileName ? "Upload Image" : uploadedFileName}
                </span>
              </label>
              {newProduct.image && (
                <span className="ml-1 text-sm text-green-400">
                  Image uploaded ✅
                </span>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              disabled={isCreating}
            >
              <Plus size={18} className="mr-2" />
              {isCreating && <Loader2 className="animate-spin" size={18} />}
              {isCreating ? "Uploading..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
      <ProductsList />
    </motion.div>
  );
}
