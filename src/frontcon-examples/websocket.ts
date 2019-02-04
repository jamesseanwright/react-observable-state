import { webSocket } from 'rxjs/webSocket';
import { map, scan } from 'rxjs/operators';

interface StreamedMessage {
  username: string;
  message: string;
}

const renderMessages = (messages: string[]) => undefined;

webSocket<StreamedMessage>('wss://localhost:8080/api/streaming')
  .pipe(
    map(({ message }) => message),
    scan<string>((messages, incomingMessage) => [
      ...messages,
      incomingMessage,
    ], []),
  )
  .subscribe(renderMessages);
