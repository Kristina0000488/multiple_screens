import React, { useState, useCallback, useMemo } from 'react';

import ScreenBlock from './components/ScreenBlock';
import { locationScreenBlockType, screenBlockType } from './types';

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
 
  const screens: screenBlockType[] = [
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen', initPosition: { x: 10, y: 10 } },
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen', initPosition: { x: 250, y: 100 } },
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen', initPosition: { x: 450, y: 300 } },
  ];

  const checkEquality = useMemo( () => {
    const step = 20;

    const currentBottomScreen = locations[ currentBlockId ]?.bottom;
    const range = [ currentBottomScreen - step || 0, currentBottomScreen + step || 0];
        
    if (locations) {      
      let closeElems: Array<elem> = [];

      const div = document.getElementById(`line-${ currentBlockId }`);
      div?.parentNode?.removeChild(div);

      for (let i in locations) {
        if ( i !== currentBlockId ) {
          const anotherBottomScreen = locations[i].bottom; 

          const div = document.getElementById(`line-${ i }`);
          div?.parentNode?.removeChild(div);

          if (anotherBottomScreen > range[0] && anotherBottomScreen < range[1] && anotherBottomScreen !== 0) {
            closeElems.push({ 
              id: i, 
              differenceY: Math.abs(currentBottomScreen - anotherBottomScreen),
            });
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
  
          if (elem) {
            const div = document.createElement('div');

            div.id = `line-${ lowestelem.id }`;

            div.style.position = 'absolute'; 
            div.style.left     = elem.getBoundingClientRect().left - 8 + 'px'; 
            div.style.top      = elem.getBoundingClientRect().bottom + 2 + 'px';
            div.style.width    = elem.offsetWidth + 16 + 'px';
            div.className      = 'line';           

            document.body.appendChild(div);
          }
        }     
      }
    }
  }, [ locations ] );

  const removeBorder = useMemo( () => {        
    if (locations && endMove) {      
      for (let i in locations) {
       const div = document.getElementById(`line-${ i }`);

       div?.parentNode?.removeChild(div);
      }
    }
  }, [ endMove ] );
  
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
          initPosition={ screen.initPosition }
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
