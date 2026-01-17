import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOtp = () => {
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await verifyOtp(email, otp);
            if (res.success) {
                navigate(res.redirectUrl);
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="p-4 shadow-lg glass-card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Verify Email</h2>
                <p className="text-muted text-center">Enter the OTP sent to your email.</p>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>OTP</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100">
                        Verify
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default VerifyOtp;
