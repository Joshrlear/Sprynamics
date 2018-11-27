import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '#core/auth.service';
import { FirestoreService } from '#core/firestore.service';

@Component({
  selector: 'spry-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  user: any = {};
  @Output('close') public closeEvent = new EventEmitter()

  constructor(public auth: AuthService, private firestore: FirestoreService) { }

  ngOnInit() {
    this.auth.user.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
  }

  exportAgentData() {
    this.firestore.col$('agents').take(1).subscribe(agents => {
      const data: any = agents.reduce((acc: string, cur: any) => acc + `${cur.email},${cur.firstName},${cur.lastName},${cur.participantKey},${cur.phoneNumber},${cur.website}\n`, 'Email,FirstName,LastName,License,PhoneNumber,Website\n')
      const el = document.createElement('a')
      el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data))
      const today = new Date()
      const formattedDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
      el.setAttribute('download', `sprynamics-agents_${formattedDate}.csv`)
      el.style.display = 'none'
      document.body.appendChild(el)
      el.click()
      document.body.removeChild(el)
    })
  }

}
