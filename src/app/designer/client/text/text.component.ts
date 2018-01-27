import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {

  @Input('productName') productName: string;
  @Input('size') size: string;
  @Input('formFields') formFields: any = [];

  @Output('render') renderEvent = new EventEmitter();

  viewSide: string;
  
  constructor() { }

  ngOnInit() {
  }

  updateViewSide() {

  }

  render() {
    this.renderEvent.emit(null);
  }

}
