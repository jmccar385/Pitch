import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { Band, Venue, HeaderValues } from '../models';
import { HeaderService } from '../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(
    private headerSvc: HeaderService
  ) {}

  headerVals: HeaderValues;

  async ngOnInit() {
    this.headerSvc.vals.subscribe(vals => {
      this.headerVals = vals;
    });
  }
}
