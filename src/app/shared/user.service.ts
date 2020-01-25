import { Injectable } from '@angular/core';
import { ModelUserDetails } from '../sdk';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: ModelUserDetails;

  constructor() { }

  setUser(user: ModelUserDetails) {
    this.user = user;
  }

  getUser(): ModelUserDetails{
    return this.user;
  }

}
