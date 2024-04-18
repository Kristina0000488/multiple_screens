import React, { useEffect, useContext, useState, useReducer } from 'react';
import { observer } from "mobx-react-lite";

import { Button, Input, ConfigProvider } from 'antd';

import { ScreenBlock } from '../../types';
import { changeScreenReducer, ChangeScreenActionKind } from '../../reducers/changeScreenPage';
import { storeContext } from '../../store';
import { theme } from '../configProvider';


type Props = {
    closeDrawer?: () => void, 
    screenId: string
}

function ChangeScreenPage(props: Props): JSX.Element {
    const [ isCorrect, setIsCorrect ] = useState<boolean>(true);
    const [ screen, dispatch ] = useReducer(changeScreenReducer, {} as ScreenBlock);

    const store = useContext( storeContext );
    
    useEffect( () => { 
        const screen = store.getScreenById( props.screenId );

        if (screen) {
            dispatch({
                type: ChangeScreenActionKind.ADDEDSCREEN,
                payload: JSON.parse(JSON.stringify(screen)) ,
            });             
        }
    }, [ ] ) 


    const onSubmit = async (event: React.FormEvent) => {        
        event.preventDefault();
        
        if (isCorrect) {             
            await store.changeScreen( screen );
            
            props.closeDrawer && props.closeDrawer();
        } 
    }

    const validatePath = (value: string) => {
        const expression = new RegExp(/^(https|http)\:\/\/\w+\.\w{2,3}.*$/gi);
        const result     = expression.test(value);

        const input = document.getElementById('input');

        if (!result) {
            input!.classList.add('error');
        } else {
            input!.classList.remove('error');;
        }

        dispatch({
            type: ChangeScreenActionKind.ADDEDPATH,
            payload: value,
        });
        setIsCorrect(result);
    }

    return (
        <>{ screen && <form onSubmit={ onSubmit } className='form_creating' >
            <ConfigProvider theme={{
                components: {
                    Input: theme.input
                },
                token:theme.tokenPrimary
                
            }}>
                <h4 className='label_form_creating' >Name:</h4>
                <Input 
                    type='text' 
                    value={ screen.name } 
                    required
                    onChange={ (e: React.FormEvent<HTMLInputElement>) => dispatch({
                        type: ChangeScreenActionKind.ADDEDNAME,
                        payload: e.currentTarget.value,
                    }) }
                />
                <h4 className='label_form_creating' >Url:</h4>            
                <Input 
                    value={ screen.path } 
                    type='text'
                    id='input'
                    required
                    onChange={ (e: React.FormEvent<HTMLInputElement>) => validatePath(e.currentTarget.value) } 
                />
                <h4 className='label_form_creating' >Update time (seconds):</h4>                
                <Input 
                    type="number" 
                    value={ screen.updTime } 
                    min={1}
                    placeholder='Please enter an update time (seconds)'
                    onChange={ (e: React.FormEvent<HTMLInputElement>) => dispatch({
                        type: ChangeScreenActionKind.ADDEDUPDTIME,
                        payload: Number(e.currentTarget.value),
                    }) }
                />   
                <Button 
                    style={{ width: '50%' }} 
                    type='primary' 
                    htmlType="submit"
                    className='submit_btn'
                >
                    Submit
                </Button>
            </ConfigProvider>
        </form> }</>
    )
}

export default observer(ChangeScreenPage);
