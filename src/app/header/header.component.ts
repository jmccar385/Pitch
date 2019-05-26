import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HeaderValues } from '../models';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() startClick = new EventEmitter<string>();
  @Output() endClick = new EventEmitter<string>();
  constructor(
    private headerSvc: HeaderService
  ) {}

  headerVals: HeaderValues;

  functionCall(slot: string) {
    if (slot === 'start') {
      this.startClick.emit(slot);
    } else {
      this.endClick.emit(slot);
    }
  }

  async ngOnInit() {
    this.headerSvc.vals.subscribe(vals => {
      this.headerVals = vals;
    });
  }
}
