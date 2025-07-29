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
      image: '/person-1.jpg'
    },
    {
      name: 'Sophia Bennett',
      position: 'CTO',
      image: '/person-2.jpg'
    },
    {
      name: 'Liam Carter',
      position: 'Head of Customer Success',
      image: '/person-3.jpg'
    }
  ];

  constructor() { }
}
