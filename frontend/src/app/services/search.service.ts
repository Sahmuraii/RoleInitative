//import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
//import { isPlatformBrowser } from '@angular/common';
//import { HttpClient } from '@angular/common/http';
//import { BehaviorSubject, Observable } from 'rxjs';
//import { tap, catchError } from 'rxjs/operators';
//import { API_URL } from '../constants';
//import { Router } from '@angular/router';
//
//@Injectable({
//  providedIn: 'root'
//})
//export class SearchService {
//  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
//  isLoggedIn$ = this.isLoggedInSubject.asObservable();
//
//  constructor(
//    private http: HttpClient,
//    private router: Router,
//    @Inject(PLATFORM_ID) private platformId: Object
//  ) {
//    this.isLoggedInSubject.next(this.isLoggedIn());
//  }
//
//  isLoggedIn(): boolean {
//    return this.isBrowser() && !!localStorage.getItem('currentUser');
//  }
//
//  getCurrentUser(): any {
//    if (this.isBrowser()) {
//      const user = localStorage.getItem('currentUser');
//      return user ? JSON.parse(user) : null;
//    }
//    return null;
//  }
//
//  private isBrowser(): boolean {
//    return isPlatformBrowser(this.platformId);
//  }
//
//  getUserCharacters(): Observable<any[]> {
//
//    return this.http.get<any[]>(`${API_URL}/characters`).pipe(
//      tap((response) => {
//        console.log('Characters fetched:', response);
//      }),
//      catchError((error) => {
//        console.error('Error fetching characters:', error);
//        throw error;
//      })
//    );
//  }
//}
