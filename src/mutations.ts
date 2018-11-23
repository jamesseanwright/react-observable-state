// TODO: we're actually replacing the state each time? Better name?!

import { ajax } from 'rxjs/ajax';
import { appState, State } from './state';
import { catchError, take, switchMap } from 'rxjs/operators';
import { of, concat, Observable } from 'rxjs';

interface QuotesResponse {
  response: string[];
}

export type Mutator<TPayload> = (payload?: TPayload) => Reducer;
export type Reducer = (currentState: State) => Observable<State>;

export const nextState = (reducer: Reducer) =>
  appState
    .pipe(
      take(1),
      switchMap(state => reducer(state)),
    ).subscribe(newState => appState.next(newState)); // TODO: why does this work, but appState as observer doesn't?

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
  currentState =>
    of({
      ...currentState,
      isLoadingQuote: true,
      hasQuoteError: false,
    });

export const onQuoteError = () =>
  currentState =>
    of({
      ...currentState,
      isLoadingQuote: false,
      hasQuoteError: true,
    });

export const addRonSwansonQuote = () =>
  (state: State) =>
    concat(
      onQuoteLoading()(state),
      ajax('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
        .pipe(
          switchMap(({ response }: QuotesResponse) => addMessage(response[0])(state)), // TODO: past latest state!
          catchError(() => onQuoteError()(state)),
        ),
    );
