import {
  memo,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
  useState as useReactState,
} from 'react';
import { VariableSizeList } from 'react-window';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import LoadingSkeleton from './LoadingSkeleton';

const MoveListContent = memo(({ moves }) => {
  const [expandedMove, setExpandedMove] = useState(null);
  const listRef = useRef();
  const wrapperRef = useRef();
  const [listHeight, setListHeight] = useReactState(500); // fallback

  // Dynamically measure container height
  useLayoutEffect(() => {
    const measure = () => {
      if (wrapperRef.current) {
        const { height } = wrapperRef.current.getBoundingClientRect();
        setListHeight(height);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Dynamic row height
  const getItemSize = useCallback(
    (index) => (expandedMove === moves[index].name ? 150 : 60),
    [expandedMove, moves]
  );

  const handleExpand = (moveName) => {
  const newExpanded = expandedMove === moveName ? null : moveName;
  const oldIndex = expandedMove
    ? moves.findIndex((m) => m.name === expandedMove)
    : -1;
  const newIndex = newExpanded
    ? moves.findIndex((m) => m.name === newExpanded)
    : -1;

  setExpandedMove(newExpanded);

  if (listRef.current) {
    // Reset the old index so space closes up
    if (oldIndex >= 0) listRef.current.resetAfterIndex(oldIndex, true);
    // Reset the new index so space expands
    if (newIndex >= 0 && newIndex !== oldIndex)
      listRef.current.resetAfterIndex(newIndex, true);
  }
};


  // Row renderer
  const Row = memo(({ index, style, data }) => {
    const { moves, expandedMove, handleExpand } = data;
    const move = moves[index];

    return (
      <div style={style}>
        <div className="glass-panel rounded-lg mx-2 mb-2">
          <button
            className="w-full p-3 flex justify-between items-center"
            onClick={() => handleExpand(move.name)}
          >
            <span className="capitalize text-white">
              {move.name.replace(/-/g, ' ')}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 transition-transform ${
                expandedMove === move.name ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedMove === move.name && (
            <div className="p-4 pt-0 text-white/80 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Power: {move.data.power || '—'}</div>
                <div>Accuracy: {move.data.accuracy || '—'}</div>
                <div>PP: {move.data.pp || '—'}</div>
                <div>Class: {move.data.damageClass}</div>
              </div>
              {move.data.effect && (
                <p className="text-xs italic opacity-75">
                  {move.data.effect.replace(/\$effect_chance%/g, '')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  });

  if (!moves) return <LoadingSkeleton variant="move" count={5} />;

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col overflow-hidden"
      style={{ maxHeight: 'calc(100vh - 6rem)' }}
    >
      <h3 className="text-2xl font-bold text-white mb-4 px-2">Move List</h3>
      <div className="flex-1 overflow-hidden">
        <VariableSizeList
          ref={listRef}
          height={listHeight - 56 /* subtract title height estimate */}
          width="100%"
          itemCount={moves.length}
          itemSize={getItemSize}
          itemData={{
            moves,
            expandedMove,
            handleExpand,
          }}
          itemKey={(index) => moves[index].name}
        >
          {Row}
        </VariableSizeList>
      </div>
    </div>
  );
});

export default MoveListContent;
