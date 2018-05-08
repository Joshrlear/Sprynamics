import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '#core/firestore.service';
import { thumbnailSizes } from '#app/designer/products';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.scss']
})
export class DesignsComponent implements AfterViewInit {

  thumbnailSizes = thumbnailSizes;

  templates: Observable<any>;

  private _size;
  get size() {
    return this._size;
  }
  @Input('size') set size(size) {
    if (size) {
      this._size = size;
      this.templates = this.firestore.colWithIds$('templates', ref => ref.where('productType.size', '==', size));
      console.log('set templates')
    }
  }

  @Input('showDropdown') showDropdown: boolean;

  @Output('select') selectEvent = new EventEmitter();

  constructor(private firestore: FirestoreService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.showDropdown) {
      this.size = '9x6';
      this.templates = this.firestore.colWithIds$('templates', ref => ref.where('productType.size', '==', '9x6'));
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
