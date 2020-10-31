import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { DefaultService, ModelConfig, ModelGameComponent } from "../sdk";
import { AlertService } from "../shared/alert.service";
import { EventsService } from "../shared/events.service";
import { WallpaperConfig, WallpaperDimension, WallPaperGeneratorService } from "./wall-paper-generator.service";

@Component({
  selector: "app-wall-paper-generator",
  templateUrl: "./wall-paper-generator.component.html",
  styleUrls: ["./wall-paper-generator.component.scss"],
})
export class WallPaperGeneratorComponent implements OnInit {
  page: string;
  previewImageData: string = "assets/maps/image-not-found.png";

  constructor(
    private route: ActivatedRoute,
    private api: DefaultService,
    private cdRef: ChangeDetectorRef,
    private events: EventsService,
    private service: WallPaperGeneratorService
  ) {}

  ngOnInit() {
    this.page = this.route.snapshot.url.join("/");
  }

  generate() {
    this.events.click(this.page, "generate-wallpaper");
    const list = [];
    for (let i = 0; i < 10; i++) {
      list.push(this.api.privateMaskRandomGet());
    }

    forkJoin(list).subscribe((configs: Array<ModelConfig[]>) => {
      const dimension = <WallpaperDimension>{
        widthCount: 40,
        heightCount: 24
      };

      this.service.generate(configs, dimension).then((canvas) => {
        this.previewImageData = canvas.toDataURL("image/png");
      });
      this.cdRef.detectChanges();
    });
  }
}
