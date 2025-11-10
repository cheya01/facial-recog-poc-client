import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface Visitor {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  scheduledAt: string;
  image?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-verify-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-page.html',
  styleUrl: './verify-page.css'
})
export class VerifyPage {
  searchForm: FormGroup;
  visitors: Visitor[] = [];
  isLoading = false;
  hasSearched = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.searchForm = this.fb.group({
      date: ['', [Validators.required]]
    });

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    this.searchForm.patchValue({ date: today });
  }

  searchVisitors(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      this.hasSearched = true;
      const selectedDate = this.searchForm.value.date;

      this.http.get<Visitor[]>(`${environment.apiUrl}/api/visitors?date=${selectedDate}`)
        .subscribe({
          next: (response) => {
            console.log('Visitors fetched:', response);
            this.visitors = response;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching visitors:', error);
            this.visitors = [];
            this.isLoading = false;
          }
        });
    }
  }

  navigateToVerify(visitorId: string): void {
    this.router.navigate(['/verify', visitorId]);
  }

  get date() {
    return this.searchForm.get('date');
  }
}
