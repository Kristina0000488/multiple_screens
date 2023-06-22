import React, { useState, useEffect, useMemo, useContext } from 'react';
import { observer } from "mobx-react-lite";
import { makeObservable, observable, action, toJS, runInAction } from "mobx";
import { storeContext } from '../store';

import { arrIdScreensType } from '../types';

import FormScreens from '../components/FormScreens';
import FormCollections from '../components/FormCollections';


type Props = {
  onClose: () => void;
  submitScreens: (url: string, name: string, updTime: number, idCollection: string) => void;
  submitCollections: (name: string, collection: arrIdScreensType) => void;
}

function random_choice<T>(list:T[] ) {
  return list[Math.floor(Math.random() * list.length)];
}

function FormPage(props: Props) {
    const [ isScreenForm, setIsScreenForm ] = useState<boolean>(false);
    const [ isCollectForm, setIsCollectForm ] = useState<boolean>(false);

    const { onClose, submitScreens, submitCollections } = props;

    const store   = useContext( storeContext );
    const screens = toJS(store.screens);
    const collections = toJS(store.collections);
    
    const confirmAct = (callback: Function): void => {
        if (window.confirm('Are you sure you want to cancel a form and delete data?')) 
        {
            callback();
            setIsScreenForm(false);
            setIsCollectForm(false);
        }
    }

    const renderForm = (): React.ReactElement => {
        if (isScreenForm) {
            return <FormScreens collections={ collections } toSubmit={ submitScreens } />
        } else if (isCollectForm) {
            return <FormCollections screens={ screens } toSubmit={ submitCollections } />
        } 
       
        return <></>;        
    }

    return (
        <>
            <button onClick={ () => confirmAct(onClose) }>
                close
            </button>
            { !isCollectForm && !isScreenForm && <>
                <button onClick={ () => setIsScreenForm(true) }>
                    add new screen
                </button>
                <button onClick={ () => setIsCollectForm(true) }>
                    add new collection
                </button>
            </> }
            { renderForm() }
        </>
    );
}

export default observer(FormPage);
