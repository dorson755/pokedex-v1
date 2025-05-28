import { memo } from 'react';
import PropTypes from 'prop-types';

const SectionButton = memo(({ title, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className=""
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