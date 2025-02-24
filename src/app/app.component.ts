// app.component.ts

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { SharedService } from './shared.service';
import { PostComponent } from './post/post/post.component';
import { SidebarComponent } from './post/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule, CommonModule, SidebarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Personal Finance App';
    isLoggedIn: boolean = false;
    constructor(private router: Router, private authService: AuthService,
        private sharedService: SharedService) { }
    ngOnInit(): void {
        this.authService.loggedInEvent.subscribe((data: any) => {
            this.isLoggedIn = true;
        });
        if (typeof localStorage !== 'undefined' &&
            localStorage.getItem('token')) {
            this.isLoggedIn = true;
        }
    }

    login(): void {
        this.sharedService.triggerLoginEvent();
        this.router.navigate(["/"]);
    }

    register(): void {
        this.sharedService.triggerRegisterEvent();
        this.router.navigate(["/"]);
    }

    logout(): void {
        this.authService.setAuthenticationStatus(false);
        this.isLoggedIn = false;
        localStorage.removeItem('token');
        this.router.navigate(["/"]);
    }

    loadContent(page: string) {
        if (page === "allposts") {
            this.router.navigate(["/getAllPosts"]);
        }
        else if (page === "addpost") {
            this.router.navigate(["/createPost"]);
        }
        else if (page === "myposts") {
            this.router.navigate(["/getMyPosts"]);
        }
    }
}
