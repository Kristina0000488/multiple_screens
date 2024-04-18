import React, { useRef, useEffect, useState } from 'react';

import './style.css'


type Props<T> = {
    items: T[];
    handlerClick?: (items: Array<T>) => void;
    title?: string;
    readOnly?: boolean;
}

function Checkbox<T extends Record<string, unknown>>(props: Props<T>) { 
    const [ data, setData ] = useState<Array<T>>([]);

    const divRef = useRef<HTMLDivElement | null>(null);

    const { items, handlerClick, title='Select', readOnly=false } = props;

    useEffect( () => setData( items ), [] ); 

    const onClick = () => { 
        if ( divRef!.current!.className.includes( 'visible' ) ) {
            divRef!.current!.classList.remove('visible');
        } else {
            divRef!.current!.classList.add('visible');
        }        
    }

    const onClickCheckbox = async (done: boolean, index: number) => { 
        let arr = data[ index ] as T & { checked: boolean };
        arr.checked = !done;

        let clone = [ ...data ];
        clone[ index ] = arr;
        
        await setData([ ...clone ]);
        
        handlerClick!( data );
    }
        
    return ( 
        <div className="dropdown-check-list" tabIndex={ 100 } ref={ divRef } >
            <div className="anchor" onClick={ onClick }>
                { title }
            </div>
            { data && <ul className="items">
                { data.map( ({ checked, name }, idx) => {
                    return <li key={ idx }>
                        <input 
                            type="checkbox" 
                            onChange={ () => onClickCheckbox(checked as boolean, idx) } 
                            hidden={ readOnly }
                            defaultChecked={ checked as boolean }
                        />
                        { name as string }
                    </li> 
                } ) }
            </ul> }
        </div> 
    )
}

export default (Checkbox)