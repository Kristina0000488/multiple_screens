import React, { useState } from 'react';

import ScreenBlock from './components/ScreenBlock';

import './css/App.css';

function App() {
  const [ isResize, setIsResize ] = useState(false);
  const [ isMove, setIsMove ] = useState(false);
 
  const screens = [
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
    { path: "https://stylus-lang.com/docs/executable.html#stylus-cli", id: 'screen' },
  ]

  return (
    <div className="App" id="app">
      { screens && screens.map( (screen, id) => <ScreenBlock key={ id } id={ screen.id + id } path={ screen.path } /> ) }      
    </div>
  );
}

export default App;
