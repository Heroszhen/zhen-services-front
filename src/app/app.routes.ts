import { Routes } from '@angular/router';

import { FileViewerComponent } from './pages/file-viewer/file-viewer.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ZtabComponent } from './pages/ztab/ztab.component';

export const routes: Routes = [
    {path: 'ztab', component: ZtabComponent},
    {path: 'file-view', component: FileViewerComponent},
    {path: '**', component: NotFoundComponent},
];
