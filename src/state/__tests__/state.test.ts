import { of, concat } from 'rxjs';
import { State, appState, defaultState, withState, toNextState } from '../state';
import { toAwaitable } from '../../__tests__/testUtils';

/* I considered writing these as true unit tests
 * (i.e. making the state observable injectable),
 * but opted to test the integration between the
 * single source of truth and the update functions;
 * this, in my opinion, provides more value. */

describe('state', () => {
  afterEach(() => {
    appState.next(defaultState);
  });

  describe('withState', () => {
    it('should take the last state from the subject, run it through the reducer, and push the result', async () => {
      const reducer = (state: State) =>
        of({
          ...state,
          hasQuoteError: true,
        });

      const [newState] = await toAwaitable<State>(
        withState(reducer),
      );

      expect(newState).toEqual({
        ...defaultState,
        hasQuoteError: true,
      });
    });
  });

  describe('toNextState', () => {
    it('should subscribe to the stream returned by the reducer and push it to the app state', async () => {
      const reducer = (state: State) =>
        concat(
          of({
            ...state,
            isLoadingQuote: true,
          }),
          of({
            ...state,
            isLoadingQuote: false,
          }),
        );

      const [loadingState, doneState] = await toAwaitable(
        toNextState(reducer),
      );

      expect(loadingState).toEqual({
        ...defaultState,
        isLoadingQuote: true,
      });

      expect(doneState).toEqual({
        ...defaultState,
        isLoadingQuote: false,
      });
    });
  });
});
