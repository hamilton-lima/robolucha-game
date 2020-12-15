import { Injectable } from '@angular/core';
import { ModelMedia, ModelNarrativeDefinition } from 'src/app/sdk';
import { NARRATIVE_EVENTS, NARRATIVE_TYPES } from 'src/app/shared/consts';

@Injectable({
  providedIn: 'root'
})
export class NarrativeBuilderService {
  readonly EVENTS = NARRATIVE_EVENTS;
  readonly TYPES = NARRATIVE_TYPES;
  readonly DEFAULT_TYPE = 0;
  readonly DEFAULT_EVENT = 0;

  constructor() {}

  getTypes() {
    return this.TYPES;
  }
  getEvents() {
    return this.EVENTS;
  }

  build(): ModelNarrativeDefinition {
    const tempID = new Date().getTime() * -1;

    const result = <ModelNarrativeDefinition>{
      id: tempID,
      type: this.TYPES[this.DEFAULT_TYPE],
      event: this.EVENTS[this.DEFAULT_EVENT],
      text: "",
      sortOrder: 0,
      media: <ModelMedia>{}
    };

    return result;
  }
}
