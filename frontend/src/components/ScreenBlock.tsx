import React, { useEffect, useState } from 'react';

//import { moveScreen, removeAllListeners } from '../utils';

import '../css/ScreenBlock.css';


type Props = {
    path: string;
    id: string;
    //isResize: boolean;
    //isMove: boolean;
}

function ScreenBlock(props: Props) { 
    const [ isResize, setIsResize ] = useState(false);
    const [ isMove, setIsMove ] = useState(true);

    const { path, id } = props;   

    let idParentElem = 'app';

    let mousePosition;
    let offset = [0,0];
    let div: HTMLElement | null;
    let isDown = false;


    function startMove(e: MouseEvent) {
        isDown = true;
  
        if (div) {
          offset = [
              div.offsetLeft - e.clientX,
              div.offsetTop - e.clientY
          ] 
        } 
    }

    function endMove(e: MouseEvent) {
        isDown = false;

        div?.removeEventListener('mousedown', startMove, true);
        document.removeEventListener('mousemove', move, true);
    }

    function move(event: MouseEvent)
    {
        event.preventDefault();
            
        const parentElem = document.getElementById(idParentElem);
        
        if (isDown && div && parentElem && isMove) {
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
        }
    }

    function start()
    {
        div = document.getElementById(id);

        div?.addEventListener('mousedown', startMove, true);  
        div?.addEventListener('mouseup', endMove, true);
      
        document.addEventListener('mousemove', move, true);
    }
  
    function end()
    {
        //div?.removeEventListener('mousedown', startMove, true);
        //div?.removeEventListener('mouseup', endMove, true);

        //document.removeEventListener('mousemove', move, true);
    }

    async function changeScreenBlock()
    {
        await setIsMove( true );  
        start();      
    }

    async function closeChangeScreenBlock()
    {
        await setIsMove( false ) ;    
        end();    
    }

    return (
        <div className={`screenBlock ${ isResize ? 'resize' : '' }`} id={ id }>
            <button>del</button>
            <button onClick={ () => changeScreenBlock() }>move</button>
            <button>size</button>
            <button onClick={ () => closeChangeScreenBlock() }>ok</button>
            <iframe src={ path } allowFullScreen />
        </div>
    )
}

export default ScreenBlock;
