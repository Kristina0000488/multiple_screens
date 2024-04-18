import React, { lazy, useContext, useState } from 'react';
import { observer } from "mobx-react-lite";

import { Button, Input, ConfigProvider, Checkbox, TimePicker } from 'antd';

import { storeContext } from '../../store';
import { theme } from '../configProvider';


type Props = {
    closeDrawer?: () => void,
    collectionId: string
}

function CreatingScreenPage(props: Props): JSX.Element {
    const [url, setUrl] = useState<string>('');
    const [name, setName] = useState<string>('test');
    const [updTime, setUpdTime] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [isChartCreating, setIsChartCreating] = useState<boolean>(false);

    const store = useContext(storeContext);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (isCorrect) {
            if (!isChartCreating) {
                store.createScreen(
                    url,
                    name,
                    updTime !== 0 ? updTime : 5,
                    props.collectionId
                );
            } else {
                store.createChartScreen(
                    url,
                    name,
                    updTime !== 0 ? updTime : 5,
                    props.collectionId,
                    username, 
                    password
                );
            }

            props.closeDrawer && props.closeDrawer();
        }
    }

    const validatePath = (value: string) => {
        const expression = new RegExp(/^(https|http)\:\/\/\w+\.\w{2,5}.*$/gi);
        const result = expression.test(value);

        const input = document.getElementById('input');

        if (!result) {
            input!.classList.add('error');
        } else {
            input!.classList.remove('error');;
        }

        setUrl(value);
        setIsCorrect(result);
    }

    return (
        <form className='form_creating' onSubmit={onSubmit}>
            <ConfigProvider theme={{
                components: { Input: theme.input },
                token: theme.tokenPrimary
            }}>
                <Input
                    type='text'
                    required
                    value={name}
                    title='Name'
                    placeholder='Please enter a name'
                    onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                />
                <Input
                    type='text'
                    id='input'
                    value={url}
                    required
                    title='Url'
                    placeholder='Please enter an url'
                    onChange={(e: React.FormEvent<HTMLInputElement>) => validatePath(e.currentTarget.value)}
                />
                <Checkbox onChange={(e) => setIsChartCreating(e.target.checked)}>Create a chart from JSON</Checkbox>
                { isChartCreating && <>
                    <Input
                        type='text'
                        value={username}
                        title='Username'
                        placeholder='Please enter the username (optional)'
                        onChange={(e: React.FormEvent<HTMLInputElement>) => setUsername(e.currentTarget.value)}
                    />
                    <Input
                        type='password'
                        value={password}
                        title='Password'
                        placeholder='Please enter the password (optional)'
                        onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
                    />
                </> }
                <Input
                    type="number"
                    title='Update time (seconds)'
                    value={updTime}
                    min={0}
                    placeholder='Please enter an update time (seconds)'
                    onChange={(e: React.FormEvent<HTMLInputElement>) => setUpdTime(+e.currentTarget.value)}
                />
                <Button style={{ width: '50%' }} type='primary' htmlType="submit" className='submit_btn'>
                    Submit
                </Button>
            </ConfigProvider>
        </form>
    )
}

export default observer(CreatingScreenPage);