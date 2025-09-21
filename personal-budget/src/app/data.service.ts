import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataSource = new BehaviorSubject<any>({
    datasets: [
      {
        data: [],
        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']
      }
    ],
    labels: []
  });

  data$ = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  loadBudgetData(): void {
    const currentValue = this.dataSource.getValue();
    if (currentValue.labels.length > 0 && currentValue.datasets[0].data.length > 0) {
      return; // Already have data, no need to call backend again
    }

    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        const updated = {
          datasets: [
            {
              data: res.myBudget.map((item: any) => item.budget),
              backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']
            }
          ],
          labels: res.myBudget.map((item: any) => item.title)
        };
        this.dataSource.next(updated);
      });
  }
}
