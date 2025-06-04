import PollResponse from "./PollResponse";

export default interface PollData {
  id: number;
  title: string;
  dateToInit: string;
  dateToEnd: string;
  urlToEdit: string;
  pollResponses: PollResponse[];
  _count: {
    pollResponses: number;
  };
}
