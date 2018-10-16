import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FirestoreService } from '#core/firestore.service';
import { AuthService } from '#core/auth.service';
import { MatDialog } from '@angular/material';
import { LoadTemplateDialogComponent } from '#shared/email-builder/load-template-dialog/load-template-dialog.component';

declare const $

@Component({
  selector: 'app-email-builder',
  templateUrl: './email-builder.component.html',
  styleUrls: ['./email-builder.component.scss']
})
export class EmailBuilderComponent implements OnInit, AfterViewInit {

  emailBuilder

  constructor(
    private auth: AuthService,
    private firestore: FirestoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    let _templateListItems

    this.emailBuilder = $('.bal-editor-demo').emailBuilder({
      lang: 'en',
      elementJsonUrl: 'assets/elements-1.json?e',
      langJsonUrl: 'assets/lang-1.json?ree',
      loading_color1: 'red',
      loading_color2: 'green',
      showLoading: true,

      blankPageHtmlUrl: '/assets/template-blank-page.html',
      loadPageHtmlUrl: '/assets/template-load-page.html',

      //left menu
      showElementsTab: true,
      showPropertyTab: true,
      showCollapseMenu: false,
      showBlankPageButton: false,
      showCollapseMenuinBottom: true,

      //setting items
      showSettingsBar: true,
      showSettingsPreview: false,
      showSettingsExport: true,
      showSettingsSendMail: true,
      showSettingsSave: true,
      showSettingsLoadTemplate: true,

      //show context menu
      showContextMenu: true,
      showContextMenu_FontFamily: true,
      showContextMenu_FontSize: true,
      showContextMenu_Bold: true,
      showContextMenu_Italic: true,
      showContextMenu_Underline: true,
      showContextMenu_Strikethrough: true,
      showContextMenu_Hyperlink: true,

      //show or hide elements actions
      showRowMoveButton: true,
      showRowRemoveButton: true,
      showRowDuplicateButton: true,
      showRowCodeEditorButton: true,
      onElementDragStart: (e) => {
        console.log('onElementDragStart html')
      },
      onElementDragFinished: (e, contentHtml) => {
        console.log('onElementDragFinished html')
        //console.log(contentHtml);
      },

      onBeforeRowRemoveButtonClick: (e) => {
        console.log('onBeforeRemoveButtonClick html')

        /*
                  if you want do not work code in plugin ,
                  you must use e.preventDefault();
                */
        //e.preventDefault();
      },
      onAfterRowRemoveButtonClick: (e) => {
        console.log('onAfterRemoveButtonClick html')
      },
      onBeforeRowDuplicateButtonClick: (e) => {
        console.log('onBeforeRowDuplicateButtonClick html')
        //e.preventDefault();
      },
      onAfterRowDuplicateButtonClick: (e) => {
        console.log('onAfterRowDuplicateButtonClick html')
      },
      onBeforeRowEditorButtonClick: (e) => {
        console.log('onBeforeRowEditorButtonClick html')
        //e.preventDefault();
      },
      onAfterRowEditorButtonClick: (e) => {
        console.log('onAfterRowDuplicateButtonClick html')
      },
      onBeforeShowingEditorPopup: (e) => {
        console.log('onBeforeShowingEditorPopup html')
        //e.preventDefault();
      },
      onBeforeSettingsSaveButtonClick: (e) => {
        console.log('onBeforeSaveButtonClick html')
        const html = this.emailBuilder.getContentHtml()
        const name = window.prompt("Enter a name for your design")
        this.firestore.col('email-designs').add({
          name,
          html
        })
        e.preventDefault()
      },
      onPopupUploadImageButtonClick: () => {
        console.log('onPopupUploadImageButtonClick html')
      },
      onSettingsPreviewButtonClick: (e, getHtml) => {
        console.log('onPreviewButtonClick html')
      },

      onSettingsExportButtonClick: (e, getHtml) => {
        console.log('onSettingsExportButtonClick html')

        //e.preventDefault();
      },
      onBeforeSettingsLoadTemplateButtonClick: (e) => {
        // $('.template-list').html('<div style="text-align:center">Loading...</div>')
        const dialogRef = this.dialog.open(LoadTemplateDialogComponent, {

        })
        dialogRef.afterClosed().subscribe(html => {
          if (html) {
            this.loadHtml(html)
          }
        })
        e.preventDefault()
      },
      onSettingsSendMailButtonClick: (e) => {
        console.log('onSettingsSendMailButtonClick html')
        e.preventDefault();
      },
      onPopupSendMailButtonClick: (e, _html) => {
        console.log('onPopupSendMailButtonClick html')
      },
      onBeforeChangeImageClick: (e) => {
        console.log('onBeforeChangeImageClick html')
      },
      onBeforePopupSelectTemplateButtonClick: (e) => {
        console.log('onBeforePopupSelectTemplateButtonClick html')
      },
      onBeforePopupSelectImageButtonClick: (e) => {
        console.log('onBeforePopupSelectImageButtonClick html')
      },
      onPopupSaveButtonClick: () => {
        console.log('onPopupSaveButtonClick html')
      }
    })

    this.emailBuilder.setAfterLoad((e) => {
      console.log('onAfterLoad html')
      this.auth._user.take(1).subscribe(user => {
        const autosaveDoc = this.firestore.doc(`autosave-email-builder/${user.uid}`)
        autosaveDoc.snapshotChanges().take(1).subscribe(doc => {
          const autosave: any = doc.payload.data()
          if (autosave && autosave.html) {
            console.log(autosave.html)
            this.loadHtml(autosave.html)
          } else {
            this.loadHtml('<table width="100%" cellspacing="0" cellpadding="0" border="0" style="background:rgb(233, 234, 234) none repeat scroll 0% 0% / auto padding-box border-box;"><tbody><tr><td><div style="margin:0 auto;width:600px;padding:0px"><table class="main mce-item-table" width="100%" cellspacing="0" cellpadding="0" border="0" data-types="background,padding" data-last-type="padding" style="width: 600px; border-spacing: 0px; border-collapse: collapse; text-size-adjust: 100%;"><tbody><tr><td align="left" class="element-content" style="background-color: rgb(255, 255, 255); padding: 10px 50px; border-collapse: collapse; text-size-adjust: 100%;" data-mce-style="background-color: #ffffff; padding: 10px 50px 10px 50px;"><table width="100%" cellspacing="0" cellpadding="0" border="0" class="mce-item-table" style="border-spacing: 0px; border-collapse: collapse; text-size-adjust: 100%;"><tbody><tr><td style="border-collapse: collapse; text-size-adjust: 100%;"><h1  style="font-weight: normal; text-align: center;" class="" data-mce-style="font-weight: normal; text-align: center;">Welcome to Builder</h1></td></tr><tr><td  align="center" class=" active" style="padding: 20px; border-collapse: collapse; text-size-adjust: 100%;" data-mce-style="padding: 20px;">Drag elements from left menu&nbsp;</td></tr></tbody></table></td></tr></tbody></table></div></td></tr></table>')
          }
        })
        // autosave every 5 seconds
        setInterval(async () => {
          try {
            const html = this.emailBuilder.getContentHtml()
            console.log(html)
            this.firestore.doc(`autosave-email-builder/${user.uid}`).set({
              html
            })
            console.log('autosaved')
          } catch (err) {
            console.error(err)
          }
        }, 5000)
      })
    })

    console.log(this.emailBuilder.getContentHtml())


  }

  loadHtml(html: string) {
    this.auth._user.take(1).subscribe(user => {
      html = html
        .replace(/{{firstname}}/g, user.firstName)
        .replace(/{{lastname}}/g, user.lastName)
        .replace(/{{address1}}/g, user.address1)
        .replace(/{{address2}}/g, user.address2)
      const contentText = $('<div/>').html(html).text();
      console.log(contentText)
      $('.bal-content-wrapper').html(html)
      this.emailBuilder.makeSortable()
    })
  }
}
