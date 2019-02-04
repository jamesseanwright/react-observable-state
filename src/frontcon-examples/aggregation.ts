import { fromEvent, concat } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { switchMap, map } from 'rxjs/operators';

const submitButton = document.querySelector<HTMLButtonElement>('.button')!;

const loadStory = fromEvent<HTMLButtonElement>(submitButton, 'click');
const renderComponentFromData = (story: {}) => undefined;

loadStory.pipe(
  switchMap(({ dataset: { id } }) =>
    concat(
      ajax(`/api/story/${id}`),
      ajax(`/api/story/${id}/comments`),
    ),
  ),
  map(({ response }) => response),
).subscribe(response =>
  renderComponentFromData(response),
);
