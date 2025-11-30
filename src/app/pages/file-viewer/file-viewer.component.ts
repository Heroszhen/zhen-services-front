import { Component, OnInit, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MessageEventRequest, FileExtensionEnum } from '../../models/FileViewer';
import { environment } from '../../../environments/environment';
import { isEmpty } from '../../services/util';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [NgxDocViewerModule],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FileViewerComponent implements OnInit {
  filename?:string;
  url: string|null = null;
  readonly viewerUrlPrefix: string = "https://docs.google.com/gview?url="
  viewerUrl: string|null = null;
  extension: string|null = null;
  FileExtensionEnum = FileExtensionEnum;
  loading:boolean = true;

  ngOnInit(): void {
    console.log("Merci d'utiliser Zhen Service");
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
   if (!environment.fileViewerOrigins.includes(event.origin)) return;

    const request = event.data as MessageEventRequest;
    if (isEmpty(request.payload['extension']) || isEmpty(request.payload['url'])) {
      console.error("Extension or url is not found");
      return;
    }

    this.extension = request.payload.extension;
    this.url = request.payload.url;
  }

  handleDocLoaded() {
    this.loading = false;
  }
}
