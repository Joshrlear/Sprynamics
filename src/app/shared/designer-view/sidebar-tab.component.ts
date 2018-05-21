import { Component, OnInit, Input } from '@angular/core'
import { DesignerViewComponent } from './designer-view.component'

@Component({
  selector: 'app-sidebar-tab',
  template: `
    <ng-container *ngIf="selected">
      <ng-content></ng-content>
    </ng-container>
  `
})
export class SidebarTabComponent implements OnInit {

  @Input() title: string
  @Input() icon: string
  selected: boolean

  constructor(private sidebarComponent: DesignerViewComponent) { }

  ngOnInit() {
    this.sidebarComponent.initTab(this)
  }

}
