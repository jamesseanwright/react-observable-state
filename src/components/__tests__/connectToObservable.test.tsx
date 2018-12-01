import * as React from 'react';
import { empty, Subject, Observable } from 'rxjs';
import { shallow } from 'enzyme';
import connectToObservable from '../connectToObservable';

interface State {
  foo: string;
  bar: string;
}

interface CountState {
  a: number;
  b: number;
}

interface OwnProps {
  baz: string;
  qux: string;
}

type SetState<TState = State> = (s: TState) => TState;
type StateHook<TState = State> = [TState, SetState<TState>];

const defaultState = {
  foo: 'lol',
  bar: 'rofl',
};

const range = (length: number) => Array(length).fill(null);
const MyComponent = () => <div />;

/* Currently, react-test-renderer does not support hooks,
 * thus controllable mocks of useState and useEffect will
 * be injected into the implementation to determine changes
 * TODO: rewrite tests to assert props when above is fixed */
describe('connectToObservable', () => {
  it('should render the wrapped component with defaultState as props', () => {
    const setState = jest.fn<SetState>(() => undefined);
    const useState = jest.fn<StateHook>(state => [state, setState]);
    const useEffect = jest.fn<void>(callback => callback());

    const WrappedComponent = connectToObservable<State>(
      empty(),
      defaultState,
      useState,
      useEffect,
    )(MyComponent);

    const renderedElement = shallow(
      <WrappedComponent />,
    );

    expect(renderedElement.prop('foo')).toBe('lol');
    expect(renderedElement.prop('bar')).toBe('rofl');
  });

  it('should proxy its own props to the wrapped component', () => {
    const setState = jest.fn<SetState>(() => undefined);
    const useState = jest.fn<StateHook>(state => [state, setState]);
    const useEffect = jest.fn<void>(callback => callback());

    const WrappedComponent = connectToObservable<State, OwnProps>(
      empty(),
      defaultState,
      useState,
      useEffect,
    )(MyComponent);

    const renderedElement = shallow(
      <WrappedComponent baz="one" qux="two" />,
    );

    expect(renderedElement.prop('foo')).toBe('lol');
    expect(renderedElement.prop('bar')).toBe('rofl');
    expect(renderedElement.prop('baz')).toBe('one');
    expect(renderedElement.prop('qux')).toBe('two');
  });

  it('should update the wrapped component when the observable emits', () => {
    const setState = jest.fn<SetState<CountState>>(() => undefined);
    const useState = jest.fn<StateHook<CountState>>(state => [state, setState]);
    const useEffect = jest.fn<void>(callback => callback());
    const defaultCountState = { a: 0, b: 1 };

    const sequence = range(5).map((_, i) => ({
        a: i + 1,
        b: (i + 1) * 2,
      }),
    );

    const subject = new Subject<CountState>();

    const WrappedComponent = connectToObservable<CountState, OwnProps>(
      subject,
      defaultCountState,
      useState,
      useEffect,
    )(MyComponent);

    const renderedElement = shallow(
      <WrappedComponent baz="one" qux="two" />,
    );

    expect(renderedElement.prop('a')).toBe(0);
    expect(renderedElement.prop('b')).toBe(1);

    sequence.forEach(item => {
      subject.next(item);
      // TODO: as "stated" above, query props when new RTR is out
      expect(setState).toHaveBeenCalledWith(item);
    });
  });

  /* Just a brief sanity check that we're passing an
   * empty inputs array to useEffect, meaning the hook
   * only runs once when the component is mounted. */
  it('should only run the subscription effect once when mounting', () => {
    const useState = jest.fn<StateHook>(state => [state, () => undefined]);
    const useEffect = jest.fn<void>();

    const WrappedComponent = connectToObservable<{}>(
      empty(),
      {},
      useState,
      useEffect,
    )(MyComponent);

    shallow(
      <WrappedComponent />,
    );

    expect(useEffect).toHaveBeenCalledTimes(1);
    expect(useEffect).toHaveBeenCalledWith(expect.any(Function), []);
  });

  it('should unsubscribe from the observable when the component unmounts', () => {
    let onUnmount: () => void;
    const unsubscribe = jest.fn<void>();
    const setState = jest.fn<SetState>(() => undefined);
    const useState = jest.fn<StateHook>(state => [state, setState]);

    const useEffect = jest.fn<void>(callback => {
      onUnmount = callback();
    });

    const observable = {
      subscribe: () => ({
        unsubscribe,
      }),
    } as any as Observable<State>;

    const WrappedComponent = connectToObservable<State, OwnProps>(
      observable,
      defaultState,
      useState,
      useEffect,
    )(MyComponent);

    shallow(
      <WrappedComponent baz="one" qux="two" />,
    );

    onUnmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
