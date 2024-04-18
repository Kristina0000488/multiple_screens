const Collection = require('../models/collection');
const Screen     = require('../models/screen');


module.exports = {
  //# create a collection
  create: async (request, reply) => {
    try {
      const collection    = request.body;
      const newCollection = await Collection.create(collection);

      reply.code(201).send(newCollection);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  
  //#get the list of collections
  fetch: async (request, reply) => {
    try {
      const collections = await Collection.find({ });

      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(collections);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  
  //#get a single collection
  get: async (request, reply) => {
    try {
      const collectionId = request.params.id;
      const collection   = await Collection.findById(collectionId);

      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(collection);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  
  //#update a collection
  update: async (request, reply) => {
    try {
      const collectionId = request.params.id;
      const updates  = request.body;

      await Collection.findByIdAndUpdate(collectionId, updates);
      const collectionToUpdate = await Collection.findById(collectionId);

      reply.code(200).send( collectionToUpdate );
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  
  //#delete a collection with screens
  delete: async (request, reply) => {
    try {
      const collectionId = request.params.id;

      const collectionToDelete = await Collection.findById(collectionId);

      if (collectionToDelete.screenIds) {
        await Screen.deleteMany({ _id: {$in: [ ...collectionToDelete.screenIds ] } }).then((result) => {
          //console.log(result, ' ---deleted');
        });;
      }

      await Collection.findByIdAndDelete(collectionId);
      
      reply.code(200).send();
    } catch (e) {
      reply.code(500).send(e);
    }
  },
};