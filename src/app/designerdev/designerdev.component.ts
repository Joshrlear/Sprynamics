import { Component, OnInit } from '@angular/core'
import { User } from '#models/user.interface';
import { DesignState } from '#models/design-state.interface';

@Component({
  selector: 'app-designerdev',
  templateUrl: './designerdev.component.html',
  styleUrls: ['./designerdev.component.scss']
})
export class DesignerdevComponent implements OnInit {

  selectedAgent: User
  designState: DesignState

  constructor(
  ) { }

  async ngOnInit() {
  }

}
