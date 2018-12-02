import * as React from 'react';
import connectToObservable from './connectToObservable';
import * as state from '../state';

export const createMessageForm = (
  useState = React.useState,
  toNextState = state.toNextState,
  addMessage = state.addMessage,
  addRonSwansonQuote = state.addRonSwansonQuote,
) =>
  ({ isLoadingQuote, isFormValid, hasQuoteError }: Pick<
    state.State,
    | 'isLoadingQuote'
    | 'isFormValid'
    | 'hasQuoteError'
  >) => {
    const [message, setMessage] = useState('');

    return (
      <section>
        <h2>Add a Message</h2>

        <form onSubmit={e => {
          e.preventDefault();
          toNextState(addMessage(message));
        }}>
          <input
            type="text"
            name="message"
            placeholder="Your comment"
            onChange={e => setMessage(e.currentTarget.value)}
            value="fafa"
          />
          <input type="submit" value="Add" />
          <button
            type="button"
            name="add-quote"
            disabled={isLoadingQuote}
            onClick={() => toNextState(addRonSwansonQuote())}
          >
            Add Ron Swanson quote
          </button>
        </form>

        {!isFormValid && <p className="form-invalid-message">Please enter a message!</p>}
        {hasQuoteError && <p className="quote-failure-message">Unable to retrieve Ron Swanson quote!</p>}
      </section>
    );
  };

export default connectToObservable(state.appState, state.defaultState)(
  createMessageForm(),
);
