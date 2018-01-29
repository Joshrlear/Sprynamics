import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  @Input('colors') colors: any[];
  @Output('colorChange') colorChange = new EventEmitter();

  colorSelection: any;

  constructor() { }

  ngOnInit() {
  }

  onColorChange(color: string, index: number) {
    this.colorChange.emit({ color, index });
  }

  trackColors(index: number, color: any) {
    return index;
  }

}
