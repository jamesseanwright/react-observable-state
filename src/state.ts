import { ReplaySubject } from 'rxjs';

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

export const appState = new ReplaySubject<State>(1);
appState.next(defaultState); // TODO: do we need default state elsewhere then?!
