import { Observable } from 'rxjs';
import { addMessage } from '../mutations';

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
  });
});
