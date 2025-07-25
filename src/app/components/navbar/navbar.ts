import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  /**
   * Handles the change event from the role selector dropdown.
   * Navigates to the corresponding route based on the selected role.
   * @param event The DOM event from the select element.
   */
  handleRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const role = selectElement.value;

    if (role === 'admin') {
      // Navigate to the dashboard page for the admin view
      this.router.navigate(['/dashboard']);
    } else {
      // Navigate to the home page for the user view
      this.router.navigate(['/home']);
    }
  }
}