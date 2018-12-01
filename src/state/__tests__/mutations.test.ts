jest.mock('rxjs/ajax');

import { of, throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { addMessage, onQuoteError, onQuoteLoading, addRonSwansonQuote } from '../mutations';
import { toAwaitable } from '../../__tests__/testUtils';

describe('state mutations', () => {
  describe('addMessage', () => {
    it('should add a message to the existing state when it has a length', async () => {
      const state = {
        isFormValid: false,
        isLoadingQuote: true,
        hasQuoteError: true,
        messages: [
          'bar',
          'foo',
        ],
      };

      const [nextState] = await toAwaitable(
        addMessage('baz')(state),
      );

      expect(nextState).toEqual({
        ...state,
        isFormValid: true,
        isLoadingQuote: false,
        hasQuoteError: false,
        messages: [
          'baz',
          ...state.messages,
        ],
      });
    });

    it('shouldn`t add a message to the existing state and flag the form as invalid when it has no length', async () => {
      const state = {
        isFormValid: true,
        isLoadingQuote: false,
        hasQuoteError: false,
        messages: [
          'bar',
          'foo',
        ],
      };

      const [nextState] = await toAwaitable(
        addMessage('')(state),
      );

      expect(nextState).toEqual({
        ...state,
        isFormValid: false,
        messages: state.messages,
      });
    });
  });

  describe('onQuoteLoading', () => {
    it('should set the quote loading state to true and error state to false', async () => {
      const state = {
        isFormValid: true,
        isLoadingQuote: false,
        hasQuoteError: true,
        messages: [
          'bar',
          'foo',
        ],
      };

      const [nextState] = await toAwaitable(
        onQuoteLoading()(state),
      );

      expect(nextState).toEqual({
        ...state,
        isLoadingQuote: true,
        hasQuoteError: false,
      });
    });
  });

  describe('onQuoteError', () => {
    it('should set the quote loading state to false and error state to true', async () => {
      const state = {
        isFormValid: true,
        isLoadingQuote: true,
        hasQuoteError: false,
        messages: [
          'bar',
          'foo',
        ],
      };

      const [nextState] = await toAwaitable(
        onQuoteError()(state),
      );

      expect(nextState).toEqual({
        ...state,
        isLoadingQuote: false,
        hasQuoteError: true,
      });
    });
  });

  describe('addRonSwansonQuote', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should dispatch the loading state, request a quote, and add it if successful', async () => {
      (ajax.getJSON as jest.Mock).mockImplementation(() => of(['some quote']));

      const [loadingState, messageState] = await toAwaitable(addRonSwansonQuote());

      expect(loadingState.isLoadingQuote).toBe(true);
      expect(messageState.hasQuoteError).toBe(false);
      expect(messageState.messages).toEqual(['some quote']);
    });

    it('should dispatch the error state when the quote call fails', async () => {
      (ajax.getJSON as jest.Mock).mockImplementation(() => throwError(new Error('Nope')));

      const [loadingState, errorState] = await toAwaitable(addRonSwansonQuote());

      expect(loadingState.isLoadingQuote).toBe(true);
      expect(errorState.isLoadingQuote).toBe(false);
      expect(errorState.hasQuoteError).toBe(true);
      expect(errorState.messages).toEqual([]);
    });
  });
});
