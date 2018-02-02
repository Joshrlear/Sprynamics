import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrollService } from '../core/scroll.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  product: string;

  constructor(private route: ActivatedRoute, private scroll: ScrollService) { }

  ngOnInit() {
    this.route.queryParamMap.take(1).subscribe((queryParamMap: any) => {
      const queryProduct = queryParamMap.params['product'];
      if (queryProduct) {
        this.product = queryProduct;
        this.scroll.scrollToTop();
      }
    });
  }

  scrollUp() {
    this.scroll.scrollToTop();
  }

}
