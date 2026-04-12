const Transaction = require("../models/Transaction");

// @desc    Get current user's transactions
// @route   GET /api/transactions/me
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a transaction (internal use usually)
const createTransaction = async (data) => {
  try {
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw error;
  }
};

// @desc    Get all transactions (Admin only)
// @route   GET /api/admin/transactions
const getAllTransactions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const transactions = await Transaction.find(filter)
      .populate("userId", "fullName username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      transactions,
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyTransactions,
  createTransaction,
  getAllTransactions,
};
