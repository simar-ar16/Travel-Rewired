import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TripPlanner = () => {
    const { api } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await api.get('/trip-planner');
                setTrips(res.data.trips);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [api]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h2 className="text-warning fw-bold mb-0">My Trip Plans</h2>
                <Button as={Link} to="/destinations" variant="success">
                    + Plan New Trip
                </Button>
            </div>

            {trips.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <h4>No trips planned yet.</h4>
                    <p>Go to Destinations and start planning!</p>
                </div>
            ) : (
                <Row>
                    {trips.map(trip => (
                        <Col md={6} lg={4} key={trip._id} className="mb-4">
                            <Card className="h-100 border-0 shadow glass-card text-white">
                                {trip.destination.imageUrl && (
                                    <Card.Img variant="top" src={trip.destination.imageUrl} style={{ height: '150px', objectFit: 'cover', opacity: 0.8 }} />
                                )}
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Card.Title className="fw-bold h4">{trip.destination.name}</Card.Title>
                                        <Badge bg={new Date(trip.endDate) < new Date() ? "secondary" : "success"}>
                                            {new Date(trip.endDate) < new Date() ? "Completed" : "Upcoming"}
                                        </Badge>
                                    </div>

                                    <Card.Text>
                                        📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                    </Card.Text>
                                    <Button as={Link} to={`/trip-planner/${trip._id}`} variant="warning" className="w-100">
                                        Manage Trip
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default TripPlanner;
