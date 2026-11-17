import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  inject,
  Injector,
} from '@angular/core';
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
    twttr?: {
      widgets: {
        load(element?: HTMLElement | null): Promise<void>;
      };
    };
    FB?: {
      XFBML: {
        parse(element?: HTMLElement | null): void;
      };
    };
  }
}

type RedditResizeMessage = {
  type: 'resize.embed';
  data: number;
};

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
  videoWidth: number = 0;
  videoHeight: number = 0;
  needFullHeight?: boolean;
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  private resizeObserver?: ResizeObserver;
  private parentOrigin: string | null = null;
  private injector = inject(Injector);
  private videoPayload: VideoPayload | null = null;

  ngOnInit(): void {
    console.log("Merci d'utiliser Zhen Service - video player");
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => this.sendHeightToParent());
    this.resizeObserver.observe(this.container.nativeElement);
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (event.origin === 'https://embed.reddit.com') {
      try {
        if (typeof event.data === 'string') {
          const data: RedditResizeMessage = JSON.parse(event.data);
          this.videoHeight = data.data;
        }
      } catch (error) {
        console.error('Message Reddit invalide :', event.data, error);
      }
      return;
    }

    if (!environment.fileViewerOrigins.includes(event.origin)) return;

    this.parentOrigin = event.origin;

    if (event.data?.type === 'STOP') {
      if (this.videoUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(this.videoUrl);
      }
      this.videoUrl = null;
      this.videoType = null;
      return;
    }

    const payload: VideoPayload = event.data.payload;

    this.videoType = Object.values(VideoTypeEnum).includes(payload.type.toLocaleLowerCase() as VideoTypeEnum)
      ? (payload.type.toLocaleLowerCase() as VideoTypeEnum)
      : null;

    if (this.videoType === null || !payload.url) return;

    this.videoPayload = payload;
    this.videoHeight = payload.height;
    this.needFullHeight = payload.needFullHeight;

    if (this.videoUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.videoUrl);
    }

    this.videoUrl = payload.url;
    const tab: string[] = this.videoUrl.split('/');
    const videoId: string = tab[tab.length - 1] === '' ? tab[tab.length - 2] : tab[tab.length - 1];
    switch (this.videoType) {
      case VideoTypeEnum.INTEGRATION: {
        if (payload.needFullHeight) {
          this.setFullHeight('wrap-integration', payload.height);
        }
        break;
      }
      case VideoTypeEnum.MP4: {
        if (payload.needFullHeight) {
          this.videoHeight = payload.height;
        }

        if (payload.file instanceof File) {
          this.videoUrl = URL.createObjectURL(payload.file);
          setTimeout(() => this.sendHeightToParent());
        }
        break;
      }
      case VideoTypeEnum.YOUTUBE_SHORT: {
        this.videoUrl = 'https://youtube.com/embed/' + videoId;
        this.setVideoDimensions(payload.height, payload.maxWidth);
        break;
      }
      case VideoTypeEnum.DOUYIN: {
        this.videoUrl = `https://open.douyin.com/player/video?vid=${videoId}&autoplay=1`;
        break;
      }
      case VideoTypeEnum.TIKTOK: {
        this.videoUrl = `https://www.tiktok.com/player/v1/${videoId}`;
        this.setVideoDimensions(payload.height, payload.maxWidth);
        break;
      }
      case VideoTypeEnum.INSTAGRAM: {
        this.videoUrl = `https://www.instagram.com/reel/${videoId}/?utm_source=ig_embed&amp;utm_campaign=loading`;
        setTimeout(() => window.instgrm?.Embeds.process());
        break;
      }
      case VideoTypeEnum.DAILYMOTION: {
        this.videoUrl = `https://geo.dailymotion.com/player/x8lr5.html?video=${videoId}&amp`;
        if (payload.needFullHeight) {
          this.setFullHeight('wrap-dailymotion', payload.height);
        }
        break;
      }
      case VideoTypeEnum.REDDIT: {
        this.videoUrl = `${payload.url.replace('www', 'embed')}?embed=true`;
        break;
      }
      case VideoTypeEnum.TWITTER: {
        setTimeout(() => {
          window.twttr?.widgets?.load(document.getElementById('wrap-twitter'));
        });
        break;
      }
      case VideoTypeEnum.FACEBOOK: {
        this.videoWidth = payload.maxWidth ?? 360;
        afterNextRender(() => this.renderFacebook(this.videoWidth), { injector: this.injector });
        // this.videoUrl =
        //   'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(payload.url) + '&show_text=false';
        // this.setVideoDimensions(payload.height, payload.maxWidth);
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  setVideoDimensions(
    parentHeight: number,
    maxWidth?: number,
    heightPercentage: number = 0.95,
    aspectRatio: number = 9 / 16
  ) {
    this.videoHeight = Math.round(parentHeight * heightPercentage);
    let width = Math.round(this.videoHeight * aspectRatio);

    if (maxWidth) {
      const reelMaxWidth = maxWidth - 4;
      if (width > reelMaxWidth) {
        width = reelMaxWidth;
        this.videoHeight = Math.round(width / aspectRatio);
      }
    }

    this.videoWidth = width;
  }

  private renderFacebook(width: number): void {
    const wrap = this.container.nativeElement.querySelector('#wrap-facebook') as HTMLElement | null;
    if (!wrap) return;

    wrap.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'fb-video';
    div.dataset['href'] = this.videoUrl ?? '';
    div.dataset['width'] = String(Math.round(width));
    div.dataset['showText'] = 'false';
    wrap.appendChild(div);

    if (window.FB) {
      window.FB.XFBML.parse(wrap);
    } else {
      this.loadFacebookSdk();
    }
  }

  private loadFacebookSdk(): void {
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v21.0';
    document.body.appendChild(script);
  }

  private sendHeightToParent(): void {
    if (!this.parentOrigin) return;

    if (this.videoPayload?.height && this.videoPayload?.maxWidth) {
      const iframe = this.container.nativeElement.querySelector('iframe');
      const width = parseFloat(iframe?.style.width ?? '0');
      const height = parseFloat(iframe?.style.height ?? '0');
      if (this.videoType === VideoTypeEnum.FACEBOOK && (!width || !height)) return;

      if (iframe && (width > this.videoPayload.maxWidth || height > this.videoPayload.height)) {
        switch (this.videoType) {
          case VideoTypeEnum.FACEBOOK: {
            this.setVideoWidthByNewRatio(width / height, this.videoPayload.maxWidth, this.videoPayload.height);
            this.renderFacebook(this.videoWidth);
            return;
          }
        }
      }
    }

    window.parent.postMessage(
      { type: 'RESIZE', payload: { videoHeight: this.container.nativeElement.clientHeight } },
      this.parentOrigin
    );
  }

  /**
   *
   * @param ratio width/height
   * @param width
   * @param height
   */
  private setVideoWidthByNewRatio(ratio: number, width: number, height: number) {
    let newHeight = height - 5;
    let newWidth = width;

    do {
      --newHeight;
      newWidth = Math.round(newHeight * ratio);
    } while (newWidth > width);

    this.videoWidth = newWidth;
  }

  private setFullHeight(wrapId: string, height: number): void {
    afterNextRender(
      () => {
        const wrap = this.container.nativeElement.querySelector(`#${wrapId}`);
        const video = wrap?.querySelector('iframe') ?? wrap?.querySelector('video');
        if (video) {
          video.style.setProperty('height', `${height}px`, 'important');
        }
      },
      { injector: this.injector }
    );
  }
}
