import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const BookGuide = () => {
    const { guideId } = useParams();
    const location = useLocation();
    const tripId = location.state?.trip;
    const { api } = useAuth();
    const navigate = useNavigate();

    const [guide, setGuide] = useState(null);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        numberOfPeople: 1,
        message: '',
        days: 1
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuide = async () => {
            // For simplicity, we assume we fetch guide details here or use state.
            // But existing API /book-guide renders a page. We need to fetch data.
            // Ideally we just fetch guide by ID.
            try {
                const res = await api.get(`/guide/${guideId}`); // Assuming public profile endpoint
                setGuide(res.data.guide);
            } catch (err) {
                console.error(err);
                setError('Failed to load guide details');
            } finally {
                setLoading(false);
            }
        };
        fetchGuide();
    }, [guideId, api]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/book-guide/${guideId}`, {
                ...formData,
                tripId: tripId // passed from navigation state or selection
            });
            navigate('/trip-planner');
        } catch (err) {
            setError(err.response?.data?.error || 'Booking failed');
        }
    };

    if (loading) return <Spinner animation="border" variant="warning" />;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="glass-card text-white p-4">
                        <h2 className="mb-4">Book Guide: {guide?.user?.name}</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        {!tripId && <Alert variant="warning">Warning: No Trip selected. Please start booking from Trip Planner.</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control type="date" name="startDate" required onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control type="date" name="endDate" required onChange={handleChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Number of People</Form.Label>
                                <Form.Control type="number" name="numberOfPeople" min="1" value={formData.numberOfPeople} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Message to Guide</Form.Label>
                                <Form.Control as="textarea" rows={3} name="message" onChange={handleChange} />
                            </Form.Group>

                            <Button variant="warning" type="submit" disabled={!tripId} className="w-100">
                                Send Booking Request
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookGuide;
