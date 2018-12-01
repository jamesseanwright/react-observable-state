import * as React from 'react';
import { appState, defaultState, State } from '../state';
import connectToObservable from './connectToObservable';

export const MessageList = ({ messages }: Pick<State, 'messages'>) => (
  <ul>
    {messages.map((message, i) => <li key={i}>{message}</li>)}
  </ul>
);

export default connectToObservable(appState, defaultState)(MessageList);
