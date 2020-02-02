import {Component, ViewChild} from "@angular/core";
import {DayPilot, DayPilotModalComponent} from "daypilot-pro-angular";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {Observable, AsyncSubject} from "rxjs";
import {DataService, TaskUpdateParams} from "./data.service";

@Component({
  selector: 'task-queue-edit-dialog',
  template: `
    <daypilot-modal>
    <div class="center">
      <h1>Edit Task</h1>
      <form [formGroup]="form">
        <div class="form-item">
          <input formControlName="text" type="text" placeholder="Task Name"> <span *ngIf="!form.controls.text.valid">Task name required</span>
        </div>
        <div class="form-item">
          Duration:
          <select formControlName="duration">
            <option *ngFor="let r of ds.durations" [ngValue]="r.id">{{r.name}}</option>
          </select>
        </div>
        <div class="form-item">
          <button (click)="submit()" [disabled]="!form.valid">Save</button>
          <button (click)="cancel()">Cancel</button>
        </div>
    </form>
    </div>
    </daypilot-modal>
  `,
  styles: [`
  .center {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  .form-item {
    margin: 4px 0px;
  }
  `]
})
export class TaskQueueEditComponent {
  @ViewChild(DayPilotModalComponent, {static: false}) modal : DayPilotModalComponent;

  form: FormGroup;
  // dateFormat = "MM/dd/yyyy h:mm tt";

  // resources: any[];

  task: any;

  subject: AsyncSubject<TaskUpdateParams>;

  constructor(private fb: FormBuilder, private _ds: DataService) {
    this.form = this.fb.group({
      text: ["", Validators.required],
      duration: ["", Validators.required],
    });
  }

  get ds() {
    return this._ds;
  }

  show(ev: any): Observable<TaskUpdateParams>  {
    // this.ds.getResources().subscribe(result => this.resources = result);

    console.log("showing");
    console.log(ev);

    this.task = ev;

    this.form.setValue({
      text: ev.text,
      duration: ev.duration
    });
    this.modal.show();

    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    let data = this.form.getRawValue();

    let params: TaskUpdateParams = {
      id: this.task.id,
      // start: DayPilot.Date.parse(data.start, this.dateFormat),
      // end: DayPilot.Date.parse(data.end, this.dateFormat),
      // resource: data.resource,
      start: null,
      end: null,
      resource: null,
      text: data.text,
      duration: data.duration
    };

    this.modal.hide();

    this.subject.next(params);
    this.subject.complete();

  }

  cancel() {
    this.modal.hide();

    this.subject.next(null);
    this.subject.complete();
  }

  dateTimeValidator(format: string) {
    return function(c:FormControl) {
      let valid = !!DayPilot.Date.parse(c.value, format);
      return valid ? null : {badDateTimeFormat: true};
    };
  }
}

