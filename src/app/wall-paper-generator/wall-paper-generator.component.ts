import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { DefaultService, ModelBulkConfig, ModelConfig, ModelGameComponent } from "../sdk";
import { EventsService } from "../shared/events.service";
import { WallpaperDimension, WallPaperGeneratorService } from "./wall-paper-generator.service";

@Component({
  selector: "app-wall-paper-generator",
  templateUrl: "./wall-paper-generator.component.html",
  styleUrls: ["./wall-paper-generator.component.scss"],
})
export class WallPaperGeneratorComponent implements OnInit {
  page: string;
  previewImageData: string = "assets/maps/image-not-found.png";
  processing = false;

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
    this.processing = true;
    const list = [];
    const dimension = <WallpaperDimension>{
      widthCount: 18,
      heightCount: 14
    };

    const total = dimension.widthCount * dimension.heightCount;
    this.api.privateMaskRandomBulkAmountGet(total).subscribe((configs: Array<ModelBulkConfig>) => {
      this.service.generate(configs, dimension).then((canvas) => {
        this.previewImageData = canvas.toDataURL("image/png");
        this.processing = false;
      });
      this.cdRef.detectChanges();
    });
  }
}
