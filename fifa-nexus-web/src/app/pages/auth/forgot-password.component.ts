import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-deep-black px-6 pt-24">
      <div class="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent"></div>
        
        <div class="text-center mb-8">
          <h2 class="text-3xl font-black text-white uppercase tracking-wider mb-2">Reset Password</h2>
          <p class="text-gray-400 text-sm">Enter your email to receive a reset link</p>
        </div>

        <form (ngSubmit)="onSubmit()" #resetForm="ngForm" class="space-y-4">
          <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-sm text-sm text-center">
            {{ errorMessage }}
          </div>
          <div *ngIf="successMessage" class="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-sm text-sm text-center">
            {{ successMessage }}
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" required class="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-gold-accent transition-colors">
          </div>

          <button type="submit" [disabled]="!resetForm.form.valid || isLoading" class="w-full bg-gradient-to-r from-gold-accent to-yellow-600 text-deep-black font-bold uppercase tracking-wider py-3 rounded-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 mt-4">
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>

        <p class="text-center text-gray-400 text-sm mt-6">
          Remembered your password? <a routerLink="/" class="text-gold-accent hover:text-white font-bold transition-colors">Sign In</a>
        </p>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  async onSubmit() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      await this.authService.resetPassword(this.email);
      this.successMessage = 'Password reset email sent! Check your inbox.';
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}
