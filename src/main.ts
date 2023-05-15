import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  TitleStrategy,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { TaskboardTitleStrategy } from './app/core/strategies';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    MatDialog,
    importProvidersFrom(MatDialogModule),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    { provide: TitleStrategy, useClass: TaskboardTitleStrategy },
  ],
}).catch((err) => console.error(err));
