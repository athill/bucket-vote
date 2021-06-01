import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Bucket from './components/Bucket';
import Dropspot from './components/Dropspots';
import Item, { DraggableItem } from './components/Item';
import Panels from './components/Panels';
import Toasts from './components/Toasts';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';




const Wrapper = ({ children }) => (
    <Container>
        <header id="header">
            <div className="banner">
                <Row>
                    <Col md={12} xs={10} id="banner-content">
                        <h1>Bucket Vote</h1>
                    </Col>
                </Row>
            </div>
        </header>
        <Container fluid>
            <Row id="layout">
                <Col md={12} id="content">
                    {children}
                </Col>
            </Row>
        </Container>
    </Container>
);


function App() {
    const [ state, setState ] = useState({
        buckets: {
            'president': []
        },
        items: ['candidate1'],
        conf: {
            bucketlimit: 10
        }
    });
    const [ toasts, setToasts ] = useState([
        // { type: 'warning', message: 'Item already exists in container', timesstamp: new Date() }
    ]);

    const removeItem = (itemName) => {
        const newBuckets = {};
        Object.keys(state.buckets).forEach((bucketName) => {
            newBuckets[bucketName] = state.buckets[bucketName].filter((name) => name !== itemName);
        });
        console.log(newBuckets);
        setState({
            ...state,
            items: state.items.filter((name) => name !== itemName),
            buckets: newBuckets
        });
    };

    const removeItemFromBucket = (bucketName, itemName) => {
        setState({
            ...state,
            buckets: {
                ...state.buckets,
                [bucketName]: state.buckets[bucketName].filter((name) => name !== itemName)
            }
        });
    };

    const onItemDrop = (bucketName, itemName) => {
        if (!state.buckets[bucketName].includes(itemName)) {
            setState({
                ...state,
                buckets: {
                    ...state.buckets,
                    [bucketName]: state.buckets[bucketName].concat([itemName])
                }
            });
        }
    };
    const { buckets, items } = state;
    return (
        <Wrapper>
            <Panels />
            <DndProvider backend={HTML5Backend}>
                <Dropspot label="Buckets">
                    {
                        Object.keys(buckets).map(name => (
                            <Bucket key={name} name={name} count={buckets[name].length} onItemDrop={onItemDrop}>
                                {
                                    buckets[name].map(itemName => (
                                        <Item key={itemName} draggable={false} name={itemName} onRemoveClick={() => removeItemFromBucket(name, itemName)} />
                                    ))
                                }
                            </Bucket>
                        ))
                    }
                </Dropspot>
                <Dropspot label="Items">
                    {
                        items.map(name => {
                            const count = Object.keys(buckets).reduce((a, b) => buckets[b].includes(name) ? a + 1 : a, 0);
                            return (
                                <DraggableItem key={name} count={count} name={name} onRemoveClick={() => removeItem(name)} />
                            )
                        })
                    }
                </Dropspot>
            </DndProvider>
            <Toasts toasts={toasts} />
            <section id="toolbar">
                <Button variant="warning">Sort items by vote</Button>{' '}
                <Button variant="warning">Download</Button>
            </section>
        </Wrapper>
    );
}

export default App;
