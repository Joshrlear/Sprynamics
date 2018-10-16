import { FirestoreService } from "#core/firestore.service"
import { NavigationService } from "#core/navigation.service"
import { StateService } from "#core/state.service"
import { Component, HostBinding, HostListener, OnInit, ViewChild } from "@angular/core"
import { MatSidenav } from "@angular/material/sidenav"
import { Router } from "@angular/router"
import { AuthService } from "./core/auth.service"

declare const $

const sideNavView = "SideNav"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  @HostBinding("class") hostClasses = ""

  isFetching = false
  isStarting = true
  isTransitioning = true
  isSideBySide = false
  isSideNavDash = false

  private isFetchingTimeout: any
  private sideBySideWidth = 992

  @ViewChild(MatSidenav) sidenav: MatSidenav

  get isOpened() {
    return this.isSideBySide && this.ns.isSideNavDash
  }
  get mode() {
    return this.ns.isSideNavDash ? (this.isSideBySide ? "side" : "over") : "over"
  }

  constructor(
    public auth: AuthService,
    private ns: NavigationService,
    public router: Router,
    private firestore: FirestoreService,
    public state: StateService
  ) {}

  public logout() {
    this.auth.logout()
  }

  ngOnInit() {
    this.onResize(window.innerWidth)
    this.firestore.col$('agents').take(1).subscribe(agents => {
      const data = agents.reduce((acc, cur: any) => acc + `${cur.email},${cur.firstName},${cur.lastName},${cur.participantKey},${cur.phoneNumber},${cur.website}\n`, 'Email,FirstName,LastName,License,PhoneNumber,Website\n')
      console.log(data)
    })
  }

  @HostListener("window:resize", ["$event.target.innerWidth"])
  onResize(width: number) {
    this.isSideBySide = width > this.sideBySideWidth

    if (this.isSideBySide && !this.ns.isSideNavDash) {
      // If this is a non-sidenav doc and the screen is wide enough so that we can display menu
      // items in the top-bar, ensure the sidenav is closed.
      // (This condition can only be met when the resize event changes the value of `isSideBySide`
      //  from `false` to `true` while on a non-sidenav doc.)
      this.sideNavToggle(false)
    }
  }

  sideNavToggle(value?: boolean) {
    this.sidenav.toggle(value)
  }

  updateHostClasses() {
    const sideNavOpen = `sidenav-${this.sidenav.opened ? "open" : "closed"}`
    this.hostClasses = [sideNavOpen].join(" ")
  }

  updateSideNav() {
    // Preserve current sidenav open state by default.
    let openSideNav = this.sidenav.opened
    const isSideNavDash = !!this.ns.isSideNavDash

    if (this.ns.isSideNavDash !== isSideNavDash) {
      // View type changed. Is it now a sidenav view (e.g, guide or tutorial)?
      // Open if changed to a sidenav doc; close if changed to a marketing doc.
      openSideNav = this.ns.isSideNavDash = isSideNavDash
    }
    // May be open or closed when wide; always closed when narrow.
    this.sideNavToggle(this.isSideBySide && openSideNav)
  }

}
