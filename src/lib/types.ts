export type Topic = {
  id: string;
  title: string;
  createdAt: Date;
};

export type Note = {
  id: string;
  topicId: string;
  body: string;
  createdAt: Date;
  tags: string[];
  topicTitle?: string;
};

export type Stratum = {
  date: string;
  notes: Note[];
};
