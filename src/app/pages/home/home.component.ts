import { Component, OnInit } from '@angular/core';
import { LoadingScreenService } from 'src/app/services/loading-screen.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private loadingScreenService: LoadingScreenService) {}

  ngOnInit() {
    this.loadingScreenService.startLoading();
    // Simulate a long-running task
    setTimeout(() => {
      this.loadingScreenService.stopLoading();
    }, 5000);
  }
}