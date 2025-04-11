import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { Search, Filter, Trash2, Star } from "lucide-react";

export default function ProductsList() {
  const { products, fetchAllProducts, toggleFeaturedProduct, deleteProduct } =
    useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Ensure products is an array before operations
  // Filter products correctly
  // Check if productsList is defined and is an array
  // If not, set it to an empty array
  const productsList = Array.isArray(products) ? products : [];

  // Filter products based on search term and category filter
  const filteredProducts = productsList.filter((product) => {
    // Check if product is defined and has the necessary properties
    if (!product || !product.name || !product.description) return false;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories correctly
  const categories = [
    ...new Set(productsList.map((product) => product.category)),
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold mb-4 md:mb-0">Products</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table for displaying products */}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Featured
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts?.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={async () => {
                      toggleFeaturedProduct(product._id),
                        await fetchAllProducts();
                      console.log("Toggle button with ", product.isFeatured);
                    }}
                    className={`p-1 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200${
                      product.isFeatured
                        ? "text-yellow-400 hover:text-yellow-500"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                  >
                    <Star
                      size={20}
                      fill={product.isFeatured ? "#FCF55F" : "none"}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={async () => {
                      await deleteProduct(product._id);
                      console.log("Delete button with ", product._id);
                      fetchAllProducts();
                    }}
                    className="text-red-600 cursor-pointer hover:text-red-900 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No products found. Try adjusting your filters or add a new product.
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {filteredProducts.length} of {productsList.length} products
        </p>
      </div>
    </div>
  );
}
