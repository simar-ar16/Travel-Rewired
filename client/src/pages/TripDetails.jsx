import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab, ProgressBar, Form, ListGroup, Spinner, InputGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TripDetails = () => {
    const { id } = useParams();
    const { api } = useAuth();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newBudgetItem, setNewBudgetItem] = useState({ category: '', amount: '' });
    const [newPackingItem, setNewPackingItem] = useState('');

    // Simple add day handler
    const handleAddDay = async () => {
        const title = prompt("Enter day title (e.g., 'City Tour'):");
        if (!title) return;

        try {
            // We need to know which day number to add. 
            // Logic: find max day and add 1, or just let backend handle if it pushes.
            // The backend logic viewed earlier was: trip.itinerary.push({ day, title, activities ... })
            // So we need to calculate 'day'
            const nextDay = trip.itinerary.length + 1;
            await api.post(`/trip-planner/${id}/itinerary`, {
                day: nextDay,
                title,
                activities: '' // Start empty
            });
            fetchTrip();
        } catch (err) {
            console.error(err);
            alert("Failed to add day");
        }
    };

    useEffect(() => {
        fetchTrip();
    }, [id]);

    const fetchTrip = async () => {
        try {
            const res = await api.get(`/trip-planner/${id}`);
            setTrip(res.data.trip);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBudget = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/trip-planner/${id}/budget`, newBudgetItem);
            setNewBudgetItem({ category: '', amount: '' });
            fetchTrip();
        } catch (err) { console.error(err); }
    };

    const handleAddPacking = async (e) => {
        e.preventDefault();
        try {
            // Check current logic if sending raw text or object
            await api.post(`/trip-planner/${id}/packing-list`, { item: newPackingItem });
            setNewPackingItem('');
            fetchTrip();
        } catch (err) { console.error(err); }
    };

    const handleCheckPacking = async (itemId) => {
        try {
            // Need to implement checking logic in backend or just update list locally if simple text
            // If backend handles individual item toggle:
            await api.patch(`/trip-planner/${id}/packing-list/${itemId}`);
            fetchTrip();
        } catch (err) { console.error(err); }
    };


    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="warning" /></div>;
    if (!trip) return <div>Trip not found</div>;

    const totalBudget = trip.budget.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="text-warning fw-bold mb-1">{trip.destination.name} Trip</h2>
                    <p className="text-muted mb-0">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <Button as={Link} to={`/destinations/${trip.destination._id}`} variant="info" className="me-2">Find Guide</Button>
                    <Button as={Link} to="/destinations" variant="outline-light">Back to Destinations</Button>
                </div>
            </div>

            <Tabs defaultActiveKey="itinerary" id="trip-tabs" className="mb-4 custom-tabs" justify>
                <Tab eventKey="itinerary" title="📅 Itinerary">
                    <Card className="glass-card text-white p-4">
                        <div className="d-flex justify-content-between mb-3">
                            <h4>Daily Plan</h4>
                            <Button size="sm" variant="success" onClick={handleAddDay}>+ Add Day</Button>
                        </div>
                        {trip.itinerary.length === 0 ? <p>No itinerary yet.</p> : (
                            trip.itinerary.map((day, idx) => (
                                <div key={idx} className="mb-3 p-3 border border-dark rounded bg-dark">
                                    <h5>Day {day.day}: {day.title}</h5>
                                    <ul>
                                        {day.activities.map((act, i) => <li key={i}>{act}</li>)}
                                    </ul>
                                </div>
                            ))
                        )}
                    </Card>
                </Tab>

                <Tab eventKey="budget" title="💰 Budget">
                    <Card className="glass-card text-white p-4">
                        <h4>Expense Tracker</h4>
                        <h2 className="display-4 text-warning">${totalBudget}</h2>

                        <Form onSubmit={handleAddBudget} className="my-4">
                            <InputGroup>
                                <Form.Control placeholder="Category (e.g. Flight)" value={newBudgetItem.category} onChange={e => setNewBudgetItem({ ...newBudgetItem, category: e.target.value })} />
                                <Form.Control type="number" placeholder="Amount" value={newBudgetItem.amount} onChange={e => setNewBudgetItem({ ...newBudgetItem, amount: e.target.value })} />
                                <Button variant="warning" type="submit">Add</Button>
                            </InputGroup>
                        </Form>

                        <ListGroup variant="flush">
                            {trip.budget.map((item, idx) => (
                                <ListGroup.Item key={idx} className="bg-transparent text-white d-flex justify-content-between">
                                    <span>{item.category}</span>
                                    <span>${item.amount}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Tab>

                <Tab eventKey="packing" title="🧳 Packing List">
                    <Card className="glass-card text-white p-4">
                        <h4>Packing List</h4>
                        <Form onSubmit={handleAddPacking} className="my-4">
                            <InputGroup>
                                <Form.Control placeholder="Item name" value={newPackingItem} onChange={e => setNewPackingItem(e.target.value)} />
                                <Button variant="warning" type="submit">Add Item</Button>
                            </InputGroup>
                        </Form>

                        {/* Assuming packingList is array of strings or objects {item: string, checked: boolean} */}
                        <ListGroup>
                            {trip.packingList.map((item, idx) => (
                                <ListGroup.Item key={idx} className="bg-dark text-white border-secondary">
                                    <Form.Check
                                        type="checkbox"
                                        label={typeof item === 'string' ? item : item.item}
                                        checked={item.checked}
                                        onChange={() => handleCheckPacking(item._id)}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default TripDetails;
