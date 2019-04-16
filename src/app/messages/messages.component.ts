import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  imageSrc = "https://scontent.fphl2-1.fna.fbcdn.net/v/t1.0-9/16196015_10154888128487744_6901111466535510271_n.png?_nc_cat=103&_nc_ht=scontent.fphl2-1.fna&oh=ee2b450ecab420965220c04897ab03da&oe=5D43E7E9";
  interlocutor = "Jon Snow";
  ngOnInit() {
    
  }

}
