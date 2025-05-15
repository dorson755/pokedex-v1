import { memo, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import LoadingSkeleton from './LoadingSkeleton';

const MoveRow = memo(({ data, index, style }) => {
  const { moves, expandedMove, setExpandedMove } = data;
  const { name, data: moveData } = moves[index];
  
  return (
    <div style={style}>
      <div className="glass-panel rounded-lg mx-2 mb-2">
        <button 
          className="w-full p-3 flex justify-between items-center"
          onClick={() => setExpandedMove(expandedMove === name ? null : name)}
        >
          <span className="capitalize text-white">
            {name.replace(/-/g, ' ')}
          </span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${
            expandedMove === name ? 'rotate-180' : ''
          }`}/>
        </button>
        
        {expandedMove === name && (
          <div className="p-4 pt-0 text-white/80 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Power: {moveData.power || '—'}</div>
              <div>Accuracy: {moveData.accuracy || '—'}</div>
              <div>PP: {moveData.pp || '—'}</div>
              <div>Class: {moveData.damageClass}</div>
            </div>
            {moveData.effect && (
              <p className="text-xs italic opacity-75">
                {moveData.effect.replace(/\$effect_chance%/g, '')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const MoveListContent = memo(({ moves }) => {
  const [expandedMove, setExpandedMove] = useState(null);

  if (!moves) return <LoadingSkeleton variant="move" count={5} />;

  return (
    <>
      <h3 className="text-2xl font-bold text-white mb-4 px-2">Move List</h3>
      <FixedSizeList
        height={500}
        width="100%"
        itemCount={moves.length}
        itemSize={expandedMove ? 150 : 60}
        itemData={{
          moves,
          expandedMove,
          setExpandedMove
        }}
      >
        {MoveRow}
      </FixedSizeList>
    </>
  );
});

export default MoveListContent;