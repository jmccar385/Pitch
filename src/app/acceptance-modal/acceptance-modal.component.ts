import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-acceptance-modal',
  templateUrl: './acceptance-modal.component.html',
  styleUrls: ['./acceptance-modal.component.css']
})
export class AcceptanceModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AcceptanceModalComponent>
  ) { }

  ngOnInit() {
  }

}
