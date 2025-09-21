import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import * as d3 from 'd3';


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
        this.createD3Chart();
      });
  }

  createChart() {
    const ctx = this.myChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource
    });
  }
  private createD3Chart(): void{
    const data = this.dataSource.datasets[0].data;
    const labels = this.dataSource.labels;
    const width = 400;
    const height = 200;

    const svg = d3.select('#d3Chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', 'translate(0,0)');

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('y', (d, i) => i * 30)
      .attr('x', 0)
      .attr('width', d => Number(d) * 8)
      .attr('height', 15)
      .attr('fill', (d, i) => this.dataSource.datasets[0].backgroundColor[i % this.dataSource.datasets[0].backgroundColor.length]);

    g.selectAll('.bar-label')
      .data(labels)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .text(d => d)
      .attr('x', 5)
      .attr('y', (d, i) => i * 30 + 12)
      .attr('text-anchor', 'start')
      .style('font-size', '12px')
      .style('fill', 'black');
  }
}
