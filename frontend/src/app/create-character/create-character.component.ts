import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-character',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-character.component.html',
  styleUrl: './create-character.component.css'
})
export class CreateCharacterComponent {
  characterForm = new FormGroup({

  })
  @ViewChild('tabtest') tabs!:HTMLButtonElement;
  @ViewChildren('tabContent') tabContents!:QueryList<HTMLDivElement>;
  public showTab(tabId: string) {
    // Remove 'active' class from all tabs and tab contents
    //document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    //document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    //this.tabs.forEach(tab => {/*tab.classList.remove('active')*/ });
    //this.tabContents.forEach(content => {content.classList.remove('active')});
    this.tabs.classList;

    // Add 'active' class to selected tab and corresponding content
    (document.querySelector(`button[onclick="showTab('${tabId}')"]`) as HTMLInputElement).classList.add('active');
    (document.getElementById(tabId) as HTMLFormElement).classList.add('active');
    
  }
}
