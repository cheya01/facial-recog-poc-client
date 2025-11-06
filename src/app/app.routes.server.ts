import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'verify/:id',
    renderMode: RenderMode.Client // Don't prerender dynamic routes
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
