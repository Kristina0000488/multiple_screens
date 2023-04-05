import React, { useEffect, useCallback } from 'react';

import { locationScreenBlockType } from '../types';

import '../css/ScreenBlock.css';


type Props = {
    path: string;
    id: string;
    isResize: boolean;
    _startMove: boolean;
    _endMove: boolean;
    passLocation: ( location: locationScreenBlockType ) => void;
}

function ScreenBlock(props: Props) { 
    const { path, id, isResize, _startMove, _endMove, passLocation } = props;   

    let idParentElem = 'app';

    let mousePosition;
    let offset = [0,0];
    let div: HTMLElement | null = document.getElementById(id);
    let isDown = false;

    useEffect( () => {
        if ( _startMove ) start();
        if ( _endMove ) end();
    }, [ _startMove, _endMove ] );

    const startMove = useCallback( (e: MouseEvent) => {
        isDown = true;
  
        if (div) {
          offset = [
              div.offsetLeft - e.clientX,
              div.offsetTop - e.clientY
          ] 
        } 
    }, [] )

    const endMove = useCallback( (e: MouseEvent) => {
        isDown = false;
    }, [] );

    const move = useCallback( (event: MouseEvent) => {
        event.preventDefault();

        div = document.getElementById(id);
        const parentElem = document.getElementById(idParentElem);
        
        if (isDown && div && parentElem) {
            mousePosition = {      
                x : event.clientX,
                y : event.clientY      
            };
            const x = (mousePosition.x + offset[0]);
            const y = (mousePosition.y + offset[1]);
  
            const x_screen = parentElem?.offsetWidth;
            const y_screen = parentElem?.offsetHeight;
  
            const right  = x_screen - div.offsetWidth;
            const bottom = y_screen - div.offsetHeight;
            
            div.style.left = ( x < 0 || x === 0 ) ? '0' : ( x > right || x === right ) ? right + 'px' : x + 'px';
            div.style.top  = ( y < 0 || y === 0 ) ? '0' : ( y > bottom || y === bottom ) ? bottom + 'px' : y + 'px';

            passLocation( { 
                [ id ]: {
                    left: +div.style.left.replace( 'px', '' ), 
                    top: +div.style.top.replace( 'px', '' ),
                }
            } );
        }
    }, [] );

    function start()
    { 
        div = document.getElementById(id);
        
        div?.addEventListener('mousedown', startMove, true);  
        div?.addEventListener('mouseup', endMove, true);
      
        document.addEventListener('mousemove', move, true);
    }
  
    function end()
    { 
        div?.removeEventListener('mousedown', startMove, true);
        div?.removeEventListener('mouseup', endMove, true);
  
        document.removeEventListener('mousemove', move, true);
    }

    return (
        <div className={`screenBlock ${ isResize ? 'resize' : '' }`} id={ id }>
            <button>del</button>
            <iframe src={ path } allowFullScreen />
        </div>
    )
}

export default ScreenBlock;
