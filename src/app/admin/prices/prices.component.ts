import { Component, OnInit } from '@angular/core'
import { PapaParseService } from 'ngx-papaparse'
import { FirestoreService } from '#core/firestore.service';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {

  prices: any = {};

  constructor(
    private papa: PapaParseService,
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    this.getPricingData();
  }

  uploadPricing(file: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.papa.parse(reader.result, {
        complete: (results, file) => {
          const parsedData = results.data;
          const parsed = parsedData.reduce((acc, cur, i) => {
            if (i === 0) {
              return acc;
            }
            const qty = cur[0];
            const postcardPrice = cur[1];
            const flyerPrice = cur[2];
            const doorhangerPrice = cur[3];
            acc.postcard.push(postcardPrice);
            acc.flyer.push(flyerPrice);
            acc.doorhanger.push(doorhangerPrice);
            return acc
          }, {
            postcard: [],
            flyer: [],
            doorhanger: []
          });
          // upload the parsed pricing data as document to firestore
          this.firestore.set(`_var/pricing`, parsed);
        }
      })
    };
    reader.readAsText(file)
  }

  getPricingData() {
    this.firestore.doc$(`_var/pricing`).subscribe((data) => {
      if (data) {
        this.prices = data;
      }
    });
  }
}
