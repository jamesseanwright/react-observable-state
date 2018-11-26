import * as React from 'react';
import { addMessage, addRonSwansonQuote, nextState } from './mutations';
import { State, appState, defaultState } from './state';
import connectToObservable from './connectToObservable';

const MessageForm = ({ isLoadingQuote, isFormValid, hasQuoteError }: State) => {
  const [message, setMessage] = React.useState('');

  return (
    <section>
      <h2>Add a Message</h2>

      <form onSubmit={e => {
        e.preventDefault();
        nextState(addMessage(message));
      }}>
        <input
          type="text"
          name="message"
          placeholder="Your comment"
          onChange={e => setMessage(e.currentTarget.value)}
        />
        <input type="submit" value="Add" />
        <button
          type="button"
          disabled={isLoadingQuote}
          onClick={() => addRonSwansonQuote()}
        >
          Add Ron Swanson quote
        </button>
      </form>

      {!isFormValid && <p>Please enter a message!</p>}
      {hasQuoteError && <p>Unable to retrieve Ron Swanson quote!</p>}
    </section>
  );
};

export default connectToObservable(appState, defaultState)(MessageForm);
