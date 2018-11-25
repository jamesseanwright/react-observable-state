// TODO: we're actually replacing the state each time? Better name?!

import { ajax } from 'rxjs/ajax';
import { appState, State } from './state';
import { catchError, take, switchMap } from 'rxjs/operators';
import { of, concat, Observable } from 'rxjs';

export type Mutator<TPayload> = (payload?: TPayload) => Reducer;
export type Reducer = (currentState: State) => Observable<State>;

export const nextState = (reducer: Reducer) => {
  const sequence = appState
    .pipe(
      take(1),
      switchMap(state => reducer(state)),
    );

  sequence.subscribe(newState => appState.next(newState));

  return sequence;
};

export const addMessage = (message: string) =>
  (currentState: State) =>
    of(
      message.length
        ? {
          ...currentState,
          isFormValid: true,
          isLoadingQuote: false,
          hasQuoteError: false,
          messages: [
            message,
            ...currentState.messages,
          ],
        }
        : {
          ...currentState,
          isFormValid: false,
          isLoadingQuote: false,
          hasQuoteError: false,
        },
    );

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
  () =>
    concat(
      nextState(onQuoteLoading()),
      ajax.getJSON<string[]>('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
        .pipe(
          switchMap(([quote]) => nextState(addMessage(quote))),
          catchError(() => nextState(onQuoteError())),
        ),
    );
