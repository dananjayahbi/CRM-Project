const sequelize = require("../config/db.config");

const Unit = require("../models/units.model");
sequelize.sync({ force: false });

// Create a new unit
exports.createUnit = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Unit name is required");
    }

    // Check if the unit already exists
    const existingUnit = await Unit.findOne({ where: { name } });
    if (existingUnit) {
        return res.status(400).send("Unit already exists");
    }

    const unit = await Unit.create({
      name,
      description: description ? description : "",
    });

    res.status(201).send(unit);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get all units
exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll();
    res.status(200).send(units);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get a unit by id
exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) {
      return res.status(404).send("Unit not found");
    }
    res.status(200).send(unit);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a unit by id
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const unit = await Unit.findByPk(id);
    if (!unit) {
      return res.status(404).send("Unit not found");
    }

    if (unit) {
      name ? (unit.name = name) : unit.name;
        unit.description = description ? description : unit.description;

      await unit.save();

      res.status(200).send({
        message: "Unit updated successfully",
        data: unit,
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a unit by id
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findByPk(id);
    if (!unit) {
      return res.status(404).send("Unit not found");
    }

    await unit.destroy();

    res.status(200).send("Unit deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};