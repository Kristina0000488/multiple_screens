const screensController = require('../controllers/screenController');

module.exports = (app) => {
    // create a screen/screens
    app.post('/screens', screensController.create);

    // create a one!!! chart
    app.post('/chart', screensController.createChart);

    // copy multiple screens
    app.post('/copy', screensController.copy);
    
    // get the list of screens
    app.get('/screens', screensController.fetch);
    
    // get a single screen
    app.get('/screens/:id', screensController.get);
    
    // update a screen
    app.put('/screens/:id', screensController.update);

    // update multiple screens
    app.put('/screens', screensController.updateMultiple);
    
    // delete a screen
    app.delete('/screens/:id', screensController.delete);
};