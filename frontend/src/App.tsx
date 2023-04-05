import React, { useState, useCallback } from 'react';

import ScreenBlock from './components/ScreenBlock';
import { locationScreenBlockType } from './types';

import './css/App.css';


function App() {
  const [ isResize, setIsResize   ] = useState<boolean>(false);
  const [ startMove, setStartMove ] = useState<boolean>(false);
  const [ endMove, setEndMove     ] = useState<boolean>(false);
  const [ locations, setLocations ] = useState<Object>({});
 
  const screens = [
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
  ];

  function checkEquality(location: locationScreenBlockType)
  {
    if ( endMove ) return;
    
    setLocations( (prev) => { 
      return { ...prev, ...location };
    } );

    const step = 10;
    
    if (locations) {
      for (let i in locations) {
        console.log(i)
        if ( !(i in location) ) {
          console.log('Location')
        }
      }
    }
    
    console.log(locations)

  }
  //checkEquality({'screen': { top: 222, left: 10}})
  console.log(locations)
  return (
    <div className="App" id="app">
      <button onClick={ () => {
        setIsResize(false);
        setStartMove(true);
        setEndMove(false);
      } }>move</button>
      <button onClick={ () => { 
        setIsResize(true);
        setEndMove(true);
        setStartMove(false)
      } }>size</button>
      <button onClick={ () => {
        setIsResize(false);
        setEndMove(true);
        setStartMove(false)
      } }>ok</button>
      { 
        screens && screens.map( (screen, id) => <ScreenBlock 
          key={ id } 
          id={ screen.id + id } 
          path={ screen.path } 
          _startMove={ startMove }
          _endMove={ endMove }
          isResize={ isResize }
          passLocation={ async (location: locationScreenBlockType) => {
            //checkEquality(location)
          } }
        /> ) 
      }      
    </div>
  );
}

export default App;
