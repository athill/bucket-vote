import React from 'react';
import Card from 'react-bootstrap/Card';
import { useDrop } from 'react-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ItemTypes }  from '../util/constants'
import { statement } from '@babel/template';

const Bucket = ({ children, count = 0, name, onItemDrop }) => {
    const [{ didDrop, isOver }, drop] = useDrop(() => {
        return {
            accept: ItemTypes.ITEM,
            collect: monitor => ({
                isOver: !!monitor.isOver(),
                didDrop: !!monitor.didDrop()
            }),
            drop: ((item, monitor) => {
                const { name: itemName } = item;
                onItemDrop(name, itemName);
            })
        }
    });
    return (
        <Card className="bucket">
            <Card.Header>
                <span className="name">{name}</span>
                <div className="controls">
                    <span className="count">{count}</span>
                    <FontAwesomeIcon icon={[ 'fas', 'times-circle' ]} className="delete-button" />
                </div>
            </Card.Header>
            <Card.Body className="bucket-items" ref={drop}>
                {children}
            </Card.Body>
        </Card>
    );
};
export default Bucket;
