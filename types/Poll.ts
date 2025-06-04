export type Poll = {
  id: number;
  title: string;
  dateToInit: Date;
  dateToEnd: Date;
  pollResponses: [
    {
      id: number;
      title: string;
      vote: number;
      pollId: number;
    }
  ];
  _count: {
    pollResponses: number;
  };
};
