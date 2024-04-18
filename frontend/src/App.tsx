import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import {
  RouterProvider,
} from "react-router-dom";

import {router} from './router';
import { store } from './store';

import ErrorList from './components/ErrorList';

import './style/App.css';


function App() {
  useEffect( () => store.getAll(), [] );
  
  return (
    <>
      <RouterProvider router={ router } />
      <ErrorList />
    </>
  );
}

export default observer(App);
