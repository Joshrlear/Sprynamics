import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from '../../core/firestore.service';

@Component({
  selector: 'app-designs',
  templateUrl: './designs.component.html',
  styleUrls: ['./designs.component.scss']
})
export class DesignsComponent implements OnInit {

  templates: Observable<any>;

  @Input('size') size: any;
  @Output('select') selectEvent = new EventEmitter();

  constructor(private firestore: FirestoreService) { }

  ngAfterViewInit() {
    if (this.size) {
      this.templates = this.firestore.colWithIds$('templates', ref => ref.where('productType.size', '==', this.size));
    } else {
      this.templates = this.firestore.colWithIds$('templates');
    }
  }

  select(template) {
    this.selectEvent.emit(template);
  }

}
