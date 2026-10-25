export interface VideoPayload {
  url: string;
  type: string;
  height: number;
}

export enum VideoTypeEnum {
  INTEGRATION = 'integration',
  MP4 = 'mp4',
  DOUYIN = 'douyin',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  YOUTUBE_SHORT = 'youtube_short',
  DAILYMOTION = 'dailymotion',
}
