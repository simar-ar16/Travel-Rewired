import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="hero-section text-center text-white d-flex align-items-center justify-content-center"
                style={{ background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', height: '90vh' }}>
                <Container>
                    <h1 className="display-3 fw-bold mb-4">Explore the World like a Local</h1>
                    <p className="lead mb-4">Plan trips, book verified guides, and create memories that last a lifetime.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button as={Link} to="/destinations" variant="warning" size="lg">Explore Destinations</Button>
                        <Button as={Link} to="/trip-planner" variant="outline-light" size="lg">Plan Trip</Button>
                    </div>
                    <div className="mt-3">
                        <Button as={Link} to="/destinations" variant="info" size="lg">Find a Guide</Button>
                    </div>
                </Container>
            </div>

            {/* Features Section */}
            <Container className="my-5">
                <h2 className="text-center mb-5 fw-bold">Why TravelMate?</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm glass-card">
                            <Card.Body className="text-center">
                                <div className="display-4 text-warning mb-3">📍</div>
                                <Card.Title>Curated Destinations</Card.Title>
                                <Card.Text>Discover hidden gems and top-rated spots curated by travel experts.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm glass-card">
                            <Card.Body className="text-center">
                                <div className="display-4 text-warning mb-3">🤝</div>
                                <Card.Title>Verified Local Guides</Card.Title>
                                <Card.Text>Connect with locals who know the city better than anyone else.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm glass-card">
                            <Card.Body className="text-center">
                                <div className="display-4 text-warning mb-3">📝</div>
                                <Card.Title>Smart Trip Planner</Card.Title>
                                <Card.Text>Organize your itinerary, budget, and packing list in one place.</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Landing;
