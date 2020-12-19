const Client = require('../models/client');

exports.addClient = (req, res, next) => {
  const client = new Client(req.body);
  client.save()
    .then(addedClient => {
      res.status(201)
        .json({
          message: 'Client added',
          clientId: addedClient._id  //sending Id created by database in response
        });
      // status 201: Request Successful with New Resource created
    })
    .catch(err => {
      res.status(500).json({
        message: "Server Error in saving a Client's data!" + err
      });
    });
};

exports.getClients =  (req, res, next) => {
  filter = req.query.filter;
  sortKey = req.query.sortKey;
  sortOrder = req.query.sortOrder;
  pageSize = +req.query.pageSize;
  pageIndex = +req.query.pageIndex;

  let fetchedDocs;
  let docQuery;

  if(filter) {
    docQuery = Client.find({
      $or: [
        { compName: { $regex:  filter, $options: 'i' } },
        { city: { $regex:  filter, $options: 'i' } },
      ]
      }).collation({ locale: 'en'});
  } else {
    docQuery = Client.find().collation({ locale: 'en'});
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
      return Client.countDocuments();
    })
    .then(count => {
      // status 200: Request Successful
      res.status(200).json({
        clients: fetchedDocs,
        totalCount: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Server Error in fetching Clients data!"
      });
    });
};

exports.getClientNames = (req, res, next) => {
  let docQuery;
  docQuery = Client.find();
  docQuery.sort('compName')
    .select({ _id: 0, compName: 1})
    .then(documents => {
      res.status(200).json(documents);
    })
    .catch(err => {
      res.status(500).json({message: "Server error in getting client list"});
    });
}

exports.getClient = (req, res, next) => {
  Client.findById(req.params.id)
    .then(client => {
      if(client) {
        res.status(200).json(client);
      } else {
        res.status(404).json({
          message: 'Client not found.'
        });
      }
    });
}

exports.updateClient = (req, res, next) => {
  const client = new Client(req.body);
  client._id = req.params.id
  Client.updateOne({ _id: req.params.id }, client)
  .then(result => {
    res.status(200).json({
      message: 'Client Updated.'
    });
  });
};

exports.deleteClient = (req, res, next) => {
  filter = req.query.filter;
  sortKey = req.query.sortKey;
  sortOrder = req.query.sortOrder;
  pageSize = +req.query.pageSize;
  pageIndex = +req.query.pageIndex;

  Client.deleteOne({_id: req.params.id})
    .then((result) => {
      // res.status(200).json({message: 'Client Deleted.'});

      let fetchedDocs;
      let docQuery;

      if(filter) {
        docQuery = Client.find({
          $or: [
            { compName: { $regex:  filter, $options: 'i' } },
            { city: { $regex:  filter, $options: 'i' } },
          ]
          }).collation({ locale: 'en'});
      } else {
        docQuery = Client.find().collation({ locale: 'en'});
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
          return Client.countDocuments();
        })
        .then(count => {
          // status 200: Request Successful
          res.status(200).json({
            clients: fetchedDocs,
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

function basicDetails(client) {
  const { _id,compName, city, state, compCat, compSubcat, compClass } = client;
  return { _id,compName, city, state, compCat, compSubcat, compClass };
}

