import { Subject } from 'rxjs';
import { map, scan } from 'rxjs/operators';

interface StreamedMessage {
  username: string;
  message: string;
}

const renderMessages = (messages: string[]) => undefined;

const messageSource = new Subject<StreamedMessage>();

messageSource.pipe(
  map(({ message }) => message),
  scan<string>((messages, incomingMessage) => [
    ...messages,
    incomingMessage,
  ], []),
).subscribe(renderMessages);

messageSource.next({ username: 'Bob', message: 'Hi!' });
messageSource.next({ username: 'Peter', message: 'Hey!' });
