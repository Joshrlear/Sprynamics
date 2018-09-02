import { Component, OnInit, AfterViewInit } from '@angular/core'
import { FirestoreService } from '#core/firestore.service';

declare const $

@Component({
  selector: 'app-email-builder',
  templateUrl: './email-builder.component.html',
  styleUrls: ['./email-builder.component.scss']
})
export class EmailBuilderComponent implements OnInit, AfterViewInit {
  constructor(private firestore: FirestoreService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    let _templateListItems

    const emailBuilder = $('.bal-editor-demo').emailBuilder({
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
      showCollapseMenu: true,
      showBlankPageButton: true,
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
        const html = emailBuilder.getContentHtml()
        const name = window.prompt("Enter a name for your design")
        this.firestore.col('email-designs').add({
          name,
          html
        })

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
        const name = window.prompt("Enter design name to load")
        this.firestore.col$<any>(`email-designs`, ref => ref.where("name", "==", name)).take(1).subscribe(designs => {
          $('.template-list').html(designs[0].html)
        })
      },
      onSettingsSendMailButtonClick: (e) => {
        console.log('onSettingsSendMailButtonClick html')
        //e.preventDefault();
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

    emailBuilder.setAfterLoad((e) => {
      console.log('onAfterLoad html')
    })

    console.log(emailBuilder.getContentHtml())
  }
}
