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

module.exports = {
  getMyTransactions,
  createTransaction,
};
