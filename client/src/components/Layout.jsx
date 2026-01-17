import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <Navbar expand="lg" variant="dark" className="glass-navbar sticky-top">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-warning">
                        🌍 TravelMate
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/destinations">Destinations</Nav.Link>

                            {!user ? (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Button as={Link} to="/signup" variant="warning" size="sm" className="ms-2">
                                        Sign Up
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/trip-planner">Trip Planner</Nav.Link>
                                    {user.role === 'guide' && <Nav.Link as={Link} to="/guide/home">Dashboard</Nav.Link>}

                                    <Dropdown align="end" className="ms-3">
                                        <Dropdown.Toggle variant="transparent" className="text-light p-0 border-0">
                                            {user.profileImage ? (
                                                <img src={user.profileImage} alt="Profile" className="rounded-circle" style={{ width: 30, height: 30 }} />
                                            ) : (<FaUserCircle size={28} />)}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="glass-dropdown">
                                            <Dropdown.Item as={Link} to="/user/profile">Profile</Dropdown.Item>
                                            {user.role === 'guide' && <Dropdown.Item as={Link} to="/guide/profile">Guide Profile</Dropdown.Item>}
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <main style={{ minHeight: '80vh' }}>
                <Outlet />
            </main>

            <footer className="footer mt-auto py-3 bg-dark text-white text-center">
                <Container>
                    <span className="text-muted">© 2024 TravelMate. All rights reserved.</span>
                </Container>
            </footer>
        </>
    );
};

export default Layout;
