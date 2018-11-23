import * as React from 'react';
import { appState, defaultState, State } from './state';
import connectToObservable from './connectToObservable';

const Status = ({ messages }: State) => (
  <p>{messages.length} {messages.length === 1 ? 'message' : 'messages'}</p>
);

export default connectToObservable(appState, defaultState)(Status);
