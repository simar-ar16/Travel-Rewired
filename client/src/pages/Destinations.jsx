import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get('http://localhost:3000/destinations');
                setDestinations(res.data.destinations);
                setLoading(false);
            } catch (err) {
                setError('Failed to load destinations');
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;
    if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;

    return (
        <Container className="py-5">
            <h2 className="text-center mb-5 fw-bold text-warning">Explore Destinations</h2>
            <Row>
                {destinations.map(dest => (
                    <Col md={4} key={dest._id} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm glass-card text-white">
                            <div style={{ height: '200px', overflow: 'hidden', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                <Card.Img variant="top" src={dest.imageUrl} style={{ height: '100%', objectFit: 'cover' }} />
                            </div>
                            <Card.Body>
                                <Card.Title className="fw-bold">{dest.name}</Card.Title>
                                <Card.Text className="text-truncate">{dest.description}</Card.Text>
                                <Button as={Link} to={`/destinations/${dest._id}`} variant="outline-warning" className="w-100 mt-2">
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Destinations;
