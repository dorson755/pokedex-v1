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
  const rowHeights = useRef({});
  const [listHeight, setListHeight] = useReactState(500); // fallback

  // Measure container height
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

  // Default height fallback
  const defaultHeight = 60;

  const getItemSize = useCallback(
    (index) => rowHeights.current[index] || defaultHeight,
    []
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
      if (oldIndex >= 0) listRef.current.resetAfterIndex(oldIndex);
      if (newIndex >= 0 && newIndex !== oldIndex)
        listRef.current.resetAfterIndex(newIndex);
    }
  };

  const Row = memo(({ index, style, data }) => {
    const { moves, expandedMove, handleExpand } = data;
    const move = moves[index];
    const rowRef = useRef(null);

    useLayoutEffect(() => {
      if (rowRef.current) {
        const height = rowRef.current.getBoundingClientRect().height + 8; // 8px extra spacing
        if (rowHeights.current[index] !== height) {
          rowHeights.current[index] = height;
          if (listRef.current) listRef.current.resetAfterIndex(index);
        }
      }
    }, [expandedMove, index]);

    return (
      <div style={{ ...style, paddingBottom: '0.5rem' }}>
        <div ref={rowRef} className="bg-white/5 rounded-lg mx-2">
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
          height={listHeight - 56}
          width="100%"
          itemCount={moves.length}
          itemSize={getItemSize}
          itemData={{ moves, expandedMove, handleExpand }}
          itemKey={(index) => moves[index].name}
        >
          {Row}
        </VariableSizeList>
      </div>
    </div>
  );
});

export default MoveListContent;
