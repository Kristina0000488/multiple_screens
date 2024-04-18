import React, { useContext, useState } from 'react';
import { observer } from "mobx-react-lite";

import { Button, Input, ConfigProvider } from 'antd';

import { storeContext } from '../../store';
import { theme } from '../configProvider';


const { TextArea } = Input;

type Props = {
    closeDrawer?: () => void
}

function CreatingCollectionPage(props: Props): JSX.Element {
    const [ name, setName ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');

    const store   = useContext( storeContext );

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        store.createCollection(name, description);
        props.closeDrawer && props.closeDrawer();
    }   

    return (
        <form onSubmit={ onSubmit } className='form_creating'>
            <ConfigProvider theme={{
                components: {
                    Input: theme.input,
                },
                token: {
                    colorBgTextHover: '#000000',
                    ...theme.tokenPrimary  
                }                
            }}>
                <Input 
                    type='text' 
                    id='input'
                    value={ name } 
                    placeholder='Please enter a name'
                    required
                    onChange={ (e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value) } 
                />                
                <TextArea 
                    value={ description } 
                    placeholder='Please enter a descriprion'
                    rows={ 4 }
                    onChange={ (e: React.FormEvent<HTMLTextAreaElement>) => setDescription(e.currentTarget.value) } 
                />
                <Button style={{ width: '50%' }} type='primary' htmlType="submit" className='submit_btn'>
                    Submit
                </Button>
            </ConfigProvider>
        </form>
    )
}

export default observer(CreatingCollectionPage);