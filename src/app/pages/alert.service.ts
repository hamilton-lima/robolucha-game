import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class AlertService {
  static readonly INFO = "snack-bar-info";
  static readonly WARNING = "snack-bar-warning";
  static readonly ERROR = "snack-bar-error";

  constructor(public snackBar: MatSnackBar) {}

  private base(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: className
    });
  }

  info(message: string, action: string) {
    this.base(message, action, AlertService.INFO);
  }

  warning(message: string, action: string) {
    this.base(message, action, AlertService.WARNING);
  }

  error(message: string, action: string) {
    this.base(message, action, AlertService.ERROR);
  }
}
