import { ajax } from 'rxjs/ajax';
import { appState, State } from './state';
import { tap, catchError, first, map } from 'rxjs/operators';
import { empty } from 'rxjs';

export type Mutator<TPayload> = (currentState: State, payload?: TPayload) => State;

// TODO: better name!
const asMutator = <TPayload>(action: Mutator<TPayload>) =>
  (payload?: TPayload) =>
    appState
      .pipe(
        first(),
        map(state => action(state, payload)),
      ).subscribe(appState);

export const addMessage = asMutator<string>((currentState, message) => {
  if (message.length) {
    return {
      ...currentState,
      isFormValid: true,
      isLoadingQuote: false,
      hasQuoteError: false,
      messages: [
        message,
        ...currentState.messages,
      ],
    };
  }

  return {
    ...currentState,
    isFormValid: false,
    isLoadingQuote: false,
    hasQuoteError: false,
  };
});

export const onQuoteError = asMutator<void>(currentState => ({
  ...currentState,
  isLoadingQuote: false,
  hasQuoteError: true,
}));

// TODO: extract into actions (same with others)?
export const addRonSwansonQuote = () =>
  ajax('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
    .pipe(
      tap(({ response }) => addMessage(response[0])), // TODO: type!
      catchError(() => {
        onQuoteError();
        return empty(); // TODO: catch elsewhere?
      }),
    );
