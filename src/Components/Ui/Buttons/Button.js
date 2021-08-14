import PropTypes from 'prop-types'
import clsx from "clsx";

import styles from './button.module.scss'

const Button = props => {
  // ? Destructing and setting default props if any
  const { color = 'default', size = 'default', isIconBtn = false } = props

  return (
    <button
      className={clsx(
        isIconBtn ? styles.iconBtn : styles.btn,
        styles[color],
        {
          [styles.smallBtn]: size === 'small',
        },
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.startIcon && <span className="material-icons-round mr-1">{props.startIcon}</span>}
      {!isIconBtn && <span>{props.children}</span>}
    </button>
  )
}

Button.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'default', 'mute']),
  size: PropTypes.oneOf(['small', 'default']),
  className: PropTypes.string,
  isIconBtn: PropTypes.bool,
  startIcon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string,
}

export default Button;
