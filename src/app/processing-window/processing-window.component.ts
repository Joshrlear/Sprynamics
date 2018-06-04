import { Component, OnInit } from '@angular/core';
import { StateService } from '#core/state.service';

@Component({
  selector: 'app-processing-window',
  templateUrl: './processing-window.component.html',
  styleUrls: ['./processing-window.component.scss']
})
export class ProcessingWindowComponent implements OnInit {

  constructor(private state: StateService) { }

  ngOnInit() {
    this.state.registerProcessingWindow(this)
  }

}
