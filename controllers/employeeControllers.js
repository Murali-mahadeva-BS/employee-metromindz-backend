const joi = require("joi");
const Employee = require("../models/employeeModel");
const isUuid = joi.object({
  id: joi.string().guid(),
});
const employeeSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().required().email(),
  phone: joi.string().required().length(10),
  gender: joi.string().required(),
});

module.exports.getEmployees = async (req, res) => {
  try {
    let { page, perPage, sort } = req.query;

    let sortItem = null,
      sortOrder = null;
    if (sort) {
      let split = sort.split(",");
      sortItem = split[0] ? split[0] : null;
      sortOrder = split[1] ? split[1] : null;
    }

    let fromItems = 0;
    let toItems = 0;
    if (!perPage || perPage == 0) perPage = 5;
    else {
      perPage = parseInt(perPage);
    }
    if (!page) page = 0;
    else {
      page = parseInt(page);
      if (page === 1) fromItems = perPage;
      if (page > 1) fromItems = page * perPage;
    }
    toItems = fromItems + perPage;

    console.log("sort:", sortItem, sortOrder);
    console.log("pagination:", fromItems, toItems);
    let employees = await Employee.find({}, null, {
      sort:
        sortOrder &&
        sortItem &&
        `${sortOrder === "desc" ? "-" : ""}${sortItem}`,
      skip: fromItems,
      limit: toItems,
    });
    let totalItems = await Employee.countDocuments();
    // console.log("employees:", employees);
    res.status(200).json({
      success: true,
      totalItems,
      page: page,
      perPage: perPage,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
module.exports.createEmployee = async (req, res) => {
  try {
    let { username, email, phone, gender } = req.body;
    let validation = await employeeSchema.validate({
      username,
      email,
      phone,
      gender,
    });
    if (validation.error) {
      return res.status(400).json({
        message: "Bad request",
        error: validation.error,
      });
    } else {
      let employee = await Employee.findOne({
        $or: [{ username, email, phone }],
      });
      if (employee) {
        return res.status(400).json({
          success: false,
          message: "Bad request",
          error: "Employee with username, email or phone is already present",
        });
      }
      employee = await new Employee({ username, email, phone, gender });
      employee
        .save()
        .then((employee) => {
          res.status(201).json({
            success: true,
            message: "Employee created",
            employee,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            success: false,
            message: "Employee not created",
            error,
          });
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
module.exports.updateEmployee = async (req, res) => {
  try {
    let { id } = req.params;
    let { username, email, phone, gender } = req.body;
    let validation = await employeeSchema.validate({
      username,
      email,
      phone,
      gender,
    });
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: "Bad request",
        error: validation.error,
      });
    } else {
      let employee = await Employee.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!employee) {
        return res.status(500).json({
          success: false,
          message: "Employee not updated",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Employee updated",
          employee,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
module.exports.deleteEmployee = async (req, res) => {
  try {
    let { id } = req.params;
    let employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "No Employee found with this id" });
    } else {
      employee = await Employee.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Employee deleted succesfully",
        employee,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
