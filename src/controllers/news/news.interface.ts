export interface News {
  _id: string;
  newsId: string;
  title: string;
  contents: string;
  newsDate: string;
  href: string;
  pressId: string;
  topicName: string;
  createdDate: Date;
  modifiedDate: Date;
}

export interface Press {
  _id: string;
  pressId: string;
  pressName: string;
  pressNewsCount: number;
}

export interface newsList {
  newsId: string;
  href: string;
  press: {
    pressId: string;
    pressName: string;
  };
}
