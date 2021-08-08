import PropTypes from 'prop-types'

const Button = props => {
  // ? Destruct and setting default props if any
  const { color = 'default' } = props

  return (
    <button className={color} onClick={props.onClick}>
      {props.startIcon && <span className="material-icons-round">{props.startIcon}</span>} {props.children}
    </button>
  )
}

Button.propTypes = {
  color: PropTypes.oneOf(['primary', 'default']),
  startIcon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
}

export default Button;
