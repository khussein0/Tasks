import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {DayPilot} from 'daypilot-pro-angular';

@Directive({ selector: '[menu]' })
export class MenuDirective implements AfterViewInit {

  @Input('menu') options: any;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    let element = this.el.nativeElement;
    let areas = [
      { top: 5, right: 3, height: 12, icon: "icon-triangle-down", visibility: "Hover", action: "ContextMenu", menu: this.options.menu, style: "font-size: 12px; background-color: rgba(255, 255, 255, .5); border: 1px solid #aaa; padding: 3px; cursor:pointer;" }
    ];
    let source = this.options.source;

    let daypilot = DayPilot as any;
    daypilot.Areas.attach(element, source, { areas: areas});

  }
}
