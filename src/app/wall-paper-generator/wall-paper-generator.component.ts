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
    const dimension = <WallpaperDimension>{
      widthCount: 20,
      heightCount: 15
    };

    const total = dimension.widthCount * dimension.heightCount;
    for (let i = 0; i < total; i++) {
      list.push(this.api.privateMaskRandomGet());
    }

    forkJoin(list).subscribe((configs: Array<ModelConfig[]>) => {

      this.service.generate(configs, dimension).then((canvas) => {
        this.previewImageData = canvas.toDataURL("image/png");
      });
      this.cdRef.detectChanges();
    });
  }
}
