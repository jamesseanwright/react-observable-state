import { Action, createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Observable, of, concat } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { filter, catchError, switchMap } from 'rxjs/operators';

interface State {
  messages: string[];
  isLoading: boolean;
  hasError: boolean;
}

interface MessageAction extends Action {
  messages: string[];
}

type AppAction = 'REQUEST_MESSAGES' | 'FETCH_ERROR' | 'RECEIVE_MESSAGES';

const isActionOfType = <TAction extends Action<AppAction>>(action: Action, type: AppAction): action is TAction =>
  action.type === type;

const reducer = (state: State, action: Action): State => {
  if (isActionOfType(action, 'REQUEST_MESSAGES')) {
    return {
      ...state,
      isLoading: true,
      hasError: false,
    };
  }

  if (isActionOfType(action, 'FETCH_ERROR')) {
    return {
      ...state,
      isLoading: false,
      hasError: true,
    };
  }

  if (isActionOfType<MessageAction>(action, 'RECEIVE_MESSAGES')) {
    return {
      ...state,
      isLoading: false,
      hasError: false,
      messages: [
        ...state.messages,
        ...action.messages,
      ],
    };
  }

  return state;
};

const fetchMessagesEpic = (
  actionSource: Observable<Action>,
) =>
  actionSource.pipe(
    filter(action => action.type === 'FETCH_MESSAGES'),
    switchMap(() => concat(
      of({ type: 'REQUEST_MESSAGES' }),
      ajax('/api/messages').pipe(
        switchMap(({ response }) => response),
        switchMap(messages => of({
          type: 'RECEIVE_MESSAGES',
          messages,
        })),
      ),
    )),
    catchError(() => of({ type: 'FETCH_ERROR' })),
  );

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(epicMiddleware),
);

epicMiddleware.run(fetchMessagesEpic);

store.dispatch({ type: 'FETCH_MESSAGES' });
