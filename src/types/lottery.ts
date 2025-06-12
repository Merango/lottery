export interface LotteryRound {
  id: string;
  roundNumber: number;
  timestamp: number;
  potSize: number;
  winner: string | null;
  participants: string[];
}