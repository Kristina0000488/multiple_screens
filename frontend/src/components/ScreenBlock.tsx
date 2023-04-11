import React, { useEffect, useCallback, useState } from 'react';

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
    const [ blockMove, setBlockMove ] = useState<boolean>(false);

    const { path, id, _startMove, _endMove, passLocation } = props;   

    let idParentElem = 'app';

    let mousePosition;
    let offset = [0,0];
    let div: HTMLElement | null = document.getElementById(id);
    let isDown = false;

    useEffect( () => {
        if ( _startMove ) start();
        if ( _endMove ) end();
    }, [ _startMove, _endMove ] );

   /* useEffect( () => {
        div = document.getElementById(id);
        div!.onclick?( (e: MouseEvent) => click(e) ) : null;
    }, [] );*/


    const click = useCallback( (e: MouseEvent) => {
        const rectX = div?.getBoundingClientRect().left || 0;
        const rectY = div?.getBoundingClientRect().top || 0;
        const width = div?.offsetWidth;
        const height = div?.offsetHeight;

        const x = e.clientX - rectX; 
        const y = e.clientY - rectY; 

        const step = 15;

        const blockedX = [ width! - step, width || 0 ];
        const blockedY = [ height! - step, height || 0 ];

        if ( x > blockedX[0] && x < blockedX[1] && y > blockedY[0] && y < blockedY[1] ) {
           //document.removeEventListener('mousemove', move, true);
           div?.removeEventListener('mousedown', startMove, true);
           div?.removeEventListener('mouseup', endMove, true);
           //div?.removeEventListener('click', click, true);
     
           document.removeEventListener('mousemove', move, true);
           //console.log('click))', blockMove);
        } else {
            //document.addEventListener('mousemove', move, true);
           // console.log('click(((', blockMove); 
           div?.addEventListener('mousedown', startMove, true);          
           document.addEventListener('mousemove', move, true);
           div?.addEventListener('mouseup', endMove, true);
        }
    }, [] );

    const startMove = useCallback( (e: MouseEvent) => {
        isDown = true;
  
        if (div) {
          offset = [
              div.offsetLeft - e.clientX,
              div.offsetTop - e.clientY
          ] 
        } 

        const rectX = div?.getBoundingClientRect().left || 0;
        const rectY = div?.getBoundingClientRect().top || 0;
        const width = div?.offsetWidth;
        const height = div?.offsetHeight;

        const x = e.clientX - rectX; 
        const y = e.clientY - rectY; 

        const step = 15;

        const blockedX = [ width! - step, width || 0 ];
        const blockedY = [ height! - step, height || 0 ];

        if ( x > blockedX[0] && x < blockedX[1] && y > blockedY[0] && y < blockedY[1] ) {
           //document.removeEventListener('mousemove', move, true);
           //div?.removeEventListener('mousedown', startMove, true);
           div?.removeEventListener('mouseup', endMove, true);
           //div?.removeEventListener('click', click, true);
     
           document.removeEventListener('mousemove', move, true);
           //console.log('click))', blockMove);
        } else {
            //document.addEventListener('mousemove', move, true);
           // console.log('click(((', blockMove); 
           //div?.addEventListener('mousedown', startMove, true);          
           document.addEventListener('mousemove', move, true);
           div?.addEventListener('mouseup', endMove, true);
        }
    }, [] )

    const endMove = useCallback( (e: MouseEvent) => {
        isDown = false;
    }, [] );

    const move = useCallback( (event: MouseEvent) => {
        event.preventDefault();

        div = document.getElementById(id);
        const parentElem = document.getElementById(idParentElem);
        
        if (isDown && div && parentElem) 
        {
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

            passLocation({ 
                [ id ]: {
                    left: +div.style.left.replace( 'px', '' ), 
                    top: +div.style.top.replace( 'px', '' ),
                    bottom: +div.style.top.replace( 'px', '') + div.offsetHeight,
                }
            });  //console.log(div.offsetHeight)
        }
    }, [] );

    function start()
    { 
        div = document.getElementById(id);
        
        div?.addEventListener('mousedown', startMove, true);          
        document.addEventListener('mousemove', move, true);
        div?.addEventListener('mouseup', endMove, true);
       // div?.addEventListener('click', click, true);
      
        if (div) {
            passLocation({ 
                [ id ]: {
                    left: +div.style.left.replace( 'px', '' ), 
                    top: +div.style.top.replace( 'px', '' ),
                    bottom: +div.style.top.replace( 'px', '') + div.offsetHeight,
                }
            });
        }
    }
  
    function end()
    { 
        div?.removeEventListener('mousedown', startMove, true);
        div?.removeEventListener('mouseup', endMove, true);
        div?.removeEventListener('click', click, true);
  
        document.removeEventListener('mousemove', move, true);
    }

    return (
        <div className={`screenBlock ${ _startMove ? 'resize' : ''}`} id={ id }>
            <button>del</button>
            <p>{ id }</p>
            <iframe src={ path } allowFullScreen />
        </div>
    )
}

export default ScreenBlock;
