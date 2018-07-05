import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '#core/auth.service';

@Component({
  selector: 'spry-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  user: any = {};
  @Output('close') public closeEvent = new EventEmitter()

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.auth.user.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
  }

}
