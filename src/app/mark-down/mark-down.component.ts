import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MarkDownService } from "./mark-down.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-mark-down",
  templateUrl: "./mark-down.component.html",
  styleUrls: ["./mark-down.component.scss"]
})
export class MarkDownComponent implements OnInit {
  private readonly fileUrl = "/assets";
  private readonly fileExtension = ".md";

  @Input() fileName: string;
  content: SafeHtml;

  constructor(
    private http: HttpClient,
    private markdown: MarkDownService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const url = this.fileUrl + "/" + this.fileName + this.fileExtension;
    this.http.get(url, { responseType: "text" }).subscribe(res => {
      const html = this.markdown.parse(res);
      this.content = this.sanitizer.bypassSecurityTrustHtml(html);
    });
  }
}
