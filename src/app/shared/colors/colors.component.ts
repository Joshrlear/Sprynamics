import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent implements OnInit {

  @Input('colors') colors: any[];
  @Input('bgColor') bgColor: string;
  @Input('showAddButton') showAddButton: boolean;
  @Input('showBackground') showBackground = true;
  @Input('presetColors') presetColors: any[];
  @Output('colorChange') colorChange = new EventEmitter();
  @Output('bgColorChange') bgColorChange = new EventEmitter();
  @Output('addColor') addColor = new EventEmitter();
  @Output('change') changeEvent = new EventEmitter();

  colorSelection: any;

  constructor() { }

  ngOnInit() { }

  onColorChange(color: string, index: number) {
    this.colorChange.emit({ color, index });
  }

  onBgColorChange(color: string) {
    this.bgColorChange.emit(color);
  }

  onAddColor() {
    this.addColor.emit(null);
  }

  trackColors(index: number, color: any) {
    return index;
  }

  onChange() {
    this.changeEvent.emit(null);
  }

}
