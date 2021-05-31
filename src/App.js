import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Bucket from './components/Bucket';
import Dropspot from './components/Dropspots';
import Item from './components/Item';
import Panels from './components/Panels';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';




const Wrapper = ({ children }) => (
    <Container>
        <header id="header">
            <div class="banner">
                <Row>
                    <Col md={12} xs={10} id="banner-content">
                        <h1>Bucket Vote</h1>
                    </Col>
                </Row>
            </div>
        </header>
        <div class="container-fluid">
            <div class="grid">
                <Row id="layout">
                    <Col md={12} id="content">
                        {children}
                    </Col>
                </Row>
            </div>
        </div>
    </Container>
);


function App() {
  return (
    <Wrapper>
        <Panels />
        <Dropspot label="Buckets">
            <Bucket name="president" />
        </Dropspot>
        <Dropspot label="Items">
            <Item name="candidate1" />
        </Dropspot>
        <section id="toolbar">
            <Button variant="warning">Sort items by vote</Button>{' '}
            <Button variant="warning">Download</Button>
		</section>
    </Wrapper>
  );
}

export default App;
