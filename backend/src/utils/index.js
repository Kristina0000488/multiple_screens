const Screen = require('../models/screen');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const base64 = require('base-64');

const { Headers } = fetch;

let requestLoops = [];

async function updateChartData(screen, connection) {

  try {
    const updTime = screen.updTime || 300; //5 mins

    const creds = await Screen.findOne({ _id: screen._id }).select(['username', 'password']);
    
    let requestLoop = setInterval(async function() {
        const result = await getChartData(screen.path, creds?.password, creds?.username);

        //console.log(result, ' ==== result')

        await Screen.findByIdAndUpdate({ _id: screen._id }, { $set: { 'chartData': result } });

        const screenToUpdate = await Screen.findById(screen._id);

        console.log(screenToUpdate, ' ==== screenToUpdate')

        //connection.socket.send(screenToUpdate);

    }, updTime * 1000);

    requestLoops.push(requestLoop);
  } catch (error) {
    console.log(error);
  }
    //console.log('start func upd')

    
    //console.log(requestLoops)
}


async function getChartData(path, password, username) {
  try {
    let headers = new Headers();
            
    if ( password && username ) {
        headers.set('Authorization', 'Basic ' + base64.encode(username + ":" + password));
    };

    const data = [];
   // let result = null;

    //await fetch(path).then( res => result = res.json() );
    const req = await fetch(path);
    const result = await req.json();
    
    //console.log(result, '  -test')

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
        }
    }

    return data;
  } catch (error) {
    console.log(error);
  }

}

async function getCharts() {
  const charts = await Screen.find({
    "chartData": {
      "$exists": true,
      "$ne": []
    }
  });

  return charts;
}

module.exports = { getCharts, updateChartData };