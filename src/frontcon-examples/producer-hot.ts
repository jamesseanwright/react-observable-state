import { Observable } from 'rxjs';

const socket = new WebSocket('wss://localhost:8081/messages');

const createMessageSource = () =>
  new Observable(observer => {
    const onMessage = (message: MessageEvent) => observer.next(message);
    const onClose = () => observer.complete();
    const onError = (e: Event) => observer.error(e);

    socket.addEventListener('message', onMessage);
    socket.addEventListener('close', onClose);
    socket.addEventListener('message', onError);

    observer.add(() => {
      socket.removeEventListener('message', onMessage);
      socket.removeEventListener('close', onClose);
      socket.removeEventListener('error', onError);
    });
  });

createMessageSource();
