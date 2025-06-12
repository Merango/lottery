import React, { useState, useEffect } from 'react';
import { LotteryRound } from '@/types/lottery';

interface LotteryHistoryViewProps {
  rounds: LotteryRound[];
  isLoading?: boolean;
  error?: string | null;
}

export const LotteryHistoryView: React.FC<LotteryHistoryViewProps> = ({ 
  rounds, 
  isLoading = false, 
  error = null 
}) => {
  const [displayedRounds, setDisplayedRounds] = useState<LotteryRound[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roundsPerPage = 5;

  useEffect(() => {
    const startIndex = (currentPage - 1) * roundsPerPage;
    const endIndex = startIndex + roundsPerPage;
    setDisplayedRounds(rounds.slice(startIndex, endIndex));
  }, [rounds, currentPage]);

  const totalPages = Math.ceil(rounds.length / roundsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return <div>Loading lottery history...</div>;
  }

  if (error) {
    return <div>Error loading lottery history: {error}</div>;
  }

  if (rounds.length === 0) {
    return <div>No lottery history available</div>;
  }

  return (
    <div className="lottery-history-container">
      <h2>Lottery History</h2>
      <table className="lottery-history-table">
        <thead>
          <tr>
            <th>Round</th>
            <th>Date</th>
            <th>Pot Size</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {displayedRounds.map((round) => (
            <tr key={round.id}>
              <td>{round.roundNumber}</td>
              <td>{new Date(round.timestamp).toLocaleDateString()}</td>
              <td>${round.potSize.toLocaleString()}</td>
              <td>{round.winner ? round.winner.slice(0, 6) + '...' : 'No Winner'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};