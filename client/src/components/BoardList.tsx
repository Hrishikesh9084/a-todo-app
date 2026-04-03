import { useState, useEffect } from 'react';
import Board from './Board';
import { toast } from 'sonner';

interface Card {
  id: string;
  title: string;
  description: string;
  listId: string;
}

interface List {
  id: string;
  title: string;
  cards: Card[];
}

interface BoardProps {
  id: string;
  title: string;
  lists: List[];
}

const BoardList = () => {
  const [boards, setBoards] = useState<BoardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/boards');
      if (!response.ok) throw new Error('Failed to fetch boards');
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      toast.error('Failed to load boards');
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async () => {
    const title = prompt('Enter board title:', 'New Board');
    if (!title) return;

    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error('Failed to create board');
      const newBoard = await response.json();
      setBoards([...boards, newBoard]);
      toast.success('Board created successfully');
    } catch (error) {
      toast.error('Failed to create board');
      console.error('Error creating board:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Project Management Tool</h1>
        <button
          onClick={createBoard}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + New Board
        </button>
      </div>
      {loading ? (
        <div className="text-center py-12">Loading boards...</div>
      ) : boards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No boards found. Create your first board!</p>
          <button
            onClick={createBoard}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Create Board
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {boards.map(board => (
            <Board key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;
