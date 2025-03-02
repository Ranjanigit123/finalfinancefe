// auth.service.ts

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'https://finance-be-3xnj.onrender.com/api/auth';
    constructor(private httpClient: HttpClient) { }

    register(userData: any): Observable<any> {
        return this.httpClient
            .post(`${this.baseUrl}/register`, userData);
    };

    login(credentials: any): Observable<any> {
        return this.httpClient
            .post(`${this.baseUrl}/login`, credentials);
    };

    private isAuthenticatedSubject = new BehaviorSubject
        < boolean > (false);

    isAuthenticated(): Observable<boolean> {
        return this.isAuthenticatedSubject
            .asObservable();
    }

    setAuthenticationStatus(isAuthenticated: boolean): void {
        this.isAuthenticatedSubject
            .next(isAuthenticated);
    }

    loggedInEvent: EventEmitter<any>
        = new EventEmitter();
    emitLoggedInEvent() {
        this.loggedInEvent.emit();
    }
}
