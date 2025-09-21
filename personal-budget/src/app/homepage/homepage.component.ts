import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  @ViewChild('myChart', { static: false }) myChart!: ElementRef;

  public dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']
      }
    ],
    labels: []
  };

  constructor(private http: HttpClient) {
    Chart.register(...registerables); // register Chart.js components
  }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        res.myBudget.forEach((item: any, index: number) => {
          this.dataSource.datasets[0].data[index] = item.budget;
          this.dataSource.labels[index] = item.title;
        });

        this.createChart();
      });
  }

  createChart() {
    const ctx = this.myChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource
    });
  }
}
