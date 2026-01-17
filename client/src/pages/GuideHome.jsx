import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const GuideHome = () => {
    const { api, user } = useAuth();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuideProfile = async () => {
            try {
                const res = await api.get('/guide/home');
                setGuide(res.data.guide);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGuideProfile();
    }, [api]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;

    if (!guide) {
        return (
            <Container className="py-5 text-center">
                <h2>Welcome, {user.name}</h2>
                <p className="lead">Please complete your guide profile to start accepting bookings.</p>
                <Button as={Link} to="/guide/complete-profile" variant="primary">Complete Profile</Button>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="text-warning mb-4">Guide Dashboard</h2>
            <Row className="mb-4">
                <Col md={8}>
                    <Card className="glass-card text-white p-3 mb-3">
                        <div className="d-flex align-items-center">
                            <img src={guide.profileImage?.url || user.profileImage} alt="Profile"
                                className="rounded-circle me-3" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                            <div>
                                <h4>{user.name} <Badge bg={guide.status === 'verified' ? 'success' : 'warning'}>{guide.status}</Badge></h4>
                                <p className="mb-0 text-muted">{guide.location}</p>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="glass-card text-white p-3 text-center h-100 d-flex flex-column justify-content-center">
                        <h5>Price / Hour</h5>
                        <h3 className="text-warning">${guide.pricePerHour}</h3>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Button as={Link} to="/guide/requests" variant="outline-light" className="w-100 mb-3 py-3">
                        🕑 Booking Requests
                    </Button>
                </Col>
                <Col md={4}>
                    <Button as={Link} to="/guide/bookings" variant="outline-light" className="w-100 mb-3 py-3">
                        ✅ My Bookings (Accepted)
                    </Button>
                </Col>
                <Col md={4}>
                    <Button as={Link} to="/guide/profile" variant="outline-warning" className="w-100 mb-3 py-3">
                        ✏ Edit Profile
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default GuideHome;
