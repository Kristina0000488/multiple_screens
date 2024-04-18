import React, { useEffect, useContext, useState, useReducer, useMemo } from 'react';
import { observer } from "mobx-react-lite";

import { Button, Input, ConfigProvider } from 'antd';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

import { storeContext } from '../../store';
import * as types from '../../types';
import { changeCollectionReducer, ChangeCollectionActionKind } from "../../reducers/changeCollectionPage";
import { theme } from '../configProvider';


const { TextArea } = Input;

type Props = {
    closeDrawer?: () => void, 
    collectionId: string
}

function ChangeCollectionPage(props: Props): JSX.Element {
    const [ collection, dispatch ] = useReducer(changeCollectionReducer, {} as types.Collection);
    //const [ paste, setPaste ] = useState<boolean>(false);
    const [ isChanged, setIsChanged] = useState<boolean>(false);


    const store = useContext( storeContext );
    const { screens/*, copiedScreens/*, copiedScreenIds*/ } = store;
    
   // const isCopied = copiedScreenIds[ collection.id ] || {};

    useEffect( () => { 
        const collection = store.getCollectionById( props.collectionId );

        if (collection) { 
            dispatch({ 
                type: ChangeCollectionActionKind.ADDEDCOLLECTION, 
                payload: JSON.parse(JSON.stringify(collection)) 
            });
        }   
    }, [ ] )


    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (isChanged) await store.changeCollection( collection );
        //if ( paste ) await store.copyScreensToCollection( collection.id );
        
        props.closeDrawer && props.closeDrawer();    
    }

    /*const onCopy = (screen: types.ScreenBlock<types.LocationScreenBlock | types.Location>) => {        
        if ( !isCopied[ screen.id ] ) {
            store.setCopiedScreens(
                collection.id, 
                screen.path, 
                screen.name, 
                screen.updTime, 
                screen.initPositions as types.LocationScreenBlock,
            );
            store.setCopiedScreenIds( collection.id, screen.id );
        }        
    }*/

    const _screens = useMemo( () => {   
        const arr: types.ScreenBlock<types.Location | types.LocationScreenBlock>[]= [];       

        if ( collection.screenIds && screens )  {
            collection.screenIds.forEach( id => {
                const foundScreen = [ ...screens ].find( screen => screen.id === id );

                if (foundScreen) {
                    arr.push(foundScreen);
                }
            } )
        } 

       /* if ( copiedScreens && Object.values(copiedScreens)[0]?.length > 0 && paste) {
            arr.push( ...Object.values(copiedScreens)[0].map( (screen, idx) => (
                { ...screen, id: idx.toString() }
            ) ));
        }*/

        return arr;    
        
    }, [ screens.length, collection.screenIds/*, paste*/ ] );
    
    //const isLengthCopiedScreens = Object.keys(copiedScreens).length > 0;

    return (
        <>{ collection && <form onSubmit={ onSubmit } className='form_creating' >
            <ConfigProvider theme={{
                components: {
                    Input: theme.input,
                    //Button: theme.button
                },
                token: theme.tokenPrimary                
            }}>
                <div className='label_form_creating'>Name:</div> 
                <Input 
                    type='text' 
                    id='input'
                    value={ collection.name } 
                    onChange={ (e: React.FormEvent<HTMLInputElement>) => {
                        dispatch({ 
                            type: ChangeCollectionActionKind.ADDEDNAME, 
                            payload: e.currentTarget.value
                        });
                        setIsChanged(true);
                    } } 
                />            
                <div className='label_form_creating'>Description:</div>
                <TextArea 
                    value={ collection.description } 
                    rows={ 4 }
                    onChange={ (e: React.FormEvent<HTMLTextAreaElement>) => {
                        dispatch({ 
                            type: ChangeCollectionActionKind.ADDEDDESCRIPTION, 
                            payload: e.currentTarget.value
                        });
                        setIsChanged(true);
                    } } 
                />            
                {/* <div className='screens_ChangeCollection'>
                    <div className='header_ChangeCollection'>
                        <h4 className='label_form_creating'>Screens: </h4>
                        { 
                            isLengthCopiedScreens && 
                            !copiedScreens[ collection.id ] && 
                            !paste && <Button type="text" onClick={ () => setPaste(true) }>
                                Paste
                            </Button> 
                        }
                    </div> 
                    { _screens.length > 0 && _screens.map((screen, id) => {
                        return <div key={ id } className='row_ChangeCollection'>
                            <div>Name: { screen.name }</div>
                            { 
                                ((isLengthCopiedScreens && copiedScreens[ collection.id ]) || 
                                Object.keys(copiedScreens).length === 0) && 
                                <Button 
                                    className='copyBtn_ChangeCollection' 
                                    type="text" 
                                    onClick={ () => !isCopied[screen.id] && onCopy(screen) }
                                >{ 
                                    !!isCopied[screen.id] ? 
                                    <><CheckOutlined />Copied</> : 
                                    <CopyOutlined />
                                }</Button> 
                            }
                        </div>
                    }) }
                </div> */}
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

export default observer(ChangeCollectionPage);
