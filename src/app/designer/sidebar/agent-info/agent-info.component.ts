import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from '#core/auth.service';
import { Observable } from 'rxjs';
import { FirestoreService } from '#core/firestore.service';
import { User } from '#core/user.interface';

@Component({
  selector: 'app-agent-info',
  templateUrl: './agent-info.component.html',
  styleUrls: ['./agent-info.component.scss']
})
export class AgentInfoComponent implements OnInit {

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
