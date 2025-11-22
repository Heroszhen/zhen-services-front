import { Routes } from '@angular/router';

import { FileViewerComponent } from './pages/file-viewer/file-viewer.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    {path: 'file-view', component: FileViewerComponent},
    {path: '**', component: NotFoundComponent},
];
