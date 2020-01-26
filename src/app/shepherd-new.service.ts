import { Injectable } from "@angular/core";
import Shepherd from "shepherd.js";

export interface ITourStepAtachTo {
  element: string;
  on: string;
}

export interface ITourStep {
  title: string;
  text: string;
  attachTo: ITourStepAtachTo;
  offset?: string;
}

@Injectable({
  providedIn: "root"
})
export class ShepherdNewService {
  readonly backButton = {
    action() {
      return this.back();
    },
    classes: "shepherd-button-secondary",
    text: "Back"
  };

  readonly nextButton = {
    action() {
      return this.next();
    },
    text: "Next"
  };

  readonly closeButton = {
    action() {
      return this.next();
    },
    text: "Close"
  };

  private buildTour() {
    return new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        scrollTo: { behavior: "smooth", block: "center" },
        modalOverlayOpeningPadding: 5,
        tetherOptions: {
          offset: "20px 0"
        }
      }
    });
  }

  show(steps: ITourStep[]): Shepherd.Tour {
    const tour = this.buildTour();
    let counter = 1;
    steps.forEach((step: ITourStep) => {
      let stepString = "";

      let buttons = [];
      if (steps.length == 1) {
        buttons.push(this.closeButton);
      } else {
        stepString = "(" + counter + "/" + steps.length + ")";

        if (counter > 1) {
          buttons.push(this.backButton);
        }
        buttons.push(this.nextButton);
      }

      const tourStep = <Shepherd.Step.StepOptions>{
        title: step.title + " " + stepString,
        text: step.text,
        attachTo: step.attachTo,
        buttons: buttons
      };

      if (step.offset) {
        tourStep.tetherOptions = { offset: step.offset };
      }

      tour.addStep(tourStep);
      counter++;
    });

    tour.start();
    return tour;
  }

  done(tour: Shepherd.Tour) {
    console.log("tour", tour);
    tour.complete();
  }
  
}
