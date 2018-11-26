import * as React from 'react';
import { Observable } from 'rxjs';

const connectToObservable = <TState, TProps = {}>(observable: Observable<TState>, defaultState: TState) =>
  (Component: React.ComponentType<TProps & TState>) =>
    (props: TProps) => {
      const [state, setState] = React.useState(defaultState);

      React.useEffect(() => {
        const subscription = observable.subscribe(setState);
        return () => {
          subscription.unsubscribe();
        };
      }, []);

      return <Component {...props} {...state} />;
    };

export default connectToObservable;
