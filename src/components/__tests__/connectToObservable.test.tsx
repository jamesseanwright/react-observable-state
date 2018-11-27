import * as React from 'react';
import { shallow } from 'enzyme';
import connectToObservable from '../connectToObservable';
import { empty } from 'rxjs';

interface State {
  foo: string;
  bar: string;
}

interface OwnProps {
  baz: string;
  qux: string;
}

const MyComponent = () => <div />;

describe('connectToObservable', () => {
  it('should render the wrapped component with defaultState as props', () => {
    const defaultState = {
      foo: 'lol',
      bar: 'rofl',
    };

    const WrappedComponent = connectToObservable<State>(
      empty(),
      defaultState,
    )(MyComponent);

    const rendered = shallow(<WrappedComponent />);

    expect(rendered.prop('foo')).toEqual('lol');
    expect(rendered.prop('bar')).toEqual('rofl');
  });
});
