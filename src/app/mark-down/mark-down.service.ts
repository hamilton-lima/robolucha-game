import { Injectable } from "@angular/core";
import { Marked, escape, Renderer } from "@ts-stack/markdown";

class MyRenderer extends Renderer {
  link(href: string, title: string, text: string): string {
    let out = '<a href="' + href + '"';

    if (title) {
      out += ' title="' + title + '"';
    }

    out += ' target="_blank">' + text + "</a>";
    return out;
  }
}

@Injectable({
  providedIn: "root"
})
export class MarkDownService {
  parse(input: string): string {
    return Marked.parse(input);
  }

  constructor() {
    this.addCustomTag();
  }

  addCustomTag() {
    Marked.setOptions({ renderer: new MyRenderer() });

    Marked.setBlockRule(/^::: *(\w+)\n([\s\S]+?)\n:::/, function(execArr) {
      const channel = execArr[1];
      const content = execArr[2];

      switch (channel) {
        case "youtube": {
          const id = escape(content);
          return `\n<iframe width="200" height="80" src="https://www.youtube.com/embed/${id}"></iframe>\n`;
        }
        default: {
          const msg = `[Error: a channel "${channel}" for an embedded code is not recognized]`;
          return '<div style="color: red">' + msg + "</div>";
        }
      }
    });
  }
}
