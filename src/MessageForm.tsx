import * as React from 'react';
import useObservable from 'react-observable-hook';
import { addMessage, appState, defaultState, State } from './state';

const MessageForm = () => {
  const [message, setMessage] = React.useState('');
  const { isFormValid } = useObservable<State>(appState, defaultState);

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

      {!isFormValid && <p>Please enter a message!</p>}
    </section>
  );
};

export default MessageForm;
