import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from './core/auth.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public auth: AuthService) { }

  public logout() {
    this.auth.logout();
  }

  ngAfterViewInit() {

    //   // Add smooth scrolling to all links
    //   $("a").on('click', function(event) {
    
    //     // Make sure this.hash has a value before overriding default behavior
    //     if (window.location.hash !== "") {
    //       // Prevent default anchor click behavior
    //       event.preventDefault();
    
    //       // Store hash
    //       var hash = window.location.hash;

    
    //       // Using jQuery's animate() method to add smooth page scroll
    //       // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    //       $('html, body').animate({
    //         scrollTop: $(hash).offset().top
    //       }, 800, function(){
       
    //         // Add hash (#) to URL when done scrolling (default click behavior)
    //         window.location.hash = hash;
    //       });
    //     } // End if
    //   });
    

    // window.onscroll = function() {scrollFunction()};

    //   function scrollFunction() {
    //       if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    //           document.getElementById("scrollTop").style.display = "block";
    //       } else {
    //           document.getElementById("scrollTop").style.display = "none";
    //       }
    //   }

    //   $("a[href='#']").click(function() {
    //     $("html, body").animate({ scrollTop: 0 }, 800);
    //     return false;
    //     });
  }

  
  
}
