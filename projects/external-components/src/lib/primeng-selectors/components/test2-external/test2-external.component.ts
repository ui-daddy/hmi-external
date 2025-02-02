import { Component, OnInit } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';
import { GanttComponent } from '@syncfusion/ej2-angular-gantt';

@Component({
  selector: 'app-test2',
  template: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center;">Gantt Chart for Project Management</h1>
      <ejs-gantt [dataSource]="tasks" [taskFields]="taskSettings" style="height: 400px;"></ejs-gantt>
    </div>
  `,
  styles: []
})
export class Test2Component extends CommonExternalComponent implements OnInit {
  public tasks: Object[] = [];
  public taskSettings: Object = {
    id: 'id',
    name: 'name',
    startDate: 'start',
    endDate: 'end',
    progress: 'progress'
  };

  ngOnInit() {
    this.tasks = [
      { id: 1, name: "Task 1", start: new Date(2025, 1, 1), end: new Date(2025, 1, 10), progress: 50 },
      { id: 2, name: "Task 2", start: new Date(2025, 1, 5), end: new Date(2025, 1, 15), progress: 30 }
    ];
  }
}