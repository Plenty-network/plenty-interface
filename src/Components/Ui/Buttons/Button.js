import PropTypes from 'prop-types'
import clsx from "clsx";

import styles from './button.module.scss'
import PuffLoader from "react-spinners/PuffLoader";

const Button = props => {
  // ? Destructing and setting default props if any
  const { color = 'default', size = 'default', isIconBtn = false } = props

  return (
    <button
      {...props}
      className={clsx(
        isIconBtn ? styles.iconBtn : styles.btn,
        styles[color],
        {
          [styles.smallBtn]: size === 'small',
        },
        props.className,
      )}
      onClick={!props.loading ? props.onClick : undefined}
    >
      {props.loading && <PuffLoader color={"#fff"} size={28} />}
      {!props.loading && props.startIcon && <span className="material-icons-round mr-1">{props.startIcon}</span>}
      {!props.loading && !isIconBtn && <span>{props.children}</span>}
    </button>
  )
}

Button.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'default', 'mute']),
  size: PropTypes.oneOf(['small', 'default']),
  className: PropTypes.string,
  isIconBtn: PropTypes.bool,
  loading: PropTypes.bool,
  startIcon: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.string,
}

export default Button;
