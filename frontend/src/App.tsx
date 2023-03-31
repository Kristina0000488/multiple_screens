import React, { useState } from 'react';

import ScreenBlock from './components/ScreenBlock';

import './css/App.css';

function App() {
  const [ isResize, setIsResize ] = useState(false);
  const [ isMove, setIsMove ] = useState(true);


  var mousePosition;
  var offset = [0,0];
  var div: HTMLElement | null;
  var isDown = false;

  document.addEventListener('mousedown', function(e: MouseEvent) {
    isDown = true;
    div = document.getElementById("screen");

    if (div) {
      offset = [
          div.offsetLeft - e.clientX,
          div.offsetTop - e.clientY
      ] 
    } 
  }, true);

  document.addEventListener('mouseup', function() {
      isDown = false;
  }, true);

  document.addEventListener('mousemove', function(event) {
      event.preventDefault();
      
      const app = document.getElementById("app");
      
      if (isDown && div && isMove && app) {
          mousePosition = {      
              x : event.clientX,
              y : event.clientY      
          };
          const x = (mousePosition.x + offset[0]);
          const y = (mousePosition.y + offset[1]);

          const x_screen = app?.offsetWidth;
          const y_screen = app?.offsetHeight;

          const r = x_screen - div.offsetWidth;
          const b = y_screen - div.offsetHeight;
          
          div.style.left = ( x < 0 || x === 0 ) ? '0' : ( x > r || x === r ) ? r + 'px' : x + 'px';
          div.style.top  = ( y < 0 || y === 0 ) ? '0' : ( y > b || y === b ) ? b + 'px' : y + 'px';

          console.log(y_screen, y);
      }
  }, true);

  return (
    <div className="App" id="app">
      <ScreenBlock isResize={ isResize } path="https://stylus-lang.com/docs/executable.html#stylus-cli" />
    </div>
  );
}

export default App;
