import React, { useEffect, useCallback, useRef } from 'react';
import { observer } from "mobx-react-lite";


import { Button, Popconfirm, ConfigProvider } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined, EditOutlined, CheckOutlined, CopyOutlined } from '@ant-design/icons';

import { LocationScreenBlock, Location, ScreenBlock as ScreenBlockType, ChartData } from '../types';
import { theme } from '../pages/configProvider';
import Chart from './Chart';


import '../style/ScreenBlock.css';


type Props = ScreenBlockType<Location> & {
    isResize: boolean;
    _startMove: boolean;
    _endMove: boolean;
    passLocation: ( location: LocationScreenBlock ) => void;
    handlerEdit: ( ) => void;
    remove: ( id: string ) => void;
    isHidden?: boolean;
    idCollection?: string;
    initPositions: Location; 
    chartData?: ChartData[];
    isCopied: boolean;
    onCopy: ( ) => void;
}


function ScreenBlock(props: Props) { 
    const iframeRef = useRef(null);

    const { 
        path, 
        id='', 
        updTime=5000,
        _startMove, 
        _endMove, 
        isHidden=false,
        passLocation, 
        initPositions, 
        remove,
        name,
        handlerEdit,
        isCopied,
        onCopy,
        chartData
    } = props;   
    
    let mousePosition;
    let offset = [ 0, 0 ];
    let div = document.getElementById(id);
    let isDown = false;
    let idParentElem = div?.parentElement?.id;
    let IFrameId = `frame-${ id }`;

    useEffect( () => {         
        changePosition(id);

        div = document.getElementById(id);
        idParentElem = div?.parentElement?.id || '';

        if (!chartData) {
            const upd = setInterval( () => updIFrame(IFrameId), updTime * 1000 );

            return () => clearInterval(upd);
        }
    }, [ ] );   
    
    useEffect( () => { 
        if ( _startMove ) start();
        if ( _endMove ) end(); console.log(_startMove, _endMove)
    }, [ _startMove, _endMove ] );

    const updIFrame = (id: string) => { 
        const iframe = document.getElementById(id) as HTMLIFrameElement;
        //const iframeCopy = document.getElementById(id) as HTMLIFrameElement;

        //iframe.src += ''; 

        iframe.contentDocument?.location.reload();
    }
    
    const changePosition = ( id: string ) => {
        div = document.getElementById(id);
        
        if ( initPositions && div ) 
        {
            const { left, top, right, bottom, width, height } = initPositions;

            div!.style.left   = left + 'px';
            div!.style.top    = top + 'px';
            div!.style.right  = right + 'px';
            div!.style.bottom = bottom + 'px';
            div!.style.width  = width ? width + 'px' : '300px';
            div!.style.height = height ? height + 'px' : '300px';
        }
    }

    const getPosition = ( id: string ) => {
        div = document.getElementById(id);
        
        const { width, height, top, left, right, bottom } = div!.getClientRects()[ 0 ];

        const position: Location = { width, height, top, left, right, bottom } ;
        
        return position;
    }

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

        const isMovedMode = document.getElementsByClassName(`start`).length > 0;
        const parentElem = document.getElementById(idParentElem ?? '');

        if (isDown && div && parentElem && isMovedMode) 
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
            
            div.style.left = ( x < 0 || x === 0 ) ? '0' : ( x > right || x === right ) ? right + 'px' : x + 'px';
            div.style.top  = ( y < 0 || y === 0 ) ? '0' : ( y > bottom || y === bottom ) ? bottom + 'px' : y + 'px';
            div.style.zIndex = '5';

            passLocation({ 
                [ id ]: getPosition(id)
            }); 
        }
    }, [ ] );

    function start() { 
        div = document.getElementById(id);
      
        if (div) {            
            div.addEventListener('mousedown', startMove, true);          
            div.addEventListener('mouseup', endMove, true);
            div.addEventListener("dragstart", () => false );

            resize_ob.observe( div );             

            //div.style.cursor = 'grab';
        }
    };
      
    function end()
    {  
        document.removeEventListener('mousemove', move, true);
        
        div!.removeEventListener('mousedown', startMove, true);
        div!.removeEventListener('mouseup', endMove, true);  

        resize_ob.unobserve(div!);

        //div!.style.cursor = 'pointer';
    }

    const resize_ob = new ResizeObserver(function(entries) {
        try { 
            const { width, height } = entries[0].contentRect;
                    
            if (div && width !== 0 && height !== 0) {   
                const currentPosition = getPosition(id);

                passLocation({ 
                    [ id ]: currentPosition
                });
            }
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <div className={ `screenBlock ${ _startMove ? 'resize' : '' }` } id={ id } hidden={ isHidden } >
            <div className='header_screenBlock'>
                { name }
                { _endMove && <div>
                    <ConfigProvider theme={{ token: theme.tokenText }}>
                        <Button 
                            className='copyBtn_ChangeCollection' 
                            type="text" 
                            onClick={ () => onCopy() }
                        >{ 
                            !!isCopied ? 
                            <> <CheckOutlined />Copied </> : 
                            <CopyOutlined />
                        }</Button> 
                        <Button type='text' shape="circle" onClick={ handlerEdit }>
                            <EditOutlined />
                        </Button> 
                        <Popconfirm
                            title="Delete the screen"
                            description="Are you sure to delete this screen?"
                            icon={ <QuestionCircleOutlined /> }
                            onConfirm={ () => {
                                div?.removeEventListener('mousedown', startMove, true);
                                div?.removeEventListener('mouseup', endMove, true);          
                                document.removeEventListener('mousemove', move, true);
                                resize_ob.disconnect();
                                remove(id);
                            }  }
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ rootClassName: 'popconfirm_Okbtn' }}
                            cancelButtonProps={{ rootClassName: 'popconfirm_Onbtn' }}
                        >
                            <Button type='text' shape="circle" >
                                <DeleteOutlined />
                            </Button> 
                        </Popconfirm> 
                    </ConfigProvider> 
                </div> }
            </div> 
            { 
                chartData && chartData.length > 0 ? 
                <Chart data={ chartData } /> : 
                <iframe 
                    id={ IFrameId } 
                    ref={ iframeRef } 
                    title={ id } 
                    src={ path }  
                    width="100%" 
                    style={{ border: 0, height: "50vh" }}
                    allowFullScreen
                /> 
            }           
        </div>
    )
}

export default observer(ScreenBlock);