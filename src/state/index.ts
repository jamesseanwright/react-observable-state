import { BehaviorSubject } from 'rxjs';
import { getMaxListeners } from 'cluster';

export interface State {
  messages: string[];
  isFormValid: boolean;
}

export const defaultState: State = {
  messages: [],
  isFormValid: true,
};

export const appState = new BehaviorSubject(defaultState);

export const addMessage = (message: string) => {
  const currentState = appState.value;

  if (message.length) {
    appState.next({
      ...currentState,
      isFormValid: true,
      messages: [
        message,
        ...currentState.messages,
      ],
    });

    return;
  }

  appState.next({
    ...currentState,
    isFormValid: false,
  });
};
