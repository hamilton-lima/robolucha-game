import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { GenericErrorModalMessageService } from "../generic-error-modal-message.service";
import {Location} from '@angular/common';

@Component({
  selector: "app-generic-error-modal-message",
  templateUrl: "./generic-error-modal-message.component.html",
  styleUrls: ["./generic-error-modal-message.component.scss"]
})
export class GenericErrorModalMessageComponent implements OnInit {
  error: HttpErrorResponse;
  constructor(private errorService: GenericErrorModalMessageService, private location: Location) {
    this.errorService.errors.subscribe(error => (this.error = error));
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
