import PropTypes from 'prop-types'
import clsx from "clsx";

import styles from './button.module.scss'

const Button = props => {
  // ? Destructing and setting default props if any
  const { color = 'default', isIconBtn = false } = props

  return (
    <button
      className={clsx(
        isIconBtn ? styles.iconBtn : styles.btn,
        styles[color],
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.startIcon && <span className="material-icons-round">{props.startIcon}</span>} {!isIconBtn && props.children}
    </button>
  )
}

Button.propTypes = {
  color: PropTypes.oneOf(['primary', 'default', 'mute']),
  className: PropTypes.string,
  isIconBtn: PropTypes.bool,
  startIcon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string,
}

export default Button;
