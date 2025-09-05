import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InfoComponent } from './components/info/info.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'info', component: InfoComponent }, 
  { path: '**', redirectTo: '' } // -> wildcard for all other urls
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
