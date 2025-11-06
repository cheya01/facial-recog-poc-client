import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  registrationForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showWebcam = false;
  stream: MediaStream | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      scheduledAt: ['', [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.registrationForm.patchValue({ image: this.selectedFile });
      this.registrationForm.get('image')?.updateValueAndValidity();

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;

      // Prepare form data
      const formData = new FormData();
      formData.append('fullName', this.registrationForm.value.fullName);
      formData.append('email', this.registrationForm.value.email);
      formData.append('phone', this.registrationForm.value.phone);
      formData.append('scheduledAt', this.registrationForm.value.scheduledAt);
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Submit to API
      this.http.post(`${environment.apiUrl}/api/visitors`, formData)
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            this.isLoading = false;
            this.showToastMessage('Registration successful!', 'success');
            
            // Reset form after successful submission
            this.registrationForm.reset();
            this.imagePreview = null;
            this.selectedFile = null;
          },
          error: (error) => {
            console.error('Registration failed:', error);
            this.isLoading = false;
            this.showToastMessage('Registration failed. Please try again.', 'error');
          }
        });
    } else {
      console.log('Form is invalid');
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control?.invalid) {
          console.log(`${key} is invalid:`, control.errors);
        }
      });
    }
  }

  showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  async startWebcam(): Promise<void> {
    try {
      this.showWebcam = true;
      
      // Detect if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Configure camera constraints for mobile and desktop
      const constraints: MediaStreamConstraints = {
        video: isMobile 
          ? { 
              facingMode: 'user', // Front camera on mobile
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          : { 
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
      };
      
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Wait for view to update
      setTimeout(() => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
          // Play video explicitly for iOS
          this.videoElement.nativeElement.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      this.showToastMessage('Could not access webcam. Please check permissions.', 'error');
      this.showWebcam = false;
    }
  }

  capturePhoto(): void {
    if (this.videoElement && this.canvasElement) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob and create file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'webcam-photo.jpg', { type: 'image/jpeg' });
            this.selectedFile = file;
            this.imagePreview = canvas.toDataURL('image/jpeg');
            this.registrationForm.patchValue({ image: file });
            this.registrationForm.get('image')?.updateValueAndValidity();
            
            // Stop webcam and close modal
            this.closeWebcam();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }

  closeWebcam(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.showWebcam = false;
  }

  ngOnDestroy(): void {
    this.closeWebcam();
  }

  get fullName() {
    return this.registrationForm.get('fullName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get phone() {
    return this.registrationForm.get('phone');
  }

  get scheduledAt() {
    return this.registrationForm.get('scheduledAt');
  }

  get image() {
    return this.registrationForm.get('image');
  }
}
