import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Item = ({ count = 0, name }) => (
    <div className="item">
        <span className="name">{name}</span>
        <div className="controls">
            <span className="count">{count}</span>
            <FontAwesomeIcon icon={[ 'fas', 'times-circle' ]} className="delete-button" />
        </div>
    </div>
);

export default Item;
