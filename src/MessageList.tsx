import * as React from 'react';
import useObservable from 'react-observable-hook';
import { appState, defaultState, State } from './state';

const MessageList = () => {
    const { messages } = useObservable<State>(appState, defaultState);

    return (
      <ul>
        {messages.map((message, i) => <li key={i}>{message}</li>)}
      </ul>
    );
  };

export default MessageList;
