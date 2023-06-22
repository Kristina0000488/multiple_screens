import React, { useEffect, useCallback, useState, memo, useMemo, FormEventHandler } from 'react';

import { screenBlockType, arrIdScreensType } from '../types';
import { set } from 'mobx';



type Props = {
    toSubmit: (name: string, collection: arrIdScreensType) => void;
    screens: screenBlockType[];
}

function FormCollections(props: Props) {
    const [ name, setName ] = useState<string>('');
    const [ collection, setCollection ] = useState<{ [ key: string ]: boolean }>({});

    const { screens, toSubmit } = props;

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const arr: arrIdScreensType = Object.keys(collection);

        toSubmit(name, arr);
    }

    useEffect(() => {
        //console.log(collection);
    }, [ collection ])

    const onClickCheckbox = (id: string) => {
        if (!collection[ id ]) {
            setCollection((prev) => ({ ...prev, [ id ]: true }));
        } else {
            const newCollection = { ...collection };

            delete newCollection[ id ];

            setCollection(newCollection);
        }

    }

    const renderCheckbox = (): React.ReactElement => { 
       // console.log(screens)
        return <div>
            { screens && screens.map((screen, id) => {
                return <label htmlFor={ screen.id } key={ id }> 
                    <input type="checkbox" value={ screen.id } id={ screen.id } onClick={() => onClickCheckbox(screen.id)} />
                    { screen.name}
                </label>
            }) }
        </div>;
        
    }

    return (
        <form onSubmit={ onSubmit }>
            <input 
                type='text' 
                id='input'
                value={ name } 
                placeholder='name'
                onChange={ (e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value) } 
            />
            { screens && renderCheckbox() }
            <button>Submit</button>
        </form>
    )
}

export default FormCollections;