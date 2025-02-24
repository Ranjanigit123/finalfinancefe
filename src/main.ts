import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // Import this
import { AppComponent } from './app/app.component';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Add this to enable HttpClient
  ],
};
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));