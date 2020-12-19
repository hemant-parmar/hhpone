const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/employee');

// POST - to add a new Employee
router.post('', EmployeeController.addEmployee);

// GET - to fetch all employees
router.get('', EmployeeController.getEmployees);

// GET - to fetch all employees who do not have a userName
router.get('/nonuser', EmployeeController.getNonuserEmployees);

// // GET - a client
router.get('/:id', EmployeeController.getEmployee);

// // PUT - to update an existing client upon editing
router.put('/:id', EmployeeController.updateEmployee);

// DELETE - a client
router.delete('/:id', EmployeeController.deleteEmployee);


module.exports = router;
