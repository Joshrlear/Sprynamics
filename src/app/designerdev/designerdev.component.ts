import { Component, OnInit, AfterViewInit, QueryList, ViewChild, ViewChildren, ElementRef, HostBinding, HostListener } from '@angular/core';

import { Observable ,  BehaviorSubject ,  combineLatest } from 'rxjs';

@Component({
  selector: 'app-designerdev',
  templateUrl: './designerdev.component.html',
  styleUrls: ['./designerdev.component.scss']
})
export class DesignerdevComponent implements OnInit {

  screenSize: 'min' | 'slim' | 'full';
  sidebarSize: 'min' | 'slim' | 'full';

  private smWidth = 520;
  private mdWidth = 992;

  constructor() { }

  ngOnInit() {
    this.onResize(window.innerWidth);
  }

  tabToggle() {
    switch (this.sidebarSize) {
      case 'full':
        this.sidebarSize = 'slim';
        break;
      case 'slim':
        this.sidebarSize = 'min';
        break;
      case 'min':
        this.sidebarSize = 'full';
        break;
    }
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    if (width > this.mdWidth) {
      this.screenSize = 'full';
    } else if (width < this.smWidth) {
      this.screenSize = 'min';
    } else {
      this.screenSize = 'slim';
    }

    this.sidebarSize = this.screenSize;
  }

}
