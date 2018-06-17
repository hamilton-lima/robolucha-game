import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestWebsocketComponent } from './test-websocket/test-websocket.component';

@NgModule({
  declarations: [AppComponent, TestWebsocketComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [TestWebsocketComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
