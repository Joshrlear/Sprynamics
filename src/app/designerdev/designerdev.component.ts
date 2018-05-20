import { Component, OnInit, AfterViewInit, QueryList, ViewChild, ViewChildren, ElementRef, HostBinding, HostListener } from '@angular/core';

import { Observable ,  BehaviorSubject ,  combineLatest } from 'rxjs';

@Component({
  selector: 'app-designerdev',
  templateUrl: './designerdev.component.html',
  styleUrls: ['./designerdev.component.scss']
})
export class DesignerdevComponent implements OnInit {
  scrFull = false;
  scrSlim = false;
  scrMin = false;
  isFull = false;
  isSlim = false;
  isMin = false;
  private smWidth = 520;
  private mdWidth = 992;

  constructor() { }

  ngOnInit() {
    this.onResize(window.innerWidth);
  }

  tabToggle() {
    if (this.isFull) {
      this.slimSidenav();
    }

    else if (this.isSlim) {
      this.minSidenav();
    }

    else if (this.isMin) {
      this.fullSidenav();
    }
  }

  minSidenav() {
    //Sidebar
    document.getElementById("designer-sidebar").classList.remove("slim", "full");

    //Canvas
    document.getElementById("designer-view").classList.remove("slim", "full");

    (this.isMin) = true;
    (this.isSlim) = false;
    (this.isFull) = false;
  }

  slimSidenav() {
    //Sidebar
    document.getElementById("designer-sidebar").classList.add("slim");

    document.getElementById("designer-sidebar").classList.remove("full");

    //Canvas
    document.getElementById("designer-view").classList.add("slim");

    document.getElementById("designer-view").classList.remove("full");

    (this.isMin) = false;
    (this.isSlim) = true;
    (this.isFull) = false;
  }

  fullSidenav() {
    //Sidebar
    document.getElementById("designer-sidebar").classList.add("full");

    document.getElementById("designer-sidebar").classList.remove("slim");

    //Canvas
    document.getElementById("designer-view").classList.add("full");

    document.getElementById("designer-view").classList.remove("slim");

    (this.isMin) = false;
    (this.isSlim) = false;
    (this.isFull) = true;
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.scrFull = width > this.mdWidth;

    this.scrSlim = width < this.mdWidth;

    this.scrMin = width < this.smWidth;

    if (this.scrFull) {
      this.fullSidenav();
    }

    if (this.scrSlim) {
      this.slimSidenav();
    }

    if (this.scrMin) {
      this.minSidenav();
    }
  }

}
