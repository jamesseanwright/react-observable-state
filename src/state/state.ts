import { Observable, BehaviorSubject } from 'rxjs';
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

export const appState = new BehaviorSubject<State>(defaultState);

export const withState = (reducer: Reducer) =>
  appState
    .pipe(
      take(1),
      switchMap(state => reducer(state)),
    );

export const toNextState = (reducer: Reducer) => {
  const sequence = withState(reducer);
  sequence.subscribe(newState => appState.next(newState));
  return sequence;
};
