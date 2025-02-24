// post.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post.service';
import { DataService } from '../../data.service';
import { LikeService } from '../../like/like.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './post.component.html',
    styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {
sortByDailyPayment: any;
    
applySearch(): void {
    const searchTextLower = this.searchText ? this.searchText.toLowerCase() : '';
  
    this.displayedPostList = this.postList.filter(post => {
      const titleMatch = post.title?.toLowerCase().includes(searchTextLower);
      const contentMatch = post.content?.toString().toLowerCase().includes(searchTextLower); // Convert numbers to strings
      const categoryMatch = post.category?.toString().toLowerCase().includes(searchTextLower);
      const attachmentMatch = post.attachment?.toString().toLowerCase().includes(searchTextLower);
  
      return titleMatch || contentMatch || categoryMatch || attachmentMatch;
    });
  }
       /* applySearch(): void {
            const search = this.searchText?.toLowerCase() || '';
            
            this.displayedPostList = this.postList
              .filter(post =>
                post.title?.toLowerCase().includes(search) ||
                post.content?.toLowerCase().includes(search)
              )
              .sort((a, b) => {
                // Prioritize posts with the search text appearing earlier in title or content
                const aTitle = a.title?.toLowerCase().indexOf(search);
                const bTitle = b.title?.toLowerCase().indexOf(search);
                const aContent = a.content?.toLowerCase().indexOf(search);
                const bContent = b.content?.toLowerCase().indexOf(search);
          
                // Get the minimum index for each post (earliest match)
                const aIndex = Math.min(aTitle === -1 ? Infinity : aTitle, aContent === -1 ? Infinity : aContent);
                const bIndex = Math.min(bTitle === -1 ? Infinity : bTitle, bContent === -1 ? Infinity : bContent);
          
                return aIndex - bIndex; // Sort by index, lower comes first
              });
          }*/
//applySearch() {
//throw new Error('Method not implemented.');
//}
    postList: any[] = [];
    displayedPostList: any[] = [];
    showUpdateForm: boolean = false;
    postById: any = {};
    myPosts: any[] = [];
    postUpdated: any = {};
    errorMessage: string = "";
    userDetails: any = {};
    loggedInUser: string | null = "";
    isLiked: boolean = false;
    username: any[] = [];
    email: any[] = [];
    posts: any[] = [];
    @Output() buttonClicked: EventEmitter<void> =
        new EventEmitter < void> ();
    likes: number = 0;
    searchText: any;
    //likeService: any;
    constructor(private postService: PostService,
        private dataService: DataService, 
        private likeService: LikeService, 
        private router: Router) { }
    ngOnInit(): void {
        this.getAllPosts();
    }
    
      
   
    

    getUserId(): string | null {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                return tokenPayload.user.id;
            }
        }
        return null;
    }

    getAllPosts(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postService.getAllPosts()
                    .subscribe((postList: any) => {
                        //this.postList = postList;
                        //this.displayedPostList = [...this.postList];
                        this.postList = postList.map((post: any) => {
                            post.attachment = post.content - post.category; // Calculate attachment
                            return post;
                        });
                        this.displayedPostList = [...this.postList];
                    });
            }
        }
    }

    getUserDetails(userId: string): any {
        this.dataService.getUserDetails(userId)
            .subscribe((userDetails: any) => {
                this.userDetails = userDetails;
            });
    }

    getPostById(postId: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.showUpdateForm = false;
                this.postService.getPostById(postId)
                    .subscribe((postById) => {
                        this.postById = postById;
                    });
            }
        }
    }

    getMyPosts(): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.showUpdateForm = false;
                this.postService.getMyPosts(token)
                    .subscribe((myPosts) => {
                        this.myPosts = myPosts;
                        this.displayedPostList = [...this.myPosts];
                    });
            }
        }
    }

    populateUpdateForm(post: any) {
        this.loggedInUser = this.getUserId();
        if (this.loggedInUser === post.author) {
            this.postUpdated = { ...post };
            this.postUpdated.updatedAt = new Date;
            this.postUpdated.createdAt = this.postUpdated
                .createdAt.slice(0, 10);
            this.getUserDetails(post.author);
            // Ensure form shows only after userDetails is set
            this.dataService.getUserDetails(post.author).subscribe((userDetails: any) => {
            this.userDetails = userDetails;
            this.showUpdateForm = true;
            });
        }
    }

    updatePost(postId: string): void {
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postUpdated.attachment = (this.postUpdated.attachment || this.postUpdated.content) - this.postUpdated.category;
                this.postService.updatePost(this.postUpdated, token)
                    .subscribe((postUpdated: any) => {
                        const index = this.displayedPostList.findIndex((p) =>
                            p._id === postId);
                        if (index !== -1) {
                            this.postList[index] = postUpdated;
                            this.displayedPostList[index] = postUpdated;
                            this.getAllPosts();
                            this.showUpdateForm = false;
                            this.router.navigate(["/getAllPosts"]);
                        }
                        this.cancelUpdate();
                    },
                        error => {
                            this.errorMessage = "Error in updating the post";
                        });
            }
        }
    }

    cancelUpdate(): void {
        this.showUpdateForm = false;
        this.postUpdated = {};
    }

    confirmDelete(postId: string): void {
        const confirmDelete = window.confirm
            ("Are you sure you want to delete the post");
        if (confirmDelete) {
            this.deletePost(postId);
        }
    }

    deletePost(post: any): void {
        const postId = post._id;
        if (typeof localStorage !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                this.postService.deletePost(postId, token)
                    .subscribe(() => {
                        this.postList = this.postList.filter((post: any)=> post._id !== postId);
                        this.displayedPostList = [...this.postList];
                    },
                        error => {
                            this.errorMessage = "Error in deleting the post";
                        }
                    );
            }
        }
    }

    toggleLike(postId: string) {
        if (typeof localStorage !== "undefined") {
            const token = localStorage.getItem('token');
            if (token) {
                const postIndex = this.displayedPostList.findIndex
                    (post => post._id === postId);
                if (postIndex !== -1) {
                    const post = this.displayedPostList[postIndex];
                    this.likeService.toggleLike(postId, token)
                        .subscribe((response: { success: any; message: any; }) => {
                            if (response.success) {
                                post.isLiked = !post.isLiked;
                                if (post.isLiked) {
                                    post.likes.push('');
                                } else {
                                    post.likes.pop();
                                }
                                this.displayedPostList[postIndex] = post;
                            } else {
                                console.error(response.message);
                            }
                        });
                }
            }
        }
    }
}
