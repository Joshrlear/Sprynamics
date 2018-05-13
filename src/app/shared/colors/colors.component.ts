import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrandColorRole, BrandColors, BrandColorChangeEvent } from '#app/shared/colors/brand-colors.interface';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent {

  @Input('colors') colors: BrandColors;
  @Input('presetColors') presetColors: any[];
  
  @Output('colorChange') colorChange = new EventEmitter<BrandColorChangeEvent>();
  @Output('change') changeEvent = new EventEmitter();

  onColorChange(color: string, role: BrandColorRole) {
    this.colorChange.emit({ color, role });
  }

  trackColors(index: number, color: any) {
    return index;
  }

  onChange() {
    this.changeEvent.emit(null);
  }

}
