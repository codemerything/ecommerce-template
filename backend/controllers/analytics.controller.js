import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all documents together,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // example of dailySalesData
    // [
    // 	{
    // 		_id: "2024-08-18",
    // 		sales: 12,
    // 		revenue: 1450.75
    // 	},
    // ]

    const dateArray = getDatesInRange(startDate, endDate);
    // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export const getCustomerStats = async (req, res) => {
  try {
    const customerStats = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalOrders: 1,
          totalSpent: 1,
          userName: {
            $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"],
          },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
    ]);

    res.status(200).json({
      message: "Fetched Customer Status Successfully",
      data: customerStats,
    });
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    res.status(500).json({
      message: "Error fetching customer stats",
      error: error.message,
    });
  }
};
