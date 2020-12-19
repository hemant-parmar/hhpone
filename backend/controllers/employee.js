const Employee = require('../models/employee');

exports.addEmployee = (req, res, next) => {
  const employee = new Employee(req.body);
  console.log('backend emp ctlr - employee: ' + employee)
  employee.save()
    .then( addedEmployee => {
      res.status(201).
        json({
          message: 'Employee added.',
          employeeId: addedEmployee._id
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500)
        .json({
          message: "Server Error in saving Employee's data!"
        });
    });
}

exports.getEmployees =  (req, res, next) => {
  filter = req.query.filter;
  sortKey = req.query.sortKey;
  sortOrder = req.query.sortOrder;
  pageSize = +req.query.pageSize;
  pageIndex = +req.query.pageIndex;

  let fetchedDocs;
  let docQuery;

  if(filter) {
    docQuery = Employee.find({
      $or: [
        { fName: { $regex:  filter, $options: 'i' } },
        { lName: { $regex:  filter, $options: 'i' } },
      ]
      });
  } else {
    docQuery = Employee.find();
  }
  if(pageSize && pageIndex >= 0) {
    if(!sortKey) {
      docQuery.skip(pageSize * pageIndex).limit(pageSize);
    }else{
      if(sortOrder === 'desc') {
        sortOption = '-' + sortKey
      }else {
        sortOption = sortKey
      }
      docQuery.sort(sortOption).skip(pageSize * pageIndex).limit(pageSize);
    }
  }
  docQuery
    // .map(documents => basicDetails(documents))
    .then(documents => {
      fetchedDocs = documents;
      return Employee.countDocuments();
    })
    .then(count => {
      // status 200: Request Successful
      res.status(200).json({
        employees: fetchedDocs,
        totalCount: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Server Error in fetching Clients data!"
      });
    });
};

exports.getNonuserEmployees = (req, res, next) => {
  let docQuery;

  docQuery = Employee.find({ userName: { $eq: '' }});

  docQuery.sort('fName')
    .select('_id fName lName coEmail')
    .then( documents => {
      res.status(200).json(documents);
    })
    .catch(err => {
      res.status(500).json({
        message: "Server Error in fetching Clients data!"
      });
    });
}

exports.getEmployee = (req, res, next) => {
  Employee.findById(req.params.id)
    .then(employee => {
      if(employee) {
        const newEmployee = { ...employee._doc};
        delete newEmployee.__v
        res.status(200).json(newEmployee);
      } else {
        res.status(404).json({
          message: 'Employee not found.'
        });
      }
    });
}

exports.updateEmployee = (req, res, next) => {
  const employee = new Employee(req.body);
  employee._id = req.params.id;
  Employee.updateOne({ _id: req.params.id }, employee)
    .then(() => {
      res.status(200).json({
        message: 'Employee Data Updated.'
      });
    });
}

exports.deleteEmployee = (req, res, next) => {
  filter = req.query.filter;
  sortKey = req.query.sortKey;
  sortOrder = req.query.sortOrder;
  pageSize = +req.query.pageSize;
  pageIndex = +req.query.pageIndex;

  Employee.deleteOne({_id: req.params.id})
    .then((result) => {
      // res.status(200).json({message: 'Client Deleted.'});

      let fetchedDocs;
      let docQuery;

      if(filter) {
        docQuery = Client.find({
          $or: [
            { fName: { $regex:  filter, $options: 'i' } },
            { lName: { $regex:  filter, $options: 'i' } },
          ]
          }).collation({ locale: 'en'});
      } else {
        docQuery = Employee.find().collation({ locale: 'en'});
      }
      if(pageSize && pageIndex >= 0) {
        if(!sortKey) {
          docQuery.skip(pageSize * pageIndex).limit(pageSize);
        }else{
          if(sortOrder === 'desc') {
            sortOption = '-' + sortKey
          }else {
            sortOption = sortKey
          }
          docQuery.sort(sortOption)
            .skip(pageSize * pageIndex).limit(pageSize);
        }
      }
      docQuery
        // .map(documents => basicDetails(documents))
        .then(documents => {
          fetchedDocs = documents;
          return Employee.countDocuments();
        })
        .then(count => {
          // status 200: Request Successful
          res.status(200).json({
            employees: fetchedDocs,
            totalCount: count
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Server Error in fetching Clients data!"
          });
        });
    });
}
