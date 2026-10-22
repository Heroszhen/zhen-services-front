import { Routes } from '@angular/router';

import { FileViewerComponent } from './pages/file-viewer/file-viewer.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { VideoPlayerComponent } from './pages/video-player/video-player.component';

export const routes: Routes = [
  { path: 'file-view', component: FileViewerComponent },
  { path: 'video-player', component: VideoPlayerComponent },
  { path: '**', component: NotFoundComponent },
];
