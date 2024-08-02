const Unit = require("../models/Unit.model");

// Create and Save a new Unit
exports.createUnit = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send("Unit name is required");
    }

    // Find if any unit already exists with the provided name
    const unitByName = await Unit.findOne({ name: name });
    if (unitByName) {
      return res.status(400).send("Unit already exists with the provided name");
    }

    const unit = new Unit({
      name: req.body.name,
      description: description ? description : "",
    });

    const createdUnit = await unit.save();
    res.status(201).send({
      message: "Unit created successfully",
      unit: createdUnit,
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    res.status(500).send({
      message: "Some error occurred while creating the unit.",
    });
  }
};

// Retrieve all Units from the database.
exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).send(units);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Find a single Unit with an id
exports.getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findById(id);
    res.status(200).send(unit);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Update a Unit by the id in the request
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const unit = await Unit.findById(id);
    if (!unit) {
      return res.status(404).send({
        message: `Cannot update Unit with id=${id}. Unit not found!`,
      });
    }

    // Find if any unit already exists with the provided name
      const unitByName = await Unit.findOne({ name });
      if (unitByName && unitByName._id.toString() !== id) {
        return res
          .status(400)
          .send({ message: "Unit already exists with the provided name" });
      }

    if (unit) {
      name ? (unit.name = name) : unit.name;
      description ? (unit.description = description) : unit.description;

      const updatedUnit = await unit.save();

      res.send({
        message: "Unit was updated successfully",
        unit: updatedUnit,
      });
    }
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

// Delete a Unit with the specified id in the request
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await Unit.findByIdAndDelete(id);
    if (!unit) {
      return res.status(404).send({
        message: `Cannot delete Unit with id=${id}. Unit not found!`,
      });
    }
    res.send({ message: "Unit was deleted successfully!" });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
