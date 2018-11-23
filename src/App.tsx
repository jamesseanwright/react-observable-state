import * as React from 'react';
import { Observable } from 'rxjs';
import useObservable from 'react-observable-hook';
import appState from './state';

const createApp = (state: Observable<string>) =>
  () => {
    const message = useObservable<string>(state);

    return <p>{message}</p>;
  };

export default createApp(appState);
