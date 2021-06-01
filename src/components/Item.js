import { useDrag } from 'react-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ItemTypes } from '../util/constants';

export const DraggableItem = ({ count = 0, name, onRemoveClick }) => {
    const [{isDragging}, drag] = useDrag(() => ({
        item: { name },
        type: ItemTypes.ITEM,
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
    }));
    console.log(onRemoveClick);
    return <Item drag={drag} isDragging={isDragging} count={count} name={name} onRemoveClick={onRemoveClick}  />;
};

const Item = ({ count = 0, drag, isDragging, name, onRemoveClick }) => (
    <div className="item" ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
        <span className="name">{name}</span>
        <div className="controls">
            { drag && <span className="count">{count}</span> }
            <FontAwesomeIcon icon={[ 'fas', 'times-circle' ]} className="delete-button" onClick={onRemoveClick} />
        </div>
    </div>
);

export default Item;
