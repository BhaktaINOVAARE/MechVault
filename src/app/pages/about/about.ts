import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  position: string;
  image: string;
}

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Ethan Harper',
      position: 'CEO',
      image: 'assets/images/ethan-harper.jpg'
    },
    {
      name: 'Sophia Bennett',
      position: 'CTO',
      image: 'assets/images/sophia-bennett.jpg'
    },
    {
      name: 'Liam Carter',
      position: 'Head of Customer Success',
      image: 'assets/images/liam-carter.jpg'
    }
  ];

  constructor() { }
}
