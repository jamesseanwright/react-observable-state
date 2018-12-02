import * as React from 'react';
import { shallow } from 'enzyme';
import { Observable } from 'rxjs';
import { createMessageForm } from '../MessageForm';
import { State } from '../../state';
import { StateHook, SetState } from '../../__tests__/testUtils';

const MESSAGE_INPUT_SELECTOR = 'input[name="message"]';
const ADD_QUOTE_BUTTON_SELECTOR = 'button[name="add-quote"]';
const FORM_INVALID_MESSAGE_SELECTOR = '.form-invalid-message';
const QUOTE_ERROR_MESSAGE_SELECTOR = '.quote-failure-message';

describe('MessageForm', () => {
  let defaultSetState: jest.Mock<SetState<string>>;
  let defaultUseState: jest.Mock<StateHook<string>>;
  let toNextState: jest.Mock;
  let addMessage: jest.Mock<string>;
  let addRonSwansonQuote: jest.Mock<string>;

  beforeEach(() => {
    defaultSetState = jest.fn(state => state);
    defaultUseState = jest.fn<StateHook<string>>(initialState => [initialState, defaultSetState]);
    toNextState = jest.fn();
    addMessage = jest.fn();
    addRonSwansonQuote = jest.fn();
  });

  it('should render its initial state when no quote is loading, there`s no quote error, and the form is valid', () => {
    const MessageForm = createMessageForm(
      defaultUseState,
      toNextState,
      addMessage,
      addRonSwansonQuote,
    );

    const rendered = shallow(
      <MessageForm
        isFormValid={true}
        isLoadingQuote={false}
        hasQuoteError={false}
      />,
    );

    const quoteButton = rendered.find(ADD_QUOTE_BUTTON_SELECTOR);
    const formInvalidMessage = rendered.find(FORM_INVALID_MESSAGE_SELECTOR);
    const quoteFailedMessage = rendered.find(QUOTE_ERROR_MESSAGE_SELECTOR);

    expect(quoteButton.prop('disabled')).toBe(false);
    expect(formInvalidMessage.exists()).toBe(false);
    expect(quoteFailedMessage.exists()).toBe(false);
  });
});
