import { BehaviorSubject } from 'rxjs';

export interface State {
  messages: string[];
}

export const defaultState: State = {
  messages: [],
};

export const appState = new BehaviorSubject(defaultState);

export const addMessage = (message: string) => {
  const currentState = appState.value;

  appState.next({
    ...currentState,
    messages: [
      ...currentState.messages,
      message,
    ],
  });
};
