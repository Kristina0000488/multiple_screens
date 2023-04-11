import React, { useState, useCallback, useMemo } from 'react';

import ScreenBlock from './components/ScreenBlock';
import { locationScreenBlockType } from './types';

import './css/App.css';

type elem = {
  id: string;
  differenceY: number;
}

function random_choice<T>(list:T[] ) {
  return list[Math.floor(Math.random() * list.length)];
}

function App() {
  const [ isResize, setIsResize   ] = useState<boolean>(false);
  const [ startMove, setStartMove ] = useState<boolean>(false);
  const [ endMove, setEndMove     ] = useState<boolean>(false);
  const [ locations, setLocations ] = useState<locationScreenBlockType>({} as locationScreenBlockType);
  const [ currentBlockId, setCurrentBlockId ] = useState<string>('');
  //const [ closeElems, setCloseElems ] = useState<Object>({});

 
  const screens = [
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
  ];

  const checkEquality = useMemo( () => {
    const step = 20;

    const currentBottomScreen = locations[ currentBlockId ]?.bottom;
    const range = [ currentBottomScreen - step || 0, currentBottomScreen + step || 0];
        
    if (locations) {      
      let closeElems: Array<elem> = [];

      for (let i in locations) {
       // const elem = document.getElementById(i);
       // elem!.style.borderBottom = '';

        if ( i !== currentBlockId ) {
          const anotherBottomScreen = locations[i].bottom;                    
          const elem = document.getElementById(i);

          elem!.style.borderBottom = '';

          if (anotherBottomScreen > range[0] && anotherBottomScreen < range[1] && anotherBottomScreen !== 0) {
            closeElems.push({ 
              id: i, 
              differenceY: Math.abs(currentBottomScreen - anotherBottomScreen),
            });
          } else {
            elem!.style.borderBottom = '';
          }          
        }
      }

      if ( closeElems.length > 0 ) {    
        let lowestelem : elem = {} as elem;

        for (let i = 0; i < closeElems.length; i++) {
          if ( lowestelem.differenceY && lowestelem.differenceY > closeElems[i].differenceY ) {
            lowestelem = closeElems[i];
          } else if ( !lowestelem.differenceY ) {
            lowestelem = closeElems[i];
          }
        }

        if (lowestelem) {
          const elem = document.getElementById(lowestelem.id);
  
          if (elem) elem.style.borderBottom = '10px solid blue';
        }     
        
        if (endMove) 
      }
    }
  }, [ locations ] )
  
  return (
    <div className="App" id="app">
      <button onClick={ () => {
        setIsResize(false);
        setStartMove(true);
        setEndMove(false);
      } }>move</button>
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
