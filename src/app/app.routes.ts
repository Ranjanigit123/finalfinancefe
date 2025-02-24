// app.routes.ts

import { Routes } from '@angular/router';
import { UserComponent } from './auth/user/user.component';
import { PostComponent } from './post/post/post.component';
import { AddPostComponent } from './post/add-post/add-post.component';
import { MypostComponent } from './post/mypost/mypost.component';

export const routes: Routes = [
    { path: '', component: UserComponent },
    { path: 'getAllPosts', component: PostComponent },
    { path: 'createPost', component: AddPostComponent },
    { path: 'getMyPosts', component: MypostComponent },
];
