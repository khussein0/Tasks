import {Component, ViewChild} from "@angular/core";
import {DayPilot, DayPilotModalComponent} from "daypilot-pro-angular";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {Observable, AsyncSubject} from "rxjs";
import {DataService, TaskCreateParams} from "./data.service";

@Component({
  selector: 'task-create-dialog',
  template: `
    <daypilot-modal>
    <div class="center">
      <h1>Create Task</h1>
      <form [formGroup]="form">
        <div class="form-item">
          <input formControlName="text" type="text" placeholder="Task Name"> <span *ngIf="!form.controls.text.valid">Task name required</span>
        </div>
        <div class="form-item">
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
export class TaskCreateComponent {
  @ViewChild(DayPilotModalComponent, {static: false}) modal : DayPilotModalComponent;

  form: FormGroup;
  // dateFormat = "MM/dd/yyyy h:mm tt";

  resources: any[];

  subject: AsyncSubject<TaskCreateParams>;

  constructor(private fb: FormBuilder, public ds: DataService) {
    this.form = this.fb.group({
      text: ["", Validators.required],
      // start: ["", this.dateTimeValidator(this.dateFormat)],
      // end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
      duration: ["", Validators.required]
    });
  }

  show(args: any): Observable<TaskCreateParams> {
    this.ds.getResources().subscribe(result => this.resources = result);

    // args.name = "";
    this.form.setValue({
      text: "",
      duration: 60
    });
    this.modal.show();

    this.subject = new AsyncSubject();
    return this.subject.asObservable();
  }

  submit() {
    let data = this.form.getRawValue();

    let params: TaskCreateParams = {
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
