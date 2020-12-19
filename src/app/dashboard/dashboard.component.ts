import { Component } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  tiles: Tile[] = [
    {text: 'Current Mandates', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Receivables', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Alerts', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Priorities', cols: 2, rows: 1, color: '#DDBDF1'},
  ];
}
