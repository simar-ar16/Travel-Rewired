import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert, ListGroup, Image } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DestinationDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/destinations/${id}`);
                setDestination(res.data.destination);
                setLoading(false);
            } catch (err) {
                setError('Failed to load destination');
                setLoading(false);
            }
        };
        fetchDestination();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;
    if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;
    if (!destination) return <div>Not found</div>;

    return (
        <div style={{ color: '#fff' }}>
            <div style={{
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${destination.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <h1 className="display-3 fw-bold">{destination.name}</h1>
            </div>

            <Container className="py-5">
                <Row>
                    <Col md={8}>
                        <h3>About</h3>
                        <p className="lead">{destination.description}</p>

                        <h4 className="mt-4">Must Visit Places</h4>
                        <ListGroup variant="flush" className="glass-card mb-4">
                            {destination.mustVisit?.map((place, idx) => (
                                <ListGroup.Item key={idx} style={{ background: 'transparent', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    📍 {place}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <div className="glass-card p-4">
                            <h4>Best Time to Visit</h4>
                            <p>{destination.bestTimeToVisit}</p>

                            <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                            {user ? (
                                <Button as={Link} to={`/trip-planner/create/${destination._id}`} variant="warning" className="w-100 mb-3">
                                    Start Planning Trip
                                </Button>
                            ) : (
                                <Button as={Link} to="/login" variant="warning" className="w-100 mb-3">
                                    Login to Plan Trip
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DestinationDetail;
