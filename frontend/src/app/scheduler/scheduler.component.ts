import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {DayPilot, DayPilotSchedulerComponent} from "daypilot-pro-angular";
import {DataService} from "./data.service";
import {TaskCreateComponent} from "./task-create.component";
import {TaskScheduledEditComponent} from "./task-scheduled-edit.component";
import {TaskQueueEditComponent} from "./task-queue-edit.component";

@Component({
  selector: 'scheduler-component',
  template: `
  <div class="wrapper">
    <div class="column-left">
      <div class="queue">
        <!--<div class="queue-title">Unscheduled Tasks</div>-->
        <button (click)="addToQueue()">Add Task</button>
        <div class="queue-list">
          <div 
          *ngFor="let item of unscheduled" 
          [draggableToScheduler]="{ text: item.text, externalHtml: item.text, duration: durationFromMinutes(item.duration), id: item.id }" 
          [menu]="{source: item, menu: queueMenu }" 
          (click)="queueEdit(item)"
          class="queue-item">
            {{item.text}}<br/>
            <span class="task-duration">{{formatDuration(item.duration)}}</span>
          </div>
          <div *ngIf="unscheduled.length === 0">No tasks in queue</div>
        </div>
      </div>
    </div>
    <div class="column-right">
      <daypilot-scheduler [config]="config" [events]="events" #scheduler></daypilot-scheduler>
    </div>
  </div>
  <task-create-dialog #create></task-create-dialog>
  <task-queue-edit-dialog #editQueue></task-queue-edit-dialog>
  <task-scheduled-edit-dialog #editScheduled></task-scheduled-edit-dialog>
  `,
  // encapsulation: ViewEncapsulation.None,
  styles: [`
  .wrapper {
    margin-top: 10px;
  }
  .column-left {
    float:left; width: 150px;
  }
  .column-right {
    margin-left: 160px;
  }
  .queue-title {
    padding: 3px 0;
  }
  .queue-list {
    /*border: 1px solid #ccc;*/
    /*padding: 2px;*/
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .queue-item {
    cursor: move;
    box-sizing: border-box;
    /*padding: 8px 0 10px 8px;*/
    border: 1px solid #ccc;
    margin-bottom: 2px;
    position: relative;
    height: 40px;
    padding: 2px 0 10px 8px;
    
    background: linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(238, 238, 238));
  }
  .queue-item::after {
    content: '';
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    width: 4px;
    /*background-color: #666;*/
    background-color: #1066a8;
  }

  .queue button {
    display: block;
    width: 100%;
    margin-bottom: 5px;
    /*background-color: #f3f3f3;*/
    background-color: #3c78d8;
    color: white;
    /*border: 1px solid #ccc;*/
    border: 0;
    padding: .5rem 1rem;
    font-size: 14px;
    cursor: pointer;
  }
  `]
})
export class SchedulerComponent implements AfterViewInit {

  @ViewChild("scheduler", {static: false}) scheduler: DayPilotSchedulerComponent;
  @ViewChild("create", {static: false}) create: TaskCreateComponent;
  @ViewChild("editQueue", {static: false}) editQueue: TaskQueueEditComponent;
  @ViewChild("editScheduled", {static: false}) editScheduled: TaskScheduledEditComponent;

  unscheduled: any[] = [];

  events: any[] = [];

  queueMenu: DayPilot.Menu = new DayPilot.Menu({
    items: [
      {
        text: "Edit...",
        onClick: args => {
          this.queueEdit(args.source);
        }
      },
      {
        text: "-",
      },
      {
        text: "Delete",
        onClick: args => {
          this.deleteTaskFromQueue(args.source);
        }
      },
    ]
  });

