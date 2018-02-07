import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Output('change') changeEvent = new EventEmitter();

  viewSide: string;
  
  constructor() { }

  ngOnInit() {
  }

  render() {
    this.renderEvent.emit(null);
  }

  onChange() {
    this.changeEvent.emit(null);
  }

}
