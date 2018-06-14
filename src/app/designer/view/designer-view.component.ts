import { Component, OnInit, AfterViewInit, QueryList, ViewChild, ViewChildren, ElementRef, HostBinding, HostListener, Input } from '@angular/core'

import { Observable ,  BehaviorSubject ,  combineLatest } from 'rxjs'
import { SidebarTabComponent } from './sidebar-tab.component';

@Component({
  selector: 'app-designer-view',
  templateUrl: './designer-view.component.html',
  styleUrls: ['./designer-view.component.scss']
})
export class DesignerViewComponent implements OnInit {

  @Input() loading: boolean

  screenSize: 'min' | 'slim' | 'full'
  sidebarSize: 'min' | 'slim' | 'full'

  private smWidth = 520
  private mdWidth = 992

  tabs: SidebarTabComponent[] = []
  selectedTab: 'agent' | 'designs' | 'property' | 'text' | 'colors'

  constructor() { }

  ngOnInit() {
    this.onResize(window.innerWidth)
    this.selectedTab = 'agent'
  }

  initTab(tab: SidebarTabComponent) {
    if (this.tabs.length === 0) {
      tab.selected = true;
    }
    this.tabs.push(tab)
  }

  clickTab(tab: SidebarTabComponent, force?: boolean) {
    if (tab.disabled && !force) {
      return
    }
    if (tab.selected) {
      this.sidebarSize = 'slim'
      tab.selected = false
    } else {
      this.tabs.forEach(tab => tab.selected = false)
      tab.selected = true
      this.sidebarSize = 'full'
    }
  }

  toggleSidebarSize() {
    switch (this.sidebarSize) {
      case 'full':
        this.sidebarSize = 'slim'
        break
      case 'slim':
        this.sidebarSize = 'full'
        break
      case 'min':
        this.sidebarSize = 'full'
        break
    }
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    if (width > this.mdWidth) {
      this.screenSize = 'full'
    } else if (width < this.smWidth) {
      this.screenSize = 'slim'
    } else {
      this.screenSize = 'slim'
    }

    this.sidebarSize = this.screenSize
  }

}
