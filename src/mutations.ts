// TODO: we're actually replacing the state each time? Better name?!

import { ajax } from 'rxjs/ajax';
import { appState, State } from './state';
import { catchError, take, switchMap } from 'rxjs/operators';
import { of, concat, Observable } from 'rxjs';

export type Mutator<TPayload> = (payload?: TPayload) => Reducer;
export type Reducer = (currentState: State) => Observable<State>;

const withState = (reducer: Reducer) =>
  appState
    .pipe(
      take(1),
      switchMap(state => reducer(state)),
    );

export const subscribe = (observable: Observable<State>) =>
  observable.subscribe(newState => appState.next(newState));

export const toNextState = (reducer: Reducer) => {
  const sequence = withState(reducer);

  sequence.subscribe(newState => appState.next(newState));

  return sequence;
};

export const addMessage = (message: string) =>
  (currentState: State) =>
    of({
      ...currentState,
      isFormValid: !!message.length,
      isLoadingQuote: false,
      hasQuoteError: false,
      messages: [
        ...(message.length ? [message] : []),
        ...currentState.messages,
      ],
    });

export const onQuoteLoading = () =>
  (currentState: State) =>
    of({
      ...currentState,
      isLoadingQuote: true,
      hasQuoteError: false,
    });

export const onQuoteError = () =>
  (currentState: State) =>
    of({
      ...currentState,
      isLoadingQuote: false,
      hasQuoteError: true,
    });

export const addRonSwansonQuote = () =>
  concat(
    withState(onQuoteLoading()),
    ajax.getJSON<string[]>('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
      .pipe(
        switchMap(([quote]) => withState(addMessage(quote))),
        catchError(() => withState(onQuoteError())),
      ),
  );
