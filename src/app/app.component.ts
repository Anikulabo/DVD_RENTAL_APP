import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RepositorySanityTesterService } from './core/services/repository-sanity-tester-service';

@Component({
  selector: 'app-root',
  standalone: true, // 🔥 THIS IS MISSING
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'practice';
constructor(testRepo: RepositorySanityTesterService) {
    console.log('--- Running repository sanity tests ---');
    testRepo.runtest();
    console.log('--- Repository sanity tests completed ---');
}
}
