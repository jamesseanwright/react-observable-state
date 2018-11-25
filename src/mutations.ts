// TODO: we're actually replacing the state each time? Better name?!

import { ajax } from 'rxjs/ajax';
import { appState, State } from './state';
import { catchError, take, switchMap, first } from 'rxjs/operators';
import { of, concat, Observable, forkJoin } from 'rxjs';

const latestState = appState.pipe(take(1));

export type Mutator<TPayload> = (payload?: TPayload) => Reducer;
export type Reducer = (currentState: State) => Observable<State>;

export const nextState = (reducer: Reducer) =>
  latestState
    .pipe(
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
  (currentState: State) =>
    concat(
      onQuoteLoading()(currentState),
      latestState.pipe(
        switchMap(loadingState => forkJoin(
          of(loadingState),
          ajax.getJSON<string[]>('https://ron-swanson-quotes.herokuapp.com/v2/quotes'),
        )),
        switchMap(([loadingState, [quote]]) => addMessage(quote)(loadingState)),
        catchError(() => onQuoteError()(currentState)),
      ),
    );
