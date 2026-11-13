export interface VideoPayload {
  url: string;
  type: string;
  height: number;
  file: File | undefined;
  maxWidth?: number;
}

export enum VideoTypeEnum {
  INTEGRATION = 'integration',
  MP4 = 'mp4',
  DOUYIN = 'douyin',
  TIKTOK = 'tiktok',
  INSTAGRAM = 'instagram',
  YOUTUBE_SHORT = 'youtube_short',
  DAILYMOTION = 'dailymotion',
  REDDIT = 'reddit',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
}
