import {DataService} from "./data.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {SchedulerComponent} from "./scheduler.component";
import {DayPilotModule} from "daypilot-pro-angular";
import {HttpClientModule} from "@angular/common/http";
import {DraggableDirective} from "./draggable.directive";
import {MenuDirective} from "./menu.directive";
import {TaskCreateComponent} from "./task-create.component";
import {TaskScheduledEditComponent} from "./task-scheduled-edit.component";
import {TaskQueueEditComponent} from "./task-queue-edit.component";

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DayPilotModule
  ],
  declarations: [
    SchedulerComponent,
    DraggableDirective,
    MenuDirective,
    TaskCreateComponent,
    TaskQueueEditComponent,
    TaskScheduledEditComponent
  ],
  exports:      [ SchedulerComponent ],
  providers:    [ DataService ]
})
export class SchedulerModule { }
