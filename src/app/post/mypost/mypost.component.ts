// mypost.component.ts

import { Component, OnInit, TemplateRef } from '@angular/core';
import { PostService } from '../post.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIfContext } from '@angular/common';

@Component({
    selector: 'app-mypost',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './mypost.component.html',
    styleUrl: './mypost.component.css'
})
export class MypostComponent implements OnInit {
    myPosts: any[] = [];
    displayedPostList: any[] = [];
noPosts: TemplateRef<NgIfContext<boolean>> | null | undefined;
post: any;
searchText: any;
//applySearch: any;

    constructor(private postService: PostService) { }
    ngOnInit(): void {
        this.getMyPosts();
    }
    getMyPosts(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postService.getMyPosts(token).subscribe((myPosts) => {
                    this.myPosts = myPosts;
                    this.displayedPostList = [...this.myPosts];
                });
            }
        }
    }
}
