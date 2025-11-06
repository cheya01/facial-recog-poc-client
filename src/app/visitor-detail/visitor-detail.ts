import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-visitor-detail',
  imports: [CommonModule],
  templateUrl: './visitor-detail.html',
  styleUrl: './visitor-detail.css'
})
export class VisitorDetail implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  visitorId: string = '';
  imagePreview: string | null = null;
  capturedFile: File | null = null;
  showWebcam = false;
  stream: MediaStream | null = null;
  isVerifying = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.visitorId = this.route.snapshot.paramMap.get('id') || '';
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
            const file = new File([blob], 'verification-photo.jpg', { type: 'image/jpeg' });
            this.capturedFile = file;
            this.imagePreview = canvas.toDataURL('image/jpeg');
            
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showToastMessage('Please select an image file.', 'error');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.showToastMessage('Image size should be less than 5MB.', 'error');
        return;
      }

      this.capturedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  verifyVisitor(): void {
    if (!this.capturedFile || !this.visitorId) {
      this.showToastMessage('Please capture a photo first.', 'error');
      return;
    }

    this.isVerifying = true;

    const formData = new FormData();
    formData.append('id', this.visitorId);
    formData.append('image', this.capturedFile);

    this.http.post(`${environment.apiUrl}/api/visitors/verify`, formData)
      .subscribe({
        next: (response) => {
          console.log('Verification successful:', response);
          this.isVerifying = false;
          this.showToastMessage('Visitor verified successfully!', 'success');
          
          // Navigate back to verify page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/verify']);
          }, 2000);
        },
        error: (error) => {
          console.error('Verification failed:', error);
          this.isVerifying = false;
          this.showToastMessage('Verification failed. Please try again.', 'error');
        }
      });
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

  ngOnDestroy(): void {
    this.closeWebcam();
  }
}
