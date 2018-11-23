import * as React from 'react';
import useObservable from 'react-observable-hook';
import { appState, defaultState, State } from './state';

const Status = () => {
    const { messages } = useObservable<State>(appState, defaultState);

    return <p>{messages.length} {messages.length === 1 ? 'message' : 'messages'}</p>;
  };

export default Status;
