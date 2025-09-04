export type Question = {
  id: string;
  title: string;
  content: string;
  userId: string;
  status: 'pending' | 'answered';
  createdAt: string;
  answer?: {
    content: string;
    answeredBy: string;
    answeredAt: string;
  };
}
