import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  product: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.take(1).subscribe((queryParamMap: any) => {
      const queryProduct = queryParamMap.params['product'];
      if (queryProduct) {
        this.product = queryProduct;
      }
    });
  }

}
