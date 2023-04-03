

export function moveScreen(idScreen: string, idParentElem: string, isMove: boolean) 
{ console.log( isMove )
    let mousePosition;
    let offset = [0,0];
    let div: HTMLElement | null;
    let isDown = false;

    div = document.getElementById(idScreen);
  
    div?.addEventListener('mousedown', function(e: MouseEvent) {
      isDown = true;

      if (div) {
        offset = [
            div.offsetLeft - e.clientX,
            div.offsetTop - e.clientY
        ] 
      } 
    }, true);
  
    div?.addEventListener('mouseup', function() {
        isDown = false;

        console.log( { left: div?.style.left,
        top: div?.style.top } )
    }, true);
  
    document.addEventListener('mousemove', function(event) {
        event.preventDefault();
        
        const parentElem = document.getElementById(idParentElem);
        
        if (isDown && div && parentElem && isMove) {
            mousePosition = {      
                x : event.clientX,
                y : event.clientY      
            };
            const x = (mousePosition.x + offset[0]);
            const y = (mousePosition.y + offset[1]);
  
            const x_screen = parentElem?.offsetWidth;
            const y_screen = parentElem?.offsetHeight;
  
            const right  = x_screen - div.offsetWidth;
            const bottom = y_screen - div.offsetHeight;
            
            div.style.left = ( x < 0 || x === 0 ) ? '0' : ( x > right || x === right ) ? right + 'px' : x + 'px';
            div.style.top  = ( y < 0 || y === 0 ) ? '0' : ( y > bottom || y === bottom ) ? bottom + 'px' : y + 'px';
        }
    }, true);
}

export function removeAllListeners(idScreen: string,)
{
    //const elem = document.getElementById(idScreen);

    //elem?.replaceWith(elem.cloneNode(true));
}