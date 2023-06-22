import React, { useState, useEffect, useMemo, useContext } from 'react';
import { observer } from "mobx-react-lite";
import { makeObservable, observable, action, toJS, runInAction } from "mobx";
import ScreenBlock from './components/ScreenBlock';
import Index from './pages/index';

import './css/App.css';

type elem = {
  id: string;
  differenceY: number;
}

function random_choice<T>(list:T[] ) {
  return list[Math.floor(Math.random() * list.length)];
}

function App() {
  return (
    <Index />
  );
}

export default observer(App);
