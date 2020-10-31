import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { DefaultService, ModelGameComponent } from "../sdk";
import { AlertService } from "../shared/alert.service";
import { EventsService } from "../shared/events.service";
import { WallpaperConfig, WallPaperGeneratorService } from "./wall-paper-generator.service";

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
    for (let i = 0; i < 50; i++) {
      list.push(this.api.privateMaskRandomGet());
    }

    forkJoin(list).subscribe((configs) => {
      const wallpaperConfig = <WallpaperConfig>{
        width: 4000,
        height: 2400,
        maskWidth: 200,
        maskHeight: 200,
        border: 10
      };
      
      this.service.generate(configs, wallpaperConfig).then((canvas) => {
        this.previewImageData = canvas.toDataURL("image/png");
      });
      this.cdRef.detectChanges();
    });
  }
}
