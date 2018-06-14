import { Component, OnInit } from '@angular/core'
import { StorageService } from '#core/storage.service'
import { PapaParseService } from 'ngx-papaparse'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(
    private storage: StorageService,
    private papa: PapaParseService
  ) {}

  ngOnInit() {}

  uploadPricing(file: File) {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      this.papa.parse(reader.result, {
        complete: (results, file) => {
          const rawData = results.data
          const pricing = {
            postcard: [],
            flyer: [],
            doorhanger: []
          }
          rawData.forEach((row, i) => {
            // skip the first row (headers)
            if (i === 0) {
              return
            }
            const qty = row[0]
            const postcardPrice = row[1]
            const flyerPrice = row[2]
            const doorhangerPrice = row[3]
            pricing.postcard.push(postcardPrice)
            pricing.flyer.push(flyerPrice)
            pricing.doorhanger.push(doorhangerPrice)
          })
          // upload the parsed pricing data to storage
          this.storage.putPrettyJSON(pricing, 'pricing.json')
        }
      })
    }
    reader.readAsText(file)
  }
}
