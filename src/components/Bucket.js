import React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Bucket = ({ children, count = 0, name }) => (
    <Card className="bucket">
        <Card.Header>
            <span className="name">{name}</span>
            <div class="controls">
                <span className="count">{count}</span>
                <FontAwesomeIcon icon={[ 'fas', 'times-circle' ]} className="delete-button" />
            </div>
        </Card.Header>
        <Card.Body className="bucket-items">
            {children}
        </Card.Body>
    </Card>
);

export default Bucket;
