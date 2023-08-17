import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
// route guard
import { AuthGuard } from './shared/guard/auth.guard';
import { InventoryComponent } from './inventory/inventory.component';
import { WasteTrackingComponent } from './waste-tracking/waste-tracking.component';
import { DonationComponent } from './donation/donation.component';
import { DonatedListComponent } from './donated-list/donated-list.component';
import { NGODashboardComponent } from './ngodashboard/ngodashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path:'home', component:HomeComponent},
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dash', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'ngodashboard', component: NGODashboardComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'wastagetracking', component: WasteTrackingComponent },
  { path: 'Donation', component: DonationComponent },
  { path: 'Donationlist', component: DonatedListComponent },


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}