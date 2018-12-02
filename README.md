# React with Observable State

![Screencap of the app](https://raw.githubusercontent.com/jamesseanwright/react-observable-state/master/misc/screencap.gif)

A proof-of-concept React app using RxJS as its primary means of state management, in lieu of [Redux](https://redux.js.org/) or [MobX](https://mobx.js.org/).

## Why?

Redux, despite common complaints of heavy boilerplate, is a reasonable approach to managing state in React and non-React applications alike. Typically, one might introduce [Redux Thunk](https://github.com/reduxjs/redux-thunk) when handling more complex, heavily-asynchronous side effects, but an alternative I have used extensively is [Redux Observable](https://redux-observable.js.org/), a middleware that supports [RxJS](https://rxjs-dev.firebaseapp.com/) observables as actions; this is an attractive proposition when building an app which involves the consumption and heavy transformation of various source streams. Redux Observable, while a valiant effort, has its own concept of [epics](https://redux-observable.js.org/docs/basics/Epics.html), thus one must master this on top of RxJS and Redux, all of which have specific nomenclature.

This proof of concept thus establishes the feasibility of cutting out these middlemen and using RxJS exclusively for managing the state mutations and retrieval within a React app.

## The App

TODO

## Points of Interest

TODO

## Running Locally

TODO
