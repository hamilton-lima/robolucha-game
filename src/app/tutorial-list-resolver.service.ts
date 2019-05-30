import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { MainGameDefinition, DefaultService } from './sdk';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorialListResolverService implements Resolve<MainGameDefinition[]> {

  tutorials: MainGameDefinition[];

  constructor(private api: DefaultService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<MainGameDefinition[]>{
    return this.api.privateTutorialGet();
  }
}
