import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-text',
  template: `
    <div class="form">
      <ng-container *ngFor="let field of formFields; let i = index">
        <div class="form-field">
          <label [for]="'field'+i">{{field.name}}
            <textarea [id]="'field'+i" class="form-control" type="text" [placeholder]="field.name" [(ngModel)]="field.obj.text" (input)="render()"
              (change)="onChange()"></textarea>
          </label>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .form {
      padding: 16px;
      color: white;
    }
  `]
})
export class TextComponent {
  @Input('formFields') formFields: any = []
  @Output('render') renderEvent = new EventEmitter()
  @Output('change') changeEvent = new EventEmitter()

  viewSide: string

  render() {
    this.renderEvent.emit(null)
  }

  onChange() {
    this.changeEvent.emit(null)
  }
}
