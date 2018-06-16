import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestWebsocketComponent } from './test-websocket/test-websocket.component';

const config: SocketIoConfig = { url: 'http://localhost:5000/ws', options: {} };

@NgModule({
  declarations: [AppComponent, TestWebsocketComponent],
  imports: [BrowserModule, AppRoutingModule, SocketIoModule.forRoot(config)],
  providers: [TestWebsocketComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
