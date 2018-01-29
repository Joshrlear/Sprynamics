import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  @Input('colors') colors: any[];
  @Input('bgColor') bgColor: string;
  @Output('colorChange') colorChange = new EventEmitter();
  @Output('bgColorChange') bgColorChange = new EventEmitter();

  colorSelection: any;

  constructor() { }

  ngOnInit() {
    console.log(this.bgColor);
  }

  onColorChange(color: string, index: number) {
    this.colorChange.emit({ color, index });
  }

  onBgColorChange(color: string) {
    this.bgColorChange.emit(color);
  }

  trackColors(index: number, color: any) {
    return index;
  }

}
