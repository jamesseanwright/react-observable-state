/* Unfortunately, Facebook's react-test-renderer
 * doesn't support hooks, at the time of writing,
 * so I'm rolling my own with jsdom and React DOM. */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { JSDOM } from 'jsdom';

// Using traditional declaration due to TypeScript/issues/27595
export function render<TProps = {}>(element: React.ReactElement<TProps>) {
  const dom = new JSDOM(`<div></div>`);
  const { body } = dom.window.document;
  const renderedElement = body.firstChild as HTMLDivElement;

  ReactDOM.render(element, renderedElement);

  return renderedElement;
}

export function createQueryableComponent<TProps = {}>() {
  return (props: TProps) => <div>{JSON.stringify(props)}</div>;
}

export function queryProps<TProps>(element: HTMLElement) {
  return JSON.parse(element.textContent) as TProps;
}
