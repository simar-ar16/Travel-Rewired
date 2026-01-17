import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const GuideRequests = () => {
    const { api } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/guide/requests'); // Endpoint for requests
            // Assuming res.data.requests is the list
            setRequests(res.data.requests || []); // backend might return { pending: [], accepted: [] } or just requests
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await api.post(`/guide/requests/${id}/${action}`);
            setMessage(`Request ${action}ed successfully`);
            fetchRequests(); // refresh list
        } catch (err) {
            console.error(err);
            setMessage('Action failed');
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;

    return (
        <Container className="py-5">
            <h2 className="text-white mb-4">Booking Requests</h2>
            {message && <Alert variant="info">{message}</Alert>}

            {requests.length === 0 ? <p className="text-light">No pending requests.</p> : (
                <Row>
                    {requests.map(req => (
                        <Col md={6} key={req._id} className="mb-3">
                            <Card className="glass-card text-white p-3">
                                <Card.Header className="d-flex justify-content-between border-bottom border-secondary">
                                    <span className="fw-bold">{req.traveler.name}</span>
                                    <Badge bg="info">Pending</Badge>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Trip:</strong> {req.trip.destination.name}</p>
                                    <p><strong>Date:</strong> {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</p>
                                    <p><strong>People:</strong> {req.numberOfPeople}</p>
                                    <p><strong>Message:</strong> {req.message}</p>

                                    <div className="d-flex gap-2 mt-3">
                                        <Button variant="success" onClick={() => handleAction(req._id, 'accept')}>Accept</Button>
                                        <Button variant="danger" onClick={() => handleAction(req._id, 'decline')}>Decline</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default GuideRequests;
