import { Component, Input, OnInit } from '@angular/core';
import { PriceListItem } from '../model/offer.model';

@Component({
  selector: 'app-price-list-table',
  templateUrl: './price-list-table.component.html',
  styleUrls: ['./price-list-table.component.scss']
})
export class PriceListTableComponent implements OnInit {
  @Input() items: PriceListItem[] = [];
  displayedColumns: string[] = ['index', 'name', 'price', 'discountPrice', 'edit'];

  dataSource: PriceListItem[] = [];

  ngOnInit(): void {
    this.dataSource = this.items;
  }

  ngOnChanges(): void {
    this.dataSource = this.items;
  }

  edit(item: PriceListItem): void {
    console.log('Editing:', item);
  }
}
