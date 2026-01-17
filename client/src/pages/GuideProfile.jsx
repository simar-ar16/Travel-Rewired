import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const GuideProfile = () => {
    const { id } = useParams();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                // Assuming backend has a public endpoint to get guide by IDs
                const res = await axios.get(`http://localhost:3000/guide/${id}`);
                setGuide(res.data.guide);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGuide();
    }, [id]);

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;
    if (!guide) return <div className="text-center mt-5">Guide not found</div>;

    return (
        <Container className="py-5">
            <Card className="glass-card text-white p-4">
                <Row className="align-items-center">
                    <Col md={3} className="text-center">
                        <img src={guide.user.profileImage || "https://via.placeholder.com/150"} alt="Profile"
                            className="rounded-circle mb-3" style={{ width: 150, height: 150, objectFit: 'cover', border: '3px solid #ffc107' }} />
                    </Col>
                    <Col md={9}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h2 className="fw-bold">{guide.user.name} <Badge bg="success">Verified Guide</Badge></h2>
                                <p className="text-light fs-5">📍 {guide.location}</p>
                            </div>
                            <div className="text-end">
                                <h3 className="text-warning mb-0">${guide.pricePerHour}/hr</h3>
                                <small>Per Group</small>
                            </div>
                        </div>

                        <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

                        <h5>About Me</h5>
                        <p>{guide.experience}</p>

                        <h5>Languages</h5>
                        <p>{guide.languages}</p>

                        <div className="mt-4">
                            <Button as={Link} to={`/book-guide/${guide._id}`} variant="warning" size="lg" className="px-5">
                                Book Now
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Reviews Section Placeholder */}
            <div className="mt-5">
                <h3 className="text-warning">Reviews</h3>
                <p className="text-muted">No reviews yet.</p>
            </div>
        </Container>
    );
};

export default GuideProfile;
