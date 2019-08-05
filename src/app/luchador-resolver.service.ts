import { Injectable } from "@angular/core";
import { ModelLuchador } from "./sdk/model/mainLuchador";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { DefaultService } from "./sdk/api/default.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LuchadorResolverService implements Resolve<ModelLuchador> {
  luchador: ModelLuchador;
  constructor(private api: DefaultService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ModelLuchador> {
    return this.api.privateLuchadorGet();
  }
}
