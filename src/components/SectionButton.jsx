import { memo } from 'react';
import PropTypes from 'prop-types';

const SectionButton = memo(({ title, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className="glass-panel p-4 hover:bg-white/10 transition-all rounded-xl flex flex-col items-center justify-center aspect-square gap-2"
  >
    {Icon && <Icon className="w-6 h-6 text-white" />}
    <span className="text-white font-medium text-center text-sm md:text-base">
      {title}
    </span>
  </button>
));

SectionButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType
};

export default SectionButton;