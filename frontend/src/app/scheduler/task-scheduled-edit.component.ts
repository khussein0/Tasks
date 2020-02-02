import {Component, ViewChild} from "@angular/core";
import {DayPilot, DayPilotModalComponent} from "daypilot-pro-angular";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {Observable, AsyncSubject} from "rxjs";
import {DataService, TaskUpdateParams} from "./data.service";

@Component({
  selector: 'task-scheduled-edit-dialog',
  template: `
    <daypilot-modal>
    <div class="center">
      <h1>Edit Task</h1>
      <form [formGroup]="form">
        <div class="form-item">
          <input formControlName="text" type="text" placeholder="Task Name"> <span *ngIf="!form.controls.text.valid">Task name required</span>
        </div>
        <div class="form-item">
          Resource:
          <select formControlName="resource">
            <option *ngFor="let it of resources" [ngValue]="it.id">{{it.name}}</option>
          </select>
        </div>
        <div class="form-item">
          <input formControlName="start" type="text" placeholder="Start" readonly disabled> <span *ngIf="!form.controls.start.valid">Invalid datetime</span>
        </div>
        <div class="form-item">
          <input formControlName="end" type="text" placeholder="End" readonly disabled> <span *ngIf="!form.controls.end.valid">Invalid datetime</span>
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
export class TaskScheduledEditComponent {
  @ViewChild(DayPilotModalComponent, {static: false}) modal : DayPilotModalComponent;

  form: FormGroup;
  dateFormat = "MM/dd/yyyy h:mm tt";

  resources: any[];

  task: any;

  subject: AsyncSubject<TaskUpdateParams>;

  constructor(private fb: FormBuilder, private ds: DataService) {
    this.form = this.fb.group({
      text: ["", Validators.required],
      start: ["", this.dateTimeValidator(this.dateFormat)],
      end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
      resource: ["", Validators.required]
    });


  }

  show(ev: any): Observable<TaskUpdateParams>  {
    this.ds.getResourcesFlat().subscribe(result => this.resources = result);

    this.task = ev;

    this.form.setValue({
      start: new DayPilot.Date(ev.start).toString(this.dateFormat),
      end: new DayPilot.Date(ev.end).toString(this.dateFormat),
      text: ev.text,
      resource: ev.resource
    });

    this.modal.show();

    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    let data = this.form.getRawValue();

    let params: TaskUpdateParams = {
      id: this.task.id,
      start: DayPilot.Date.parse(data.start, this.dateFormat),
      end: DayPilot.Date.parse(data.end, this.dateFormat),
      resource: data.resource,
      text: data.text,
      duration: null
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

