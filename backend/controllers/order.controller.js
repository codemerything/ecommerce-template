import Order from "../models/order.model.js";

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
