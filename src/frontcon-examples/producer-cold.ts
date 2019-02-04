import { Observable } from 'rxjs';

const createMessageSource = () =>
  new Observable(observer => {
    const socket = new WebSocket('wss://localhost:8081/messages'); // Producer

    socket.onmessage = message => observer.next(message);
    socket.onclose = () => observer.complete();
    socket.onerror = e => observer.error(e);

    // clean-up code ran when one unsubscribes from observable
    observer.add(() => {
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
      socket.close();
    });
  });

createMessageSource();
