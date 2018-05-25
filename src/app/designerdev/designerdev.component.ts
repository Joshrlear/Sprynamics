import { Component, OnInit } from '@angular/core'
import { User } from '#models/user.interface'
import { DesignState } from '#models/design-state.interface'
import { AuthService } from '#core/auth.service'

import { first } from 'rxjs/operators'
import { CheckoutService } from '#app/checkout/checkout.service'
import { FirestoreService } from '#core/firestore.service'

@Component({
  selector: 'app-designerdev',
  templateUrl: './designerdev.component.html',
  styleUrls: ['./designerdev.component.scss']
})
export class DesignerdevComponent implements OnInit {
  designState: DesignState
  agents: User[]
  user: User
  selectedAgent: User
  loading = true
  selectedListing: any
  listingId: string

  constructor(private auth: AuthService, private checkout: CheckoutService, private firestore: FirestoreService) {}

  async ngOnInit() {
    try {
      this.designState = {}
      /* load user */
      const user = await this.auth.user.pipe(first()).toPromise()
      console.log(user)
      this.user = user
      /* set up design state */
      this.designState.agent = user
      this.designState.brandColors = user.brandColors || { primary: '#ffffffff', secondary: '#ffffffff', accent: '#ffffffff' }
      /* load agents */
      const managedAgents = await this.firestore.promiseColWithIds<User>('users', ref => ref.where(`managers.${user.uid}`, '==', true))
      const createdAgents = await this.firestore.promiseColWithIds<User>(`users/${user.uid}/agents`)
      this.agents = managedAgents.concat(createdAgents)
      this.selectedAgent = user
      /* initialize order */
      await this.checkout.initOrder()
      this.loading = false
    } catch (err) {
      window.alert(err.message)
      console.error(err)
    }
  }

  changeAgent(agent: User) {
    this.selectedAgent = agent
    this.checkout.setUser(agent)
  }
}
