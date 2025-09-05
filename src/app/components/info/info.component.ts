import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html'
})
export class InfoComponent {

  user = this.auth.getPersonalDetails();

  constructor(private auth: AuthService) {}
}