  config: any = {
    eventHeight: 40,
    cellWidthSpec: "Fixed",
    cellWidth: 60,
    timeHeaders: [{"groupBy":"Day"},{"groupBy":"Hour"}],
    scale: "CellDuration",
    cellDuration: 30,
    showNonBusiness: false,
    treePreventParentUsage: true,
    days: DayPilot.Date.today().daysInMonth(),
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    timeRangeSelectedHandling: "Enabled",
    treeEnabled: true,
    onBeforeEventRender: args => {
      args.data.backColor = args.data.color;
      args.data.html = "<div>" + args.data.text + "<br><span class='task-duration'>" + new DayPilot.Duration(args.data.start, args.data.end).totalHours() + " hours</span></div>";
      args.data.areas = [
        { top: 5, right: 3, height: 12, icon: "icon-triangle-down", visibility: "Hover", action: "ContextMenu", style: "font-size: 12px; background-color: rgba(255, 255, 255, .5); border: 1px solid #aaa; padding: 3px; cursor:pointer;" }
      ];
    },
    onBeforeCellRender: args => {
        if (args.cell.isParent) {
          args.cell.backColor = "#eee";
        }
    },
    onTimeRangeSelected: args => {
      DayPilot.Modal.prompt("Create a new task:", "Task 1").then(modal => {
          let dp:DayPilot.Scheduler = args.control;
          dp.clearSelection();
          if (!modal.result) { return; }

          let params = {
            text: modal.result,
            start: args.start,
            end: args.end,
            resource: args.resource
          };

          this.ds.createTask(params).subscribe(result => {
            dp.events.add(new DayPilot.Event(result));
          });

      });
    },
    onEventClick: args => {
        this.editScheduled.show(args.e.data).subscribe(result => {
            if (!result) {
              return; // cancelled
            }
        });
    },
    onEventMove: args => {

      let params = {
          id: args.e.id(),
          start: args.newStart,
          end: args.newEnd,
          resource: args.newResource
      };
      this.ds.moveEvent(params).subscribe(result => {
        //console.log(args);
        if (args.external) {
          //noinspection TypeScriptUnresolvedFunction
          let i = this.unscheduled.findIndex(i => i.id === args.e.id());
          if (i > -1) {
            this.unscheduled.splice(i, 1);
          }
        }
      });
    },
    onEventResize: args => {
      let params = {
        id: args.e.id(),
        start: args.newStart,
        end: args.newEnd,
        resource: args.e.resource()
      };
      this.ds.moveEvent(params).subscribe(result => {

      });
    },
    onEventResizing: args => {
      let duration = new DayPilot.Duration(args.start, args.end);
      if (duration.totalHours() > 8) {
        args.allowed = false;
      }
    },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Edit...",
          onClick: args => {
            this.scheduler.control.onEventClick({e: args.source});
          }
        },
        {
          text: "-",
        },
        {
          text: "Unschedule",
          onClick: args => {
            var e = args.source;
            this.unscheduleTask(e);
          }
        },
        {
          text: "-",
        },
        {
          text: "Delete",
          onClick: args => {
            var e = args.source;
            this.deleteTask(e);
          }
        },
      ],
    })
  };

  constructor(private ds: DataService) {
  }

  ngAfterViewInit(): void {
    this.ds.getResources().subscribe(result => this.config.resources = result);

    let from = this.scheduler.control.visibleStart();
    let to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });

    // this.ds.getEventsQueue().subscribe(result => this.unscheduled = result.map(i => { i.duration = DayPilot.Duration.hours(i.duration || 1); return i; }));
    this.ds.getEventsQueue().subscribe(result => this.unscheduled = result);
  }

  addToQueue(): void {

    this.create.show({}).subscribe(result => {
      if (!result) {  // canceled
        return;
      }
      let params = {
        text: result.text,
        duration: result.duration
      };
      this.ds.createTaskInQueue(params).subscribe(result => {
        this.unscheduled.push(result);
      });
    });


/*
    DayPilot.Modal.prompt("Text:").then(args => {
      if (args.result) {
        let params = {
          text: args.result
        };
        this.ds.createTaskInQueue(params).subscribe(result => {
          this.unscheduled.push(result);
        });
      }
    });
*/
  }

  deleteTask(e: DayPilot.Event): void {
    let dp = this.scheduler.control;
    var params = {
      id: e.id()
    };
    this.ds.deleteEvent(params).subscribe(result => {
      dp.events.remove(e);
    });

  }

  deleteTaskFromQueue(item: any): void {
    let dp = this.scheduler.control;
    var params = {
      id: item.id
    };
    this.ds.deleteEvent(params).subscribe(result => {
      //noinspection TypeScriptUnresolvedFunction
      let i = this.unscheduled.findIndex(i => i === item);
      if (i > -1) {
        this.unscheduled.splice(i, 1);
      }

    });

  }

  unscheduleTask(e: DayPilot.Event): void {
    let dp = this.scheduler.control;
    let params = {
      id: e.id(),
      start: null,
      end: null,
      resource: null
    };
    this.ds.moveToQueue(params).subscribe(result => {
      this.unscheduled.push(result);
      dp.events.remove(e);
    });

  }

  queueEdit(data: any): void {
    this.editQueue.show(data).subscribe(result => {
      if (!result) {
        return; // cancelled
      }

      this.ds.updateTaskQueue(result).subscribe(result => {
        //noinspection TypeScriptUnresolvedFunction
        let i = this.unscheduled.findIndex(i => i === data);
        if (i > -1) {
          this.unscheduled[i] = result;
        }
      });

    });
  }

  formatDuration(minutes: number): string {
    let duration = DayPilot.Duration.minutes(minutes);
    let result = duration.hours() + "h ";

    if (duration.minutes() > 0) {
      result += duration.minutes() + "m";
    }

    return result;
  }

  durationFromMinutes(minutes: number) : DayPilot.Duration {
    return DayPilot.Duration.minutes(minutes);
  }


}

