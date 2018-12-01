import { ajax } from 'rxjs/ajax';
import { State, withState } from './state';
import { catchError, switchMap } from 'rxjs/operators';
import { of, concat } from 'rxjs';

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
  () =>
    concat(
      withState(onQuoteLoading()),
      ajax.getJSON<string[]>('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
        .pipe(
          switchMap(([quote]) => withState(addMessage(quote))),
          catchError(() => withState(onQuoteError())),
        ),
    );
