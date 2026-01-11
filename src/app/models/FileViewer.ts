export interface MessageEventRequest {
  type: string;
  payload: {
    url: string;
    filename?: string;
    extension: string;
  }
}

export enum FileExtensionEnum {
  PDF = 'pdf',
  MP4 = 'mp4',
  MP3 = 'mp3',
  IMAGE = 'image',
  TXT = 'txt',
  CSV = 'csv'
}