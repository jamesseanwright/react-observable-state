# React with Observable State

![Screencap of the app](https://raw.githubusercontent.com/jamesseanwright/react-observable-state/master/misc/screencap.gif)

A proof-of-concept React app using RxJS as its primary means of state management, in lieu of [Redux](https://redux.js.org/) or [MobX](https://mobx.js.org/).

## Why?

Redux, despite common complaints of heavy boilerplate, is a reasonable approach to managing state in React and non-React applications alike. Typically, one might introduce [Redux Thunk](https://github.com/reduxjs/redux-thunk) when handling more complex, heavily-asynchronous side effects, but an alternative I have used extensively is [Redux Observable](https://redux-observable.js.org/), a middleware that supports [RxJS](https://rxjs-dev.firebaseapp.com/) observables as actions; this is an attractive proposition when building an app which involves the consumption and heavy transformation of various source streams. Redux Observable, while a valiant effort, has its own concept of [epics](https://redux-observable.js.org/docs/basics/Epics.html), thus one must master this on top of RxJS and Redux, all of which have specific nomenclature.

This proof of concept thus establishes the feasibility of cutting out these middlemen and using RxJS exclusively for managing the state mutations and retrieval within a React app.

## The App

The app is a straightforward React app that renders user-submitted messages, as well as displaying quotes from the [Ron Swanson Quotes](https://github.com/jamesseanwright/ron-swanson-quotes) API.

## Points of Interest

I will be writing a fully-fledged post on this app soon, and might even be giving a talk on it somewhere (TBA very soon), but for now, here's a brief tour.

### [`src/components/connectToObservable.tsx`](https://github.com/jamesseanwright/react-observable-state/blob/master/src/components/connectToObservable.tsx)

A higher-order component that subscribes to a given observable, updating the wrapped component on each emission and unsubscribing when it is unmounted. This makes use of the proposed [React Hooks API](https://reactjs.org/docs/hooks-intro.html).

### [`src/components/MessageForm.tsx`](https://github.com/jamesseanwright/react-observable-state/blob/master/src/components/MessageForm.tsx)

The component responsible for rendering the form, demonstrating the usage of `connectToObservable` as well as dispatching actions with the `toNextState` function.

### [`src/state/state.ts`](https://github.com/jamesseanwright/react-observable-state/blob/master/src/state/state.ts)

The module that houses `appState`, a `BehaviorSubject` with a buffer size of one, as well as the default state and the `withState` and `toNextState` functions; the former is used to invoke the particular reducer returned by an action with the current state, and the latter pushes the emissions of a reducer to `appState`.

### [`src/state/mutations.ts`](https://github.com/jamesseanwright/react-observable-state/blob/master/src/state/mutations.ts)

The action-reducers consumed by the app. As roughly described above, an action will return a reducer; this is a function that takes the current state and either merges it with the payload of an action (i.e. `addMessage`, `onQuoteLoading`, `onQuoteError`), or emits the results of multiple action-reducers (i.e. `addRonSwansonQuote`).

## Running Locally

To set up:

1. `git clone https://github.com/jamesseanwright/react-observable-state.git`
2. `cd react-observable-state`
3. `npm i`

Then you can run one of the following commands:

* `npm run dev` - builds the project with [rollup.js](https://rollupjs.org/guide/en) and serves it from port 8080
* `npm test` - runs the unit tests (append ` -- --watch` to launch Jest's watch mode)
