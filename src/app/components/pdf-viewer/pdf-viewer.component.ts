import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent implements AfterViewInit {
  @Input() fileUrl!:string;
  @ViewChild('pdfViewerContainer', { static: true }) container!:ElementRef<HTMLDivElement>;

  async ngAfterViewInit() {
    const { default: EmbedPDF } = await import('@embedpdf/snippet');

    const instance = EmbedPDF.init({
      type: 'container',
      target: this.container.nativeElement,
      src: this.fileUrl,
      theme: { preference: 'dark' },
    });
  }
}
