import * as React from 'react';
import { appState, defaultState, State } from '../state';
import connectToObservable from './connectToObservable';

export const Status = ({ messages }: Pick<State, 'messages'>) => (
  <p>{messages.length} {messages.length === 1 ? 'message' : 'messages'}</p>
);

export default connectToObservable(appState, defaultState)(Status);
