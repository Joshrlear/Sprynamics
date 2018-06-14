import { Product } from '#app/models/product.model'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @Input('selectedProduct') selectedProduct: Product
  @Output('changeProduct') changeProductEvent = new EventEmitter<Product>()

  constructor() {}

  ngOnInit() {}

  changeProduct(product: Product) {
    this.changeProductEvent.emit(product)
  }
}
