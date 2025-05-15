import { memo, useCallback } from 'react';
import SectionButton from './SectionButton';
import { 
  ShieldExclamationIcon,
  FireIcon,
  ListBulletIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';

const sections = [
  { 
    title: 'Weaknesses',
    id: 'weaknesses',
    icon: ShieldExclamationIcon
  },
  { 
    title: 'Strengths',
    id: 'strengths',
    icon: FireIcon
  },
  { 
    title: 'Move List',
    id: 'moves',
    icon: ListBulletIcon
  },
  { 
    title: 'Variants',
    id: 'variants',
    icon: ArrowsRightLeftIcon
  }
];

const SectionGrid = memo(({ setActiveSection }) => {
  const handleClick = useCallback(
    (sectionId) => () => setActiveSection(sectionId),
    [setActiveSection]
  );

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {sections.map(({ title, id, icon }) => (
        <SectionButton
          key={id}
          title={title}
          icon={icon}
          onClick={handleClick(id)}
        />
      ))}
    </div>
  );
});

SectionGrid.propTypes = {
  setActiveSection: PropTypes.func.isRequired
};

export default SectionGrid;