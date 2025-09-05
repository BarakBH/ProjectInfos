import { Component } from '@angular/core';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  user: LoginResponse['personalDetails'] | null;

  constructor(private auth: AuthService) {
    this.user = this.auth.getPersonalDetails();
  }
}