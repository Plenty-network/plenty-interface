import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

import styles from "./modal.module.scss"
import clsx from "clsx";

const SimpleModal = (props) => {
return (

  <Modal
    show={props.open}
    onHide={props.onClose}
    backdrop="static"
    keyboard={false}
    dialogClassName={styles.simpleModal}
    centered={true}
  >
    {/* * Header */}
    <div className={clsx(styles.header, "d-flex")}>
      <div className={clsx(styles.title, "flex-grow-1")}>{props.title}</div>

      <div className={styles.closeBtn} onClick={props.onClose}>
        <span className="material-icons-round">close</span>
      </div>
    </div>
    {/* * Header */}

    {/* * Body */}
    <div className={styles.content}>
      {props.children}
    </div>
    {/* * Body */}
  </Modal>
)
}

SimpleModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default SimpleModal