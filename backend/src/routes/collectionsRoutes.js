const collectionsController = require('../controllers/collectionController');

module.exports = (app) => {
    // create a collection/collection
    app.post('/collections', collectionsController.create);
    
    // get the list of collections
    app.get('/collections', collectionsController.fetch);
    
    // get a single collection
    app.get('/collections/:id', collectionsController.get);
    
    // update a collection
    app.put('/collections/:id', collectionsController.update);
    
    // delete a collection
    app.delete('/collections/:id', collectionsController.delete);
};