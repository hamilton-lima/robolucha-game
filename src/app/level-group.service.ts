import { Injectable } from "@angular/core";
import { DefaultService } from "./sdk";
import { Subject, ReplaySubject, BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ModelLevelGroup } from "./sdk/model/modelLevelGroup";

@Injectable({
  providedIn: "root",
})
export class LevelGroupService {
  private all: ReplaySubject<ModelLevelGroup[]>;

  constructor(private api: DefaultService) {
    this.all = new ReplaySubject<ModelLevelGroup[]>(1);

    this.api.privateLevelGroupGet().subscribe((result) => {
      const sorted = result.sort((a, b) => a.minLevel - b.minLevel);
      this.all.next(sorted);
    });
  }

  findAll(): Subject<ModelLevelGroup[]> {
    return this.all;
  }

  find(level: number): Observable<ModelLevelGroup> {
    return this.all.pipe(
      map((all) => {
        const filter = all.filter((levelGroup) => levelGroup.minLevel <= level);
        
        if (filter.length == 0) {
          console.error("Level group not found");
          return <ModelLevelGroup>{};
        }
        
        // return the last Level group
        const last = filter[filter.length - 1];
        return last;
      })
    );
  }
}
