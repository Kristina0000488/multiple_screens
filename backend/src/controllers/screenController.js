const Screen = require('../models/screen');
const Collection = require('../models/collection');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const base64 = require('base-64');

const { Headers } = fetch;


module.exports = {
  //# create a screen or multiple screens and update the relevant collection
  create: async (request, reply) => {
    try {
        const screens    = request.body.screens; // as {path: string, name: string, updTime: number, collectionId: string}[];
        const collectionId = request.body.collectionId;
        const collection = await Collection.findById(collectionId);
        // copy password and username from chart in collection
        const newScreens = [];
        await Screen.create(screens).then( result => {
            collection.screenIds.push( ...result.map( val => val.id ));
            newScreens.push(result);
        }) ;
        await collection.save();

        reply.code(201).send(newScreens);
    } catch (e) {
        reply.code(500).send(e);
    }
  },

    //# create a chart screen and update the relevant collection
    createChart: async (request, reply) => {
      try {
          let screen    = request.body.screen; // as {path: string, name: string, updTime: number, collectionId: string};
          const collectionId = request.body.collectionId;
          const collection = await Collection.findById(collectionId);
          const password = request.body.password;
          const username = request.body.username;
  
          let headers = new Headers();
          
         if ( password && username ) {
          headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));
          //console.log(password, username, ' ++');
         };
        
         const req = await fetch(screen.path);
         const result = await req.json();
         //console.log(result);
         const data = [];

         if (result) {
          if (Array.isArray(result)) {
            for (let value of result) {
              //console.log(value);
              data.push({
                label: '',
                type: "line",
                xValueFormatString: "DD MMMM YYYY hh:mm TT",
                yValueFormatString: "#,###.###",            
                xValueType: "dateTime",
                markerType: 'none',
                dataPoints: Array.isArray(value.datapoints) ? value.datapoints?.map(value => ({
                  y: value[0] || null,
                  x: value[1] * 1000 // new Date(value[1] * 1000)
                })) : []
              }) 
            }            
          } else {
            reply
              .code(500)
              .send("The structure of JSON should be as [{ datapoints: [ number as value, number as datapoint ], [key]: value }]");
          }
         }

         screen = { ...screen, chartData: data };

         //console.log(data, result);
          await Screen.create({ ...screen, password, username }).then( result => {
              collection.screenIds.push( result.id );
          }) ;
          await collection.save();

          //await Screen.findById(id).select(['username', 'password']).then( val => console.log(val))
  
          reply.code(201).send(screen);
      } catch (e) {
          reply.code(500).send(e);
      }
    },
  
  // copy multiple documents and create new ones
  copy: async (request, reply) => { 
    const ids = request.body.ids; // array<string>
    const collectionId = request.body.collectionId;
    const collection = await Collection.findById(collectionId);

    const arrayIds = ids.map( id => new mongoose.Types.ObjectId(id) );
    const newScreens = [];

    await Screen.find({ _id: { $in: arrayIds } }).select(['+username', '+password']).then(function(doc) {
      //console.log("document ===>>> ", doc);
      
      doc.forEach(node => insertNew(node));
    }).catch((err) => {
      console.error(err);
    });
  
    function insertNew(screen) {      
      const id = new mongoose.Types.ObjectId();
      screen._id =  id;
      screen.isNew = true; //<--IMPORTANT
      const { left, right, top, bottom, width, height } = screen.initPositions;

      screen.initPositions = { 
        [collectionId]: {
          left,
          right,
          top,
          bottom,
          width,
          height,
        } 
      };

      collection.screenIds.push(id);
      screen.save();
      newScreens.push(screen);
     // console.log("screen ===> ", screen);
    }

    await collection.save();

    reply
      .code(201)
      .send(newScreens);
  },
  
  //#get the list of screens
  fetch: async (request, reply) => {
    try {
      const found = await Screen.find({ });

      const screens = { };

      await found.forEach(screen => screens[ screen._id ] = screen );

      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(screens);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  
  //#get a single screen
  get: async (request, reply) => {
    try {
      const screenId = request.params.id;
      const screen   = await Screen.findById(screenId);

      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(screen);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  
  //#update a screen
  update: async (request, reply) => {
    try {
      const screenId = request.params.id;
      const updates  = request.body;

      await Screen.findByIdAndUpdate(screenId, updates);
      const screenToUpdate = await Screen.findById(screenId);

      reply.code(200).send(screenToUpdate);
    } catch (e) {
      reply.code(500).send(e);
    }
  },

  //#update multiple screens
  updateMultiple: async (request, reply) => {
    try {
      const updates = request.body;
      const ids = [];
      //console.log(updates[0].initPositions,  '===updates')
      await updates.forEach( async screen => {
        ids.push(screen.id);
       // console.log(screen.initPositions)
        await Screen.findByIdAndUpdate(screen.id, screen);
      });
      
      const screensToUpdate = await Screen.find({ '_id': { $in: ids } });
      //console.log(ids, '===ids')
      //console.log(screensToUpdate[0].initPositions)
      reply.code(200).send(screensToUpdate);
    } catch (e) {
      reply.code(500).send(e);
    }
  },
  
  //#delete a screen
  delete: async (request, reply) => {
    try {
      const screenId = request.params.id;

      const screenToDelete = await Screen.findById(screenId);
      await Screen.findByIdAndDelete(screenId);

      let collectionId = '';

      for (const key of (screenToDelete.initPositions).keys() ) {
        collectionId = key;

        break;
      }

      const collection = await Collection.findById(collectionId);
      collection.screenIds = [ ...collection.screenIds ].filter(id => id !== screenId); //!!! not work
      console.log(collection.screenIds, screenId)
      await collection.save();

      reply.code(200).send();
    } catch (e) {
      reply.code(500).send(e);
    }
  },
};

