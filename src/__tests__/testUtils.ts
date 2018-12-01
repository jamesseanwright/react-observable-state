import { Observable } from 'rxjs';

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
