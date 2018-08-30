import { PrivacyPolicyComponent } from "#app/legal/privacy-policy/privacy-policy.component"
import { TermsAndConditionsComponent } from "#app/legal/terms-and-conditions/terms-and-conditions.component"
import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "./core/auth.guard"
import { AdminGuard } from "./core/admin.guard"
import { EmailBuilderComponent } from "#shared/email-builder/email-builder.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "profile",
    pathMatch: "full"
  },
  {
    path: "account",
    loadChildren: "app/account/account.module#AccountModule"
  },
  {
    path: "profile",
    loadChildren: "app/dashboard/dashboard.module#DashboardModule",
    canActivate: [AuthGuard]
  },
  {
    path: "admin",
    loadChildren: "app/admin/admin.module#AdminModule",
    canActivate: [AdminGuard]
  },
  {
    path: "designer",
    loadChildren: "app/designer/designer.module#DesignerModule"
  },
  {
    path: "email-builder",
    component: EmailBuilderComponent
  },
  { path: "terms", component: TermsAndConditionsComponent },
  { path: "privacy", component: PrivacyPolicyComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
