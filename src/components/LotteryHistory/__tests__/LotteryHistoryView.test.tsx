import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LotteryHistoryView } from '../LotteryHistoryView';
import { LotteryRound } from '@/types/lottery';

const mockRounds: LotteryRound[] = [
  {
    id: '1',
    roundNumber: 1,
    timestamp: Date.now(),
    potSize: 1000,
    winner: '0x1234567890123456789012345678901234567890',
    participants: ['0x1234']
  },
  {
    id: '2',
    roundNumber: 2,
    timestamp: Date.now(),
    potSize: 2000,
    winner: '0x0987654321098765432109876543210987654321',
    participants: ['0x5678']
  }
];

describe('LotteryHistoryView', () => {
  it('renders loading state', () => {
    render(<LotteryHistoryView rounds={[]} isLoading={true} />);
    expect(screen.getByText(/loading lottery history/i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<LotteryHistoryView rounds={[]} error="Network error" />);
    expect(screen.getByText(/error loading lottery history: network error/i)).toBeInTheDocument();
  });

  it('renders no history state', () => {
    render(<LotteryHistoryView rounds={[]} />);
    expect(screen.getByText(/no lottery history available/i)).toBeInTheDocument();
  });

  it('renders lottery rounds', () => {
    render(<LotteryHistoryView rounds={mockRounds} />);
    expect(screen.getByText('Lottery History')).toBeInTheDocument();
    expect(screen.getByText('1234...')).toBeInTheDocument();
  });

  it('handles pagination', () => {
    const manyRounds = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      roundNumber: i + 1,
      timestamp: Date.now(),
      potSize: 1000 * (i + 1),
      winner: '0x1234567890123456789012345678901234567890',
      participants: [`0x${i}`]
    }));

    render(<LotteryHistoryView rounds={manyRounds} />);
    
    const nextButton = screen.getByText(/next/i);
    const prevButton = screen.getByText(/previous/i);

    expect(prevButton).toBeDisabled();
    fireEvent.click(nextButton);
    
    const pageInfo = screen.getByText(/page 2 of 2/i);
    expect(pageInfo).toBeInTheDocument();
  });
});