import * as React from 'react';
import { addMessage } from './state';

const MessageForm = () => {
  const [message, setMessage] = React.useState('');

  return (
    <section>
      <h2>Add a Message</h2>

      <form onSubmit={e => {
        e.preventDefault();
        addMessage(message);
      }}>
        <input
          type="text"
          name="message"
          placeholder="Your comment"
          onChange={e => setMessage(e.currentTarget.value)}
        />
        <input type="submit" />
      </form>
    </section>
  );
};

export default MessageForm;
