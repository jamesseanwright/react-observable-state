import { of, Subject } from 'rxjs';
import { State, appState, defaultState, withState, subscribe } from '../state';
import { take } from 'rxjs/operators';
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

  describe('subscribe', () => {
    it('should subscribe to the source observable and forward emissions to the app state', async () => {
      const subject = new Subject<State>();

      subscribe(subject);

      subject.next({
        ...defaultState,
        isLoadingQuote: true,
      });

      const [newState] = await toAwaitable(
        appState.pipe(
          take(1),
        ),
      );

      expect(newState).toEqual({
        ...defaultState,
        isLoadingQuote: true,
      });
    });
  });

  describe('toNextState', () => {

  });
});
