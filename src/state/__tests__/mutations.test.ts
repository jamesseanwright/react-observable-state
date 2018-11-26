import { Observable } from 'rxjs';
import { addMessage, onQuoteError, onQuoteLoading } from '../mutations';

const toAwaitable = <T>(observable: Observable<T>) => {
  let emissions: T[] = [];

  return new Promise<T[]>((resolve, reject) =>
    observable.subscribe({
      next(value) {
        emissions = [
          ...emissions,
          value,
        ];
      },
      complete() {
        resolve(emissions);
      },
      error: reject,
    }),
  );
};

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
});
