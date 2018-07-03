import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="row fill">
        <div class="dashboard-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
