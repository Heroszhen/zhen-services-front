import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VideoPayload, VideoTypeEnum } from '../../models/VideoPlayer';
import { SafePipe } from '../../pipes/safe.pipe';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [SafePipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  videoUrl: string | null = null;
  videoType: VideoTypeEnum | null = null;
  VideoTypeEnum = VideoTypeEnum;
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  private resizeObserver?: ResizeObserver;
  private parentOrigin: string | null = null;

  ngOnInit(): void {
    console.log("Merci d'utiliser Zhen Service - video player");
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.parentOrigin) {
        window.parent.postMessage(
          { type: 'RESIZE', payload: { videoHeight: this.container.nativeElement.clientHeight } },
          this.parentOrigin
        );
      }
    });
    this.resizeObserver.observe(this.container.nativeElement);
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (!environment.fileViewerOrigins.includes(event.origin)) return;

    this.parentOrigin = event.origin;

    const payload: VideoPayload = event.data.payload;

    this.videoType = Object.values(VideoTypeEnum).includes(payload.type.toLocaleLowerCase() as VideoTypeEnum)
      ? (payload.type.toLocaleLowerCase() as VideoTypeEnum)
      : null;

    if (this.videoType === null || !payload.url) return;

    this.videoUrl = payload.url;

    const tab: string[] = this.videoUrl.split('/');
    switch (this.videoType) {
      case VideoTypeEnum.YOUTUBE_SHORT: {
        this.videoUrl = 'https://youtube.com/embed/' + tab[tab.length - 1];
        break;
      }
      case VideoTypeEnum.DOUYIN: {
        this.videoUrl = `https://open.douyin.com/player/video?vid=${tab[tab.length - 1]}&autoplay=1`;
        break;
      }
      case VideoTypeEnum.TIKTOK: {
        this.videoUrl = `https://www.tiktok.com/player/v1/${tab[tab.length - 1]}`;
        break;
      }
      case VideoTypeEnum.INSTAGRAM: {
        setTimeout(() => window.instgrm?.Embeds.process());
        break;
      }
    }

    if (this.videoType === null || !this.videoUrl) return;
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
