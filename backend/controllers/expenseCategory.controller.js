const sequelize = require("../config/db.config");

const ExpenseCategory = require("../models/expenseCategory.model");
sequelize.sync({ force: false });

// Create a new expense category
exports.createExpenseCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Name is required");
    }

    const createdExpenseCategory = await ExpenseCategory.create({
      name,
      description: description ? description : null,
    });

    res.status(201).send({
      message: "Expense category created successfully",
      expenseCategory: createdExpenseCategory,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get all expense categories
exports.getAllExpenseCategories = async (req, res) => {
  try {
    const expenseCategories = await ExpenseCategory.findAll();
    res.status(200).send(expenseCategories);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Get an expense category by id
exports.getExpenseCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const expenseCategory = await ExpenseCategory.findByPk(id);

    if (!expenseCategory) {
      return res.status(404).send("Expense category not found");
    }

    res.status(200).send(expenseCategory);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update an expense category
exports.updateExpenseCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const expenseCategory = await ExpenseCategory.findByPk(id);

    if (!expenseCategory) {
      return res.status(404).send("Expense category not found");
    }

    await ExpenseCategory.update(
      {
        name: name ? name : expenseCategory.name,
        description: description ? description : expenseCategory.description,
      },
      {
        where: { id },
      }
    );

    res.status(200).send("Expense category updated successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete an expense category
exports.deleteExpenseCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const expenseCategory = await ExpenseCategory.findByPk(id);

    if (!expenseCategory) {
      return res.status(404).send("Expense category not found");
    }

    await ExpenseCategory.destroy({
      where: { id },
    });

    res.status(200).send("Expense category deleted successfully");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
