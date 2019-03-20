import * as React from 'react';
import { empty, Subject, Observable } from 'rxjs';
import { shallow } from 'enzyme';
import connectToObservable from '../connectToObservable';
import { SetState, StateHook } from '../../__tests__/testUtils';

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

const defaultState = {
  foo: 'lol',
  bar: 'rofl',
};

const range = (length: number) => Array(length).fill(null);
const MyComponent = () => <div />;

/* React Test Renderer and Enzyme now support basic
 * rendering of React Hooks, but doesn't respect
 * any component updates they may trigger, thus
 * I'm still having to rely upon this workaround.
 * TODO: Remove these stubs and query props for
 * changes when /airbnb/enzyme/pull/2008 is merged */
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

    const rendered = shallow(
      <WrappedComponent />,
    );

    expect(rendered.prop('foo')).toBe('lol');
    expect(rendered.prop('bar')).toBe('rofl');
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

    const rendered = shallow(
      <WrappedComponent baz="one" qux="two" />,
    );

    expect(rendered.prop('foo')).toBe('lol');
    expect(rendered.prop('bar')).toBe('rofl');
    expect(rendered.prop('baz')).toBe('one');
    expect(rendered.prop('qux')).toBe('two');
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

    const rendered = shallow(
      <WrappedComponent baz="one" qux="two" />,
    );

    expect(rendered.prop('a')).toBe(0);
    expect(rendered.prop('b')).toBe(1);

    sequence.forEach(item => {
      subject.next(item);
      // TODO: as "stated" above, query props when Enzyme PR is merged
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
