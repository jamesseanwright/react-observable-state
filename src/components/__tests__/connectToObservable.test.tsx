import * as React from 'react';
import { empty } from 'rxjs';
import { createQueryableComponent, render, queryProps } from './testRenderer';
import connectToObservable from '../connectToObservable';

interface State {
  foo: string;
  bar: string;
}

interface OwnProps {
  baz: string;
  qux: string;
}

const defaultState = {
  foo: 'lol',
  bar: 'rofl',
};

// TODO: test observable emission when react-test-renderer supports hooks

describe('connectToObservable', () => {
  it('should render the wrapped component with defaultState as props', () => {
    const MyComponent = createQueryableComponent<State>();

    const WrappedComponent = connectToObservable<State>(
      empty(),
      defaultState,
    )(MyComponent);

    const renderedElement = render(<WrappedComponent />);
    const props = queryProps<State>(renderedElement);

    expect(props.foo).toEqual('lol');
    expect(props.bar).toEqual('rofl');
  });

  it('should proxy its own props to the wrapped component', () => {
    const MyComponent = createQueryableComponent<State & OwnProps>();

    const WrappedComponent = connectToObservable<State, OwnProps>(
      empty(),
      defaultState,
    )(MyComponent);

    const renderedElement = render(<WrappedComponent baz="one" qux="two" />);
    const props = queryProps<State & OwnProps>(renderedElement);

    expect(props.foo).toEqual('lol');
    expect(props.bar).toEqual('rofl');
    expect(props.baz).toEqual('one');
    expect(props.qux).toEqual('two');
  });
});
