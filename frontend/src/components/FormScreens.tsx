import React, { useEffect, useCallback, useState, memo, useMemo, FormEventHandler } from 'react';

import { collectionsType } from '../types';
import { set } from 'mobx';



type Props = {
    toSubmit: (url: string, name: string, updTime: number, idCollection: string) => void;
    collections: collectionsType;
}

function FormScreens(props: Props) {
    const [ url, setUrl ] = useState<string>('');
    const [ name, setName ] = useState<string>('');
    const [ updTime, setUpdTime ] = useState<number>(0);
    const [ idCollection, setIdCollection ] = useState<string>('');
    const [ isCorrect, setIsCorrect ] = useState<boolean>(false);

    useEffect(() => {
        if (props.collections) {
            setIdCollection(props.collections[0].id);
        }
    }, []);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isCorrect) {             
            props.toSubmit(url, name, updTime !== 0 ? updTime : 5000, idCollection);
        } 
    }

    const validateValue = (value: string) => {
        const expression = new RegExp(/^(https|http)\:\/\/\w+\.\w{2,3}.*$/gi);
        const result     = expression.test(value);

        const input = document.getElementById('input');

        if (!result) {
            input!.className = 'error';
        } else {
            input!.className = '';
        }

        setUrl(value);
        setIsCorrect(result);
    }

    return (
        <form onSubmit={ onSubmit }>
            <input 
                type='text' 
                id='input'
                value={ url } 
                required
                placeholder='path'
                onChange={ (e: React.FormEvent<HTMLInputElement>) => validateValue(e.currentTarget.value) } 
            />
            <input 
                type='text' 
                id='input2'
                required
                value={ name } 
                placeholder='name'
                onChange={ (e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value) } 
            />
            <input 
                type="number" 
                id='input3'
                value={ updTime } 
                placeholder='update time in seconds'
                onChange={ (e: React.FormEvent<HTMLInputElement>) => setUpdTime(+e.currentTarget.value * 1000) } 
            />
            <>
                <label htmlFor="collections">Choose a colllection:</label>
                { props.collections && <select 
                    name="collections" 
                    id="collections" 
                    onSelect={ (e: React.FormEvent<HTMLSelectElement>) => setIdCollection(e.currentTarget.value)}
                >
                    { props.collections.map((collection, id) => <option key={ id } value={ collection.id }>
                        { collection.name }
                    </option>) }
                </select>}
            </>
            <button>Submit</button>
        </form>
    )
}

export default FormScreens;