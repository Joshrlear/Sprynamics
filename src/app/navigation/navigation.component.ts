import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  smoothScroll(hash) {
    if (this.router.url.split('#')[0] === '/') {
      hash = '#' + hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function () {
  
        // Add hash (#) to URL when done scrolling (default click behavior)
        if (hash !== '#home') {
          window.location.hash = hash;
        }
      });
    }
  }

  toggleMenu() {
    document.getElementById("mobile-menu_dropdown").classList.toggle("active");
  }

  public logout() {
    this.auth.logout();
  }

}
