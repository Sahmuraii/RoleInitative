import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  //https://angular.dev/tutorials/first-app/13-search
  //searchResultsList: SearchResults[] = [];
  //searchService: SearchService = inject(SearchService);
  //filteredResultsList: SearchResults[] = []
  //constructor() {
  //  this.searchResultsList = this.searchService.getAllSearchResults();
  //  this.filteredResultsList = this.searchResultsList;
  //}
  //filterResults(text: string) {
  //  if (!text) {
  //    this.filteredResultsList = this.searchResultsList;
  //    return;
  //  }

  //  this.filteredResultsList = this.searchResultsList.filter((searchResult) =>
  //    searchResult?.includes(text.toLowerCase()),
  //  );
  //}
}
