import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Button from './Button';

const Header = ({ onAdd, showAdd }) => {
    const location = useLocation();
    return (
        <header className='header'>
            <h1>Task Tracker</h1>
            {location.pathname === '/' && (
                <Button
                    color={showAdd ? 'red' : 'green'}
                    text={showAdd ? 'Close' : 'Add'}
                    onClick={onAdd}
                />
            )}
        </header>
    );
};

Header.propTypes = {
    title: PropTypes.string,
};

// * css Styling in Js

// const headingStyle = {
//     textAlign: 'center',
//     color: 'white',
//     background: 'black',
// };

export default Header;
