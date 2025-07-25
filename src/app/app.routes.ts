import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent }
];
