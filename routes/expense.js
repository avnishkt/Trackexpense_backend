const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Expenses = require("../models/Expenses");
const User = require("../models/User");
// Expenses fetching:
router.get("/getexpenses", fetchuser, async (req, res) => {
  const fetchedExpenses = await Expenses.find({ user: req.user.id });
  res.status(200).json({
    Expenses: fetchedExpenses,
  });
});
// Expenses addition:
router.post("/addexpense", fetchuser, async (req, res) => {
  try {
    const { expensetitle, expenseamount, expensecategory, expensedate } = req.body;
    if (!expensetitle || !expenseamount) {
      return res.status(400).json({
        message: "Enter a valid Expense",
      });
    }
    if (!expensecategory) {
      expensecategory = "Other";
    }
    const Expense = new Expenses({
      user: req.user.id,
      title: expensetitle,
      amount: expenseamount,
      category: expensecategory,
      date: expensedate
    });
    const savedExpense = await Expense.save();
    res.status(200).json({
      message: "Expense created Successfully.",
      expense: savedExpense
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error"+err });
  }
});

// Expenses Updation:
router.put("/updateexpense/:id", fetchuser, async (req, res) => {
  const { expensetitle, expenseamount, expensecategory } = req.body;
  // Creating a new Expense object
  const newExpense = {};
  if (expensetitle) {
    newExpense.title = expensetitle;
  }
  if (expenseamount) {
    newExpense.amount = expenseamount;
  }
  if (expensecategory) {
    newExpense.category = expensecategory;
  }

  // Authentication for Expense updation:
  const ExpenseId = await Expenses.findById(req.params.id);
  if (!ExpenseId) {
    return res.status(404).json({
      message: "Expense not found.",
    });
  }
  if (ExpenseId.user.toString() !== req.user.id) {
    return res.status(401).json({
      message: "Unauthorised Access.",
    });
  }
  Expense = await Expenses.findByIdAndUpdate(
    req.params.id,
    { $set: newExpense },
    { new: true }
  );
  res.status(200).json({
    message: "Expense updated successfully",
    updatedExpense: Expense,
  });
});

router.delete("/deleteexpense/:id", fetchuser, async (req, res) => {
  try {
    // Check if Expense exists:
    const findExpense = await Expenses.findById(req.params.id);
    if (!findExpense) {
        return res.status(404).json({
          message: "Expense not found.",
        });
    }
    // Proceed further if Expense exists
    const userId = req.user.id;
    // Check if right user is deleting the Expense
    const verifyUser = findExpense.user.toString() === userId;
    if (!verifyUser) {
      return res.status(401).json({
        message: "Unauthorised Access.",
      });
    }
    // Expense deletion
    const ExpenseDeletion = await Expenses.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Expense deleted successfully.",
    });
  } catch (err) {
    // Server side error handling:
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
