import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '../../core/firestore.service';
import { thumbnailSizes } from '../products';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.scss']
})
export class DesignsComponent implements AfterViewInit {

  thumbnailSizes = thumbnailSizes;

  templates: Observable<any>;

  @Input('size') size: string = '9x6';
  @Input('showDropdown') showDropdown: boolean;

  @Output('select') selectEvent = new EventEmitter();

  constructor(private firestore: FirestoreService) { }

  ngAfterViewInit() {
    if (this.showDropdown && !this.size) {
      this.size = '9x6';
    }

    if (this.size) {
      this.templates = this.firestore.colWithIds$('templates', ref => ref.where('productType.size', '==', this.size));
    } else {
      this.templates = this.firestore.colWithIds$('templates');
    }
  }
  
  select(template) {
    this.selectEvent.emit(template);
  }
  
  updateProduct(size: string) {
    this.size = size;
    this.templates = this.firestore.colWithIds$('templates', ref => ref.where('productType.size', '==', this.size));
  }

}
