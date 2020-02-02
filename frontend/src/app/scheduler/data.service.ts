import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {DayPilot} from "daypilot-pro-angular";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DataService {

  resources: any[] = [
    { name: "Group A", id: "GA", expanded: true, children: [
      { name: "Resource 1", id: "R1"},
      { name: "Resource 2", id: "R2"}
    ]},
    { name: "Group B", id: "GB", expanded: true, children: [
      { name: "Resource 3", id: "R3"},
      { name: "Resource 4", id: "R4"}
    ]}
  ];

  durations: any[] = [
    { id: 60, name: "1 hour"},
    { id: 90, name: "1.5 hours"},
    { id: 120, name: "2 hours"},
    { id: 150, name: "2.5 hours"},
    { id: 180, name: "3 hours"},
    { id: 210, name: "3.5 hours"},
    { id: 240, name: "4 hours"},
    { id: 270, name: "4.5 hours"},
    { id: 300, name: "5 hours"},
    { id: 330, name: "5.5 hours"},
    { id: 360, name: "6 hours"},
    { id: 390, name: "6.5 hours"},
    { id: 420, name: "7 hours"},
    { id: 450, name: "7.5 hours"},
    { id: 480, name: "8 hours"},
  ];

  events: any[] = [];

  constructor(private http : HttpClient){
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {
    return this.http.get<any[]>("/api/backend_events.php?from=" + from.toString() + "&to=" + to.toString());
  }

  getResources(): Observable<any[]> {
    return this.http.get<any[]>("/api/backend_resources.php");
  }

  getEventsQueue(): Observable<any[]> {
    return this.http.get<any[]>("/api/backend_queue.php");
  }

  createTaskInQueue(params: any): any {
    return this.http.post("/api/backend_create_unscheduled.php", params);
  }

  createTask(params: any): any {
    return this.http.post("/api/backend_create.php", params);
  }

  moveEvent(params: any) {
    return this.http.post("/api/backend_move.php", params);
  }

  deleteEvent(params: any) {
    return this.http.post("/api/backend_delete.php", params);
  }

  updateTaskQueue(params: any) {
    return this.http.post("/api/backend_update_queue.php", params);
  }

  moveToQueue(params: {id: string}) {
    return this.http.post("/api/backend_move_to_queue.php", params);
  }

  getResourcesFlat() {
    return this.http.get<any[]>("/api/backend_resources_flat.php");
  }
}

export interface TaskCreateParams  {
  text: string;
  duration: number;
};


export interface TaskUpdateParams {
  id: string;
  start: DayPilot.Date;
  end: DayPilot.Date;
  resource: string;
  text: string;
  duration: string;
}
