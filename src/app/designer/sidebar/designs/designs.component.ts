import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '#core/firestore.service';
import { thumbnailSizes } from '#models/product.model.ts';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.scss']
})
export class DesignsComponent implements AfterViewInit {

  @Input('showContextMenu') showContextMenu: boolean;
  @Input('showDropdown') showDropdown: boolean;

  @Output('select') selectEvent = new EventEmitter();

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

  deleteDesign(design) {
    if (confirm(`Are you sure you wish to permanently delete this design? (${design.name})`)) {
      this.firestore.delete(`templates/${design.id}`)
        .then(() => {
          this.templates = this.firestore.colWithIds$('templates', ref => ref.where('productType.size', '==', this.size));
          window.alert('Successfully deleted design.');
        })
        .catch(err => {
          window.alert(err.message);
        })
    }
  }

}
