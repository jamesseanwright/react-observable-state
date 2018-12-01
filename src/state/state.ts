import { ReplaySubject, Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

export interface State {
  messages: string[];
  isFormValid: boolean;
  isLoadingQuote: boolean;
  hasQuoteError: boolean;
}

export const defaultState: State = {
  messages: [],
  isFormValid: true,
  isLoadingQuote: false,
  hasQuoteError: false,
};

export type Action<TPayload> = (payload?: TPayload) => Reducer;
export type Reducer = (currentState: State) => Observable<State>;

export const withState = (reducer: Reducer) =>
  appState
    .pipe(
      take(1),
      switchMap(state => reducer(state)),
    );

export const subscribe = (observable: Observable<State>) =>
  observable.subscribe(newState => appState.next(newState));

export const toNextState = (reducer: Reducer) => {
  const sequence = withState(reducer);

  subscribe(withState(reducer));

  return sequence;
};

export const appState = new ReplaySubject<State>(1);
appState.next(defaultState);
