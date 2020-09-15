export interface News {
  _id?: string;
  newsId: string;
  title: string;
  contents: string;
  newsDate?: string;
  href: string;
  pressId: string;
  topicName: string;
  fakeNews: number;
}

export interface newsList {
  newsId: string;
  href: string | undefined;
  title: string;
  topicName: string;
  press: {
    pressId: string;
    pressName: string;
  };
}

export interface newsContent {
  content?: string | null;
  date?: string | null;
}

export interface getNewsListParam {
  page: number;
}

export interface fakeNewsLog {
  userId: number;
  newsId: string;
  createdDate?: Date;
  modifiedDate?: Date;
}