import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'traveler'
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData);
            // On success, redirect to OTP verification, passing email to pre-fill
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            setError(err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="p-4 shadow-lg glass-card" style={{ maxWidth: '450px', width: '100%' }}>
                <h2 className="text-center mb-4">Join TravelMate</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name="name" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>I am a...</Form.Label>
                        <Form.Select name="role" onChange={handleChange}>
                            <option value="traveler">Traveler</option>
                            <option value="guide">Guide</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="warning" type="submit" className="w-100">
                        Sign Up
                    </Button>
                </Form>
                <div className="text-center mt-3">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Signup;
