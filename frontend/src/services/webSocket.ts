
export default function ws <T>(func: (data: T) => void) {
    let socket = new WebSocket(`ws://127.0.0.1:8000/chart`);

    socket.addEventListener("open", event => {
        console.log('open ws')
        //socket.send(JSON.stringify({test: 'test'}))
    });
    
    socket.addEventListener("message", event => {
        //console.log("Message from server: ", event.data)
        func(JSON.parse(event.data));
    });
}
