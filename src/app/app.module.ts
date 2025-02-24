// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { PostComponent } from './post/post/post.component';
import { UserComponent } from './auth/user/user.component';
import { MypostComponent } from './post/mypost/mypost.component';
@NgModule({
    declarations: [
        
    ],
    imports: [
        AppComponent,
        PostComponent,
        UserComponent,
        MypostComponent,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
    providers: [{
        provide: JWT_OPTIONS,
        useValue: JWT_OPTIONS
    }, JwtHelperService],
    bootstrap: []
})
export class AppModule { }
