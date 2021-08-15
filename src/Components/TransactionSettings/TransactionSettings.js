import React, {useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const TransactionSettings = (props) => {
    const CustomToggle = React.forwardRef(({onClick}, ref) => (
        <a
            href=""
            className="nav-menu-item-link"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <span className="span-themed material-icons-outlined">
                settings
            </span>
        </a>
    ));

    const [recepient, setRecepient] = useState(false);

    const handleRecepient = (elem) => {
        setRecepient(elem);
        props.setRecepient('');
    };
    return (
        <Dropdown className="transaction-setting">
            <Dropdown.Toggle
                as={CustomToggle}
                id="transaction-setting"
            ></Dropdown.Toggle>

            <Dropdown.Menu className="menu-dropdown transaction-settings-dropdown bg-themed">
                <p className="transaction-setting-menu-label">Transaction Settings</p>
                <p className="transaction-setting-sub-label">
                    Slippage tolerance{' '}
                    <span className="material-icons-round">help_outline</span>
                </p>

                <div className="slipping-tolerance-detail-wrapper flex justify-between align-center">
                    <button className="slipping-tolerance-btn">Auto</button>
                    <input
                        type="text"
                        className="slipping-tolerance-input bg-themed-light span-themed"
                        placeholder="0.10"
                        value={props.slippage}
                        onChange={(e) => props.setSlippage(parseFloat(e.target.value))}
                    />
                    <div className="percentage-icon"><span className="span-themed">%</span></div>
                </div>

                <div className="interface-setting-wrapper">
                    <p className="transaction-setting-menu-label">Interface Settings</p>
                    <div className="flex align-center">
                        <p className="transaction-setting-sub-label">
                            Add Recepient{' '}
                            <span className="material-icons-round">help_outline</span>
                        </p>
                        <div className="toggleWrapper">
                            <input
                                type="checkbox"
                                className="dn"
                                id="dn"
                                onChange={() => handleRecepient(!recepient)}
                            />
                            <label htmlFor="dn" className="toggle">
                                <span className="toggle__handler"></span>
                            </label>
                        </div>
                    </div>
                    {recepient ? (
                        <input
                            type="text"
                            className="slipping-tolerance-input full-width"
                            placeholder="tz1..."
                            onChange={(e) => props.setRecepient(e.target.value)}
                            value={props.recepient}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default TransactionSettings;
