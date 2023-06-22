import React, { useState, useEffect, useMemo, useContext } from 'react';
import { observer } from "mobx-react-lite";
import { makeObservable, observable, action, toJS, runInAction } from "mobx";
import ScreenBlock from '../components/ScreenBlock';
import FormPage from '../pages/FormPage';

import { locationScreenBlockType, screenBlockType, arrIdScreensType } from '../types';
import { storeContext } from '../store';
import localStorage from '../localStorage';

//import './css/App.css';

type elem = {
  id: string;
  differenceY: number;
}

function Index() {
  const [ isResize, setIsResize   ] = useState<boolean>(false);
  const [ startMove, setStartMove ] = useState<boolean>(false);
  const [ endMove, setEndMove     ] = useState<boolean>(true);
  const [ isAdd, setIsAdd         ] = useState<boolean>(false);
  const [ locations, setLocations ] = useState<locationScreenBlockType>({} as locationScreenBlockType);
  const [ currentBlockId, setCurrentBlockId ] = useState<string>('');

  const store   = useContext( storeContext );
  const screens = toJS(store.screens);
  const collections = toJS(store.collections);

  useEffect( () => {
    store.getAll();
  }, [] );

  const createLine = (lowestelem: elem, elem: HTMLElement, currentBlockId: string): void => {
    const div        = document.createElement('div');
    const leftScreen = document.getElementById(currentBlockId)?.getBoundingClientRect().left || 0;
    const leftElem   = elem.getBoundingClientRect().left;
    const rightElem  = elem.getBoundingClientRect().right;

    div.id = `line-${ lowestelem.id }`;

    div.style.position = 'absolute'; 
    div.style.top      = elem.getBoundingClientRect().bottom + 2 + 'px';
    div.style.width    = elem.offsetWidth + 30 + 'px';
    div.style.zIndex   = elem.style.zIndex;
    div.className      = 'line';        
    
    if ( leftScreen > leftElem ) {
      div.style.left  = leftElem + 'px';
      div.style.right = rightElem + 30 + 'px';
    } else { 
      div.style.left  = leftElem - 30 + 'px';
      div.style.right = rightElem + 'px';
    }

    document.body.appendChild(div);
  }

  const checkEquality = useMemo( () => {
    const step = 30;

    const currentBottomScreen = locations[ currentBlockId ]?.bottom;
    const range = [ currentBottomScreen - step || 0, currentBottomScreen + step || 0];
        
    if (locations) {      
      let closeElems: Array<elem> = [];

      const div = document.getElementById(`line-${ currentBlockId }`);
      div?.parentNode?.removeChild(div);

      for (let i in locations) {
        if ( i !== currentBlockId ) {
          const anotherBottomScreen = locations[i].bottom; 

          const line = document.getElementById(`line-${ i }`);
          line?.parentNode?.removeChild(line);

          const screen = document.getElementById(i);

          if (screen) screen!.style.zIndex = '1';
          
          if (anotherBottomScreen > range[0] && anotherBottomScreen < range[1] && anotherBottomScreen !== 0) {
            closeElems.push({ 
              id: i, 
              differenceY: Math.abs(currentBottomScreen - anotherBottomScreen),
            });
          }       
        }
      }

      if ( closeElems.length > 0 ) {    
        let lowestelem: elem = {} as elem;

        for (let i = 0; i < closeElems.length; i++) {
          if ( lowestelem.differenceY && lowestelem.differenceY > closeElems[i].differenceY ) {
            lowestelem = closeElems[i];
          } else if ( !lowestelem.differenceY ) {
            lowestelem = closeElems[i];
          }
        }

        if (lowestelem) {
          const elem = document.getElementById(lowestelem.id);
  
          if (elem) createLine(lowestelem, elem, currentBlockId);
        }     
      }
    }
  }, [ locations ] );

  const removeLine = useMemo( () => {        
    if (locations) {      
      for (let i in locations) {
       const div = document.getElementById(`line-${ i }`);

       div?.parentNode?.removeChild(div);
      }
    }
  }, [ startMove, endMove, locations ] );

  const removeScreen = (id: string) => { store.removeScreen( id ); }

  const changeScreen = (id: number, location: locationScreenBlockType, screen: screenBlockType) => {
    const newScreens = JSON.parse(JSON.stringify(screens));

    if ( newScreens[id] ) {
      const { left, top, right, bottom, width, height } = location[ screen.id ];
      
      newScreens[id].initPosition = { left, top, right, bottom, width, height };
    }

    store.updateScreens(newScreens);
  }

  
  return (
    <div className={ `App ${ startMove ? 'start' : '' } `} id="app">
      { 
        !isAdd && <>
          <button onClick={ () => {
            setIsResize(false);
            setStartMove(true);
            setEndMove(false);
          } }>
            move
          </button>
          <button onClick={ () => {
            setIsResize(false);
            setEndMove(true);
            setStartMove(false);
            setCurrentBlockId('');
            store.updateScreens(screens);
          } }>
            ok
          </button>
          <button onClick={ () => setIsAdd(true) }>
            add
          </button>
        </> 
      }
      { 
        !isAdd ? store.screens && store.screens.map( (screen, id) => <ScreenBlock 
          key={ screen.id } 
          id={ screen.id } 
          path={ screen.path } 
          name={ screen.name }
          updTime={ screen.updTime }
          _startMove={ startMove }
          _endMove={ endMove }
          isResize={ isResize }
          initPosition={ toJS(screen.initPosition) }
          remove={ removeScreen }
          passLocation={ (location: locationScreenBlockType) => {
            setCurrentBlockId( Object.keys(location)[0] );
            setLocations( (prev) => { 
              return { ...prev, ...location };
            } );
            changeScreen(id, location, screen);
          } }           
        /> ) : <FormPage 
            onClose={ () => setIsAdd(false) } 
            submitScreens={ (url: string, name: string, updTime: number, idCollection: string) => {
                store.addScreen(url, name, updTime, idCollection);
                setIsAdd(false);
            } }
            submitCollections={ (name: string, collection: arrIdScreensType) => {
              store.addCollection(name, collection);
              setIsAdd(false);
            } }
        />
      }      
    </div>
  );
}

export default observer(Index);
