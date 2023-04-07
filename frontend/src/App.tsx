import React, { useState, useCallback, useMemo } from 'react';

import ScreenBlock from './components/ScreenBlock';
import { locationScreenBlockType } from './types';

import './css/App.css';


function App() {
  const [ isResize, setIsResize   ] = useState<boolean>(false);
  const [ startMove, setStartMove ] = useState<boolean>(false);
  const [ endMove, setEndMove     ] = useState<boolean>(false);
  const [ locations, setLocations ] = useState<locationScreenBlockType>({} as locationScreenBlockType);
  const [ currentBlockId, setCurrentBlockId ] = useState<string>('');
 
  const screens = [
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
  ];

  const checkEquality = useMemo( () => {
    if ( endMove ) return;

    const step = 20;

    const currentBottomScreen = locations[ currentBlockId ]?.bottom;
    const range = [ currentBottomScreen - step || 0, currentBottomScreen + step || 0];
    
    //console.log(range)
        
    if (locations) {
      for (let i in locations) {
        if ( i !== currentBlockId ) {
          const anotherBottomScreen = locations[i].bottom;
          console.log(anotherBottomScreen, range)
          if (anotherBottomScreen > range[0] && anotherBottomScreen < range[1] && anotherBottomScreen !== 0) {
            console.log('lololo')
          }
          
        }
      }
    }
  }, [ locations ])
  
  //console.log(locations)
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
        setStartMove(false);
        setCurrentBlockId('');
      } }>size</button>
      <button onClick={ () => {
        setIsResize(false);
        setEndMove(true);
        setStartMove(false);
        setCurrentBlockId('');
      } }>ok</button>
      { 
        screens && screens.map( (screen, id) => <ScreenBlock 
          key={ id } 
          id={ screen.id + id } 
          path={ screen.path } 
          _startMove={ startMove }
          _endMove={ endMove }
          isResize={ isResize }
          passLocation={ (location: locationScreenBlockType) => {
            setCurrentBlockId( Object.keys(location)[0] );
            setLocations( (prev) => { 
              return { ...prev, ...location };
            } );
          } }
        /> ) 
      }      
    </div>
  );
}

export default App;
