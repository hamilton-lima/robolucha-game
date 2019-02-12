import { Injectable } from "@angular/core";
import { MainLuchador } from "./sdk/model/mainLuchador";
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
export class LuchadorResolverService implements Resolve<MainLuchador> {
  luchador: MainLuchador;
  constructor(private api: DefaultService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<MainLuchador> {
    return this.api.privateLuchadorGet();
  }
}
