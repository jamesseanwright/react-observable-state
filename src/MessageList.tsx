import * as React from 'react';
import { appState, defaultState, State } from './state';
import connectToObservable from './connectToObservable';

const MessageList = ({ messages }: State) => (
  <ul>
    {messages.map((message, i) => <li key={i}>{message}</li>)}
  </ul>
);

export default connectToObservable(appState, defaultState)(MessageList);
