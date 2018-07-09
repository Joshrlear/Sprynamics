import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import { AdminComponent } from "./admin.component"
import { PricesComponent } from "./prices/prices.component"
import { UsersComponent } from "./users/users.component"

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'prices', pathMatch: 'full' },
      { path: "prices", component: PricesComponent }, 
      { path: "users", component: UsersComponent }
    ]
  }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [AdminComponent, PricesComponent, UsersComponent]
})
export class AdminModule {}
