import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';



const HelpPanel = () => (
    <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
        Help
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
        <Card.Body>
            <p>
                Bucket vote came up because we had a committee that needed to nominate another committee.
                Say the present committee has 10 members, the new committee will have 7, and there are
                12 candidates. You would then have 10 buckets, 12 items, and a "Bucket Limit" of 7. As
                you drop items (candidates) into buckets (voters), the number of items in a`
                bucket and the number of buckets an item is in are updated.
            </p>
            <ol>
                <li>Click on "Setup" to toggle setup display</li>
                <li>Add buckets</li>
                <li>Add items</li>
                <li>Drag and drop items into buckets</li>
            </ol>
            <button className="pull-right btn" id="close-help-button">Got it!</button>
        </Card.Body>
        </Accordion.Collapse>
    </Card>
);

const FormRow = ({ id, label, SubmitButton, ...atts }) => (
    <Form.Group as={Row} controlId={id}>
        <Col md={2}>
            <Form.Label>{label} </Form.Label>
        </Col>
                <Col md={5}>
            <Form.Control {...atts} />
        </Col>
        <Col md={1}><SubmitButton /></Col>
    </Form.Group>
);

const SettingsPanel = () => (
    <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
        Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
            <Card.Body>
                <Form className="container">
                    <FormRow id="bucketlimit" label="Bucket Limit:" SubmitButton={() => <span>&nbsp;</span>}  type="number" />
                </Form>

                <p>Separate individual buckets and items with semi-colons.</p>
                <Form className="container add-form">
                    <FormRow id="add-buckets" label="Add Buckets:" SubmitButton={() => <Button>Add</Button>} size={50} />
                </Form>

                <Form className="container add-items-form">
                    <FormRow id="add-items" label="Add Items:" SubmitButton={() => <Button>Add</Button>} size={50} />
                </Form>

            </Card.Body>
        </Accordion.Collapse>
    </Card>
);


const Panels = () => (
    <Accordion defaultActiveKey="0">
        <HelpPanel />
        <SettingsPanel />
    </Accordion>
);

export default Panels;
