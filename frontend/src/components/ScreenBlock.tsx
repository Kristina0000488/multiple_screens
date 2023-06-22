import React, { useEffect, useCallback, useState, memo, useMemo } from 'react';

import { locationScreenBlockType, locationType } from '../types';

import '../css/ScreenBlock.css';


type Props = {
    path: string;
    updTime: number;
    name: string;
    id: string;
    isResize: boolean;
    _startMove: boolean;
    _endMove: boolean;
    initPosition?: locationType<number>;
    passLocation: ( location: locationScreenBlockType ) => void;
    remove: ( id: string ) => void;
}


function ScreenBlock(props: Props) { 
    const { 
        path, 
        id='', 
        name, 
        updTime=5000,
        _startMove, 
        _endMove, 
        passLocation, 
        initPosition={} as locationType<number>, 
        remove 
    } = props;   
    
    //const id = useMemo( () => _id, [] );

    let mousePosition;
    let offset = [ 0, 0 ];
    let div: HTMLElement | null = null;
    let isDown = false;
    let idParentElem = '';
    let IFrameId = `frame-${ id }`;

    useEffect( () => {         
        changePosition(id);
        
        idParentElem = div!.parentElement?.id || '';

        const upd = setInterval(() => updIFrame(IFrameId), updTime);

        return () => clearInterval(upd);
    }, [ ] );    

    useEffect( () => changePosition(id), [ initPosition ] );    

    useEffect( () => { 
        if ( _startMove ) start();
        if ( _endMove ) end();
    }, [ _startMove, _endMove ] );

    const updIFrame = (id: string) => { console.log('upd')
        const iframe = document.getElementById(id) as HTMLIFrameElement;

        if (iframe)iframe.contentDocument?.location.reload();
        // iframe.src = iframe.src;
    }

    const changePosition = ( id: string ) => {
        div = document.getElementById(id);

        if ( initPosition && div ) 
        {
            div!.style.left = initPosition.left + 'px';
            div!.style.top = initPosition.top + 'px';
            div!.style.right = initPosition.right + 'px';
            div!.style.bottom = initPosition.bottom + 'px';
            div!.style.width = initPosition.width ? initPosition.width + 'px' : '300px';
            div!.style.height = initPosition.height ? initPosition.height + 'px' : '300px';
        }
    }

    const getPosition = ( id: string ) => {
        div = document.getElementById(id);
        
        return {
            left: +div!.style.left.replace( 'px', '' ), 
            top: +div!.style.top.replace( 'px', '' ),
            bottom: +div!.style.top.replace( 'px', '') + div!.offsetHeight,
            right: +div!.style.right.replace( 'px', '' ),
            width: +div!.style.width.replace( 'px', '' ),
            height: +div!.style.height.replace( 'px', '' ),
        }
    }

    const startMove = useCallback( (e: MouseEvent) => {
        isDown = true;

        if (div) 
        {
            offset = [
                div.offsetLeft - e.clientX,
                div.offsetTop - e.clientY
            ] 
        } 

        const rectX = div?.getBoundingClientRect().left || 0;
        const rectY = div?.getBoundingClientRect().top || 0;

        const width  = div?.offsetWidth;
        const height = div?.offsetHeight;

        const x = e.clientX - rectX; 
        const y = e.clientY - rectY; 

        const step = 15;

        const blockedX = [ width! - step, width || 0 ];
        const blockedY = [ height! - step, height || 0 ];
        
        if ( x > blockedX[0] && x < blockedX[1] && y > blockedY[0] && y < blockedY[1] ) {
            document.removeEventListener('mousemove', move, true);
        } else {     
            document.addEventListener('mousemove', move, true);  
        }
    }, [ ] )

    const endMove = useCallback( (event: MouseEvent) => {
        isDown = false;
    }, [ ] );

    const move = useCallback( (event: MouseEvent) => {
        event.preventDefault();

        div = document.getElementById(id);
        const startMove = document.getElementsByClassName(`start`).length > 0;
        const parentElem = document.getElementById(idParentElem);
        
        if (isDown && div && parentElem && startMove) 
        {
            mousePosition = {      
                x : event.clientX,
                y : event.clientY,  
            };
            
            const x = (mousePosition.x + offset[0]);
            const y = (mousePosition.y + offset[1]);
  
            const x_screen = parentElem?.offsetWidth;
            const y_screen = parentElem?.offsetHeight;
  
            const right  = x_screen - div.offsetWidth;
            const bottom = y_screen - div.offsetHeight;
            console.log(div.style.width, '000')
            
            div.style.left = ( x < 0 || x === 0 ) ? '0' : ( x > right || x === right ) ? right + 'px' : x + 'px';
            div.style.top  = ( y < 0 || y === 0 ) ? '0' : ( y > bottom || y === bottom ) ? bottom + 'px' : y + 'px';
            div.style.zIndex = '10';

            passLocation({ 
                [ id ]: { ...getPosition(id) }
            }); 
        }
    }, [ ] );

    function start() { 
        div = document.getElementById(id);

        if (div) resize_ob.observe( div ); 
      
        if (div) {            
            div?.addEventListener('mousedown', startMove, true);          
            div?.addEventListener('mouseup', endMove, true);
            div?.addEventListener("dragstart", () => false );

            passLocation({ 
                [ id ]: { ...getPosition(id) }
            });
        }
    }
  
    function end()
    {  
        document.removeEventListener('mousemove', move, true);
        
        div?.removeEventListener('mousedown', startMove, true);
        div?.removeEventListener('mouseup', endMove, true);  

        if (div) resize_ob.unobserve(div);
    }

    const resize_ob = new ResizeObserver(function(entries) {
        const { width, height } = entries[0].contentRect;
    
        if (div && width !== 0 && height !== 0) {
            passLocation({ 
                [ id ]: {
                    left: +div.style.left.replace( 'px', '' ), 
                    top: +div.style.top.replace( 'px', '' ),
                    bottom: +div.style.top.replace( 'px', '' ) + div.offsetHeight,
                    right: +div.style.right.replace( 'px', '' ),
                    width: +div.style.width.replace( 'px', '' ),
                    height: +div.style.height.replace( 'px', '' ),
                }
            });
        }
    });
    
    return (
        <div className={ `screenBlock ${ _startMove ? 'resize' : '' }` } id={ id } >
            { <button onClick={ () => {
                div?.removeEventListener('mousedown', startMove, true);
                div?.removeEventListener('mouseup', endMove, true);          
                document.removeEventListener('mousemove', move, true);
                resize_ob.disconnect();
                remove( id );
            } }>del</button> }
            <p>{ id }</p>
            <iframe id={ IFrameId } title={ id } src={ path } allowFullScreen />
        </div>
    )
}

export default ScreenBlock;
