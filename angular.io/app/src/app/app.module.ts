import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SwaggerEngineService } from './swagger-engine.service';
import { ShowdataComponent } from './show-data/showdata.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowdataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [SwaggerEngineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
