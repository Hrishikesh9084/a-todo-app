import { useState } from 'react';
import { toast } from 'sonner';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  onUpdate: (board: BoardProps) => void;
  onDelete: (boardId: string) => void;
}

const ItemTypes = {
  CARD: 'card',
};

interface DragItem {
  type: string;
  index: number;
  listId: string;
  cardId: string;
}

const Card = ({ card, index, listId, moveCard, updateCard, deleteCard }: { card: Card; index: number; listId: string; moveCard: (dragIndex: number, hoverIndex: number, dragListId: string, hoverListId: string) => void; updateCard: (card: Card) => void; deleteCard: (cardId: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { type: ItemTypes.CARD, index, listId, cardId: card.id } as DragItem,
    end: (item, monitor) => {
      if (!monitor.didDrop()) return;
      const { newListId, newIndex } = monitor.getDropResult();
      if (newListId !== listId || newIndex !== index) {
        moveCard(item.index, newIndex, item.listId, newListId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item: DragItem, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragListId = item.listId;

      if (dragIndex === hoverIndex && dragListId === listId) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCard(dragIndex, hoverIndex, dragListId, listId);
      item.index = hoverIndex;
      item.listId = listId;
    },
  });

  drag(drop(ref));

  const opacity = isDragging ? 0 : 1;

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className="bg-white p-3 mb-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800">{card.title}</h3>
        <button
          onClick={() => deleteCard(card.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          ×
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2">{card.description}</p>
      <button
        onClick={() => {
          const newTitle = prompt('New title:', card.title);
          const newDescription = prompt('New description:', card.description);
          if (newTitle !== null && newDescription !== null) {
            updateCard({ ...card, title: newTitle, description: newDescription });
          }
        }}
        className="text-blue-500 hover:text-blue-700 text-xs"
      >
        Edit
      </button>
    </div>
  );
};

const List = ({ list, boardId, updateBoard }: { list: List; boardId: string; updateBoard: (board: BoardProps) => void }) => {
  const [title, setTitle] = useState(list.title);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  const moveCard = (dragIndex: number, hoverIndex: number, dragListId: string, hoverListId: string) => {
    updateBoard({
      ...boards.find(b => b.id === boardId),
      lists: boards
        .find(b => b.id === boardId)
        ?.lists.map(list => {
          if (list.id === dragListId) {
            const newCards = [...list.cards];
            const [removed] = newCards.splice(dragIndex, 1);
            return { ...list, cards: newCards };
          }
          if (list.id === hoverListId) {
            const newCards = [...list.cards];
            newCards.splice(hoverIndex, 0, {
              id: Date.now().toString(),
              title: 'New Card',
              description: '',
              listId: list.id,
            });
            return { ...list, cards: newCards };
          }
          return list;
        }),
    });
  };

  const addCard = () => {
    if (!newCardTitle.trim()) return;

    const newCard = {
      id: Date.now().toString(),
      title: newCardTitle,
      description: newCardDescription,
      listId: list.id,
    };

    updateBoard({
      ...boards.find(b => b.id === boardId),
      lists: boards
        .find(b => b.id === boardId)
        ?.lists.map(l => (l.id === list.id ? { ...l, cards: [...l.cards, newCard] } : l)),
    });

    setNewCardTitle('');
    setNewCardDescription('');
  };

  const updateCard = (updatedCard: Card) => {
    updateBoard({
      ...boards.find(b => b.id === boardId),
      lists: boards
        .find(b => b.id === boardId)
        ?.lists.map(l =>
          l.id === updatedCard.listId
            ? { ...l, cards: l.cards.map(c => (c.id === updatedCard.id ? updatedCard : c)) }
            : l
        ),
    });
  };

  const deleteCard = (cardId: string) => {
    updateBoard({
      ...boards.find(b => b.id === boardId),
      lists: boards
        .find(b => b.id === boardId)
        ?.lists.map(l => ({ ...l, cards: l.cards.filter(c => c.id !== cardId) })),
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg w-80 mr-4" key={list.id}>
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim()) {
              updateBoard({
                ...boards.find(b => b.id === boardId),
                lists: boards
                  .find(b => b.id === boardId)
                  ?.lists.map(l => (l.id === list.id ? { ...l, title } : l)),
              });
            }
          }}
          className="text-lg font-semibold bg-transparent border border-transparent focus:border-blue-500 focus:outline-none px-2 py-1 rounded w-full"
        />
      </div>
      {list.cards.map((card, index) => (
        <DndProvider backend={HTML5Backend} key={card.id}>
          <Card
            card={card}
            index={index}
            listId={list.id}
            moveCard={moveCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        </DndProvider>
      ))}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Card title"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2 bg-white"
        />
        <textarea
          placeholder="Card description"
          value={newCardDescription}
          onChange={(e) => setNewCardDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2 bg-white text-sm"
          rows={2}
        />
        <button
          onClick={addCard}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          + Add Card
        </button>
      </div>
    </div>
  );
};

let boards: BoardProps[] = [];

const Board = ({ board }: { board: BoardProps }) => {
  const [localBoard, setLocalBoard] = useState<BoardProps>(board);

  const updateBoard = (updatedBoard: BoardProps) => {
    boards = boards.map(b => (b.id === updatedBoard.id ? updatedBoard : b));
    setLocalBoard(updatedBoard);
  };

  const deleteBoard = () => {
    boards = boards.filter(b => b.id !== board.id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-full mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{localBoard.title}</h2>
        <button
          onClick={() => {
            if (confirm('Delete this board?')) {
              deleteBoard();
            }
          }}
          className="text-red-500 hover:text-red-700"
        >
          Delete Board
        </button>
      </div>
      <div className="flex overflow-x-auto pb-4">
        {localBoard.lists.map(list => (
          <List key={list.id} list={list} boardId={localBoard.id} updateBoard={updateBoard} />
        ))}
        <div className="bg-gray-50 p-4 rounded-lg w-80 mr-4 flex items-center justify-center">
          <button
            onClick={() => {
              const newListTitle = prompt('New list title:', 'New List');
              if (newListTitle) {
                updateBoard({
                  ...localBoard,
                  lists: [
                    ...localBoard.lists,
                    {
                      id: Date.now().toString(),
                      title: newListTitle,
                      cards: [],
                    },
                  ],
                });
              }
            }}
            className="text-green-500 hover:text-green-700"
          >
            + Add List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Board;
