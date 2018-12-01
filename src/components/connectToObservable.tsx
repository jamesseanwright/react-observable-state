import * as React from 'react';
import { Observable } from 'rxjs';

const connectToObservable = <TState, TProps = {}>(
  observable: Observable<TState>,
  defaultState: TState,
  useState = React.useState,
  useEffect = React.useEffect,
) =>
  (Component: React.ComponentType<TProps & TState>) =>
    (props: TProps) => {
      const [state, setState] = useState(defaultState);

      useEffect(() => {
        const subscription = observable.subscribe(setState);
        return () => {
          subscription.unsubscribe();
        };
      }, []);

      return <Component {...props} {...state} />;
    };

export default connectToObservable;
