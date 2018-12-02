import { Observable } from 'rxjs';
import { State } from '../state';

export type SetState<TState = State> = (s: TState) => TState;
export type StateHook<TState = State> = [TState, SetState<TState>];

export const toAwaitable = <T>(observable: Observable<T>) => {
  let emissions: T[] = [];

  return new Promise<T[]>((resolve, reject) =>
    observable.subscribe({
      next(value) {
        emissions = [
          ...emissions,
          value,
        ];
      },
      complete() {
        resolve(emissions);
      },
      error: reject,
    }),
  );
};
