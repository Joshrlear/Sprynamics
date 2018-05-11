import { Component, OnInit, AfterViewInit, QueryList, ViewChild, ViewChildren, ElementRef, HostBinding, HostListener } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthService } from './core/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

import { Observable ,  BehaviorSubject ,  combineLatest } from 'rxjs';


import { NavigationService } from '#core/navigation/navigation.service';
import { FirestoreService } from '#core/firestore.service';

declare const $;

const sideNavView = 'SideNav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @HostBinding('class')
  hostClasses = '';

  isFetching = false;
  isStarting = true;
  isTransitioning = true;
  isSideBySide = false;
  isSideNavDash = false;

  private isFetchingTimeout: any;
  private sideBySideWidth = 992;

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  get isOpened() { return this.isSideBySide && this.ns.isSideNavDash }
  get mode() { return this.ns.isSideNavDash ? (this.isSideBySide ? 'side' : 'over') : 'over' }

  constructor(public auth: AuthService,
    private ns: NavigationService,
    public router: Router,
    private firestore: FirestoreService) { }

  public logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.onResize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.isSideBySide = width > this.sideBySideWidth;

    if (this.isSideBySide && !this.ns.isSideNavDash) {
      // If this is a non-sidenav doc and the screen is wide enough so that we can display menu
      // items in the top-bar, ensure the sidenav is closed.
      // (This condition can only be met when the resize event changes the value of `isSideBySide`
      //  from `false` to `true` while on a non-sidenav doc.)
      this.sideNavToggle(false);
    }
  }


  sideNavToggle(value?: boolean) {
    this.sidenav.toggle(value);
  }

  updateHostClasses() {
    const sideNavOpen = `sidenav-${this.sidenav.opened ? 'open' : 'closed'}`;

    this.hostClasses = [
      sideNavOpen,
    ].join(' ');
  }

  updateSideNav() {
    // Preserve current sidenav open state by default.
    let openSideNav = this.sidenav.opened;
    const isSideNavDash = !!this.ns.isSideNavDash;

    if (this.ns.isSideNavDash !== isSideNavDash) {
      // View type changed. Is it now a sidenav view (e.g, guide or tutorial)?
      // Open if changed to a sidenav doc; close if changed to a marketing doc.
      openSideNav = this.ns.isSideNavDash = isSideNavDash;
    }
    // May be open or closed when wide; always closed when narrow.
    this.sideNavToggle(this.isSideBySide && openSideNav);
  }

  ngAfterViewInit() {

  }

  smoothScroll(hash) {
    if (this.router.url.split('#')[0] === '/') {
      hash = '#' + hash;
      console.log(hash);
      // $('html, body').animate({
      //   scrollTop: $(hash).offset().top
      // }, 800, function () {

      //   // Add hash (#) to URL when done scrolling (default click behavior)
      //   if (hash !== '#home') {
      //     window.location.hash = hash;
      //   }
      // });
    }
  }



}
