import * as React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import Status from './Status';

export default () => (
  <>
    <Status />
    <MessageForm />
    <MessageList />
  </>
);
