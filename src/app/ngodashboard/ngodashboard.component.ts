import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-ngodashboard',
  templateUrl: './ngodashboard.component.html',
  styleUrls: ['./ngodashboard.component.scss']
})
export class NGODashboardComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
