import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from '#core/auth.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '#core/firestore.service';
import { User } from '#models/user.model';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  @Output('changeAgent') changeAgentEvent = new EventEmitter();

  @Input('user') user: User;

  @Input('loading') loading: boolean;
  @Input('agents') agents: any[];
  @Input('selectedAgent') selectedAgent: any;

  constructor(private auth: AuthService, private firestore: FirestoreService) { }

  ngOnInit() {
  }

  onChangeAgent() {
    this.changeAgentEvent.emit(this.selectedAgent);
  }

}
