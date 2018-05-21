import { Component, OnInit, Input } from '@angular/core';
import { DesignerViewComponent } from '#app/designer-view/designer-view.component';

@Component({
  selector: 'app-sidebar-tab',
  templateUrl: './sidebar-tab.component.html',
  styleUrls: ['./sidebar-tab.component.scss']
})
export class SidebarTabComponent implements OnInit {

  @Input() title: string;
  @Input() icon: string;
  selected: boolean

  constructor(private sidebarComponent: DesignerViewComponent) { }

  ngOnInit() {
    this.sidebarComponent.initTab(this)
  }

}
