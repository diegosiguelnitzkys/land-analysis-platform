const express = require('express');
const cors = require('cors');
const { queries } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Create new parcel
app.post('/api/parcels', async (req, res) => {
    try {
        const { address, size_acres, comuna, region, land_use_type } = req.body;
        const newParcel = await queries.createParcel({ address, size_acres, comuna, region, land_use_type });
        res.status(201).json(newParcel);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create parcel', details: error.message });
    }
});

// Add comparable
app.post('/api/parcels/:id/comparables', async (req, res) => {
    try {
        const { sale_price, sale_date, distance_miles, property_type } = req.body;
        const parcel_id = req.params.id;

        const parcel = await queries.getParcelById(parcel_id);
        if (!parcel) return res.status(404).json({ error: 'Parcel not found' });

        const comparable = await queries.addComparable(parcel_id, {
            sale_price,
            sale_date,
            distance_miles,
            property_type,
            land_use_type: parcel.land_use_type
        });

        res.status(201).json(comparable);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comparable', details: error.message });
    }
});

// Get comparables for a parcel
app.get('/api/parcels/:id/comparables', async (req, res) => {
    try {
        const parcel_id = req.params.id;
        const parcel = await queries.getParcelById(parcel_id);
        if (!parcel) return res.status(404).json({ error: 'Parcel not found' });

        const comparables = await queries.getComparablesByLandUse(parcel_id, parcel.land_use_type);
        res.json(comparables);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comparables', details: error.message });
    }
});

// Add risk assessment
app.post('/api/parcels/:id/risks', async (req, res) => {
    try {
        const { risk_type, risk_level } = req.body;
        const parcel_id = req.params.id;

        if (risk_level < 0 || risk_level > 1) {
            return res.status(400).json({ error: 'Risk level must be between 0 and 1.' });
        }

        const risk = await queries.addRiskAssessment(parcel_id, risk_type, risk_level);
        res.status(201).json(risk);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add risk assessment', details: error.message });
    }
});

// Get risks for a parcel
app.get('/api/parcels/:id/risks', async (req, res) => {
    try {
        const parcel_id = req.params.id;
        const risks = await queries.getRisksForParcel(parcel_id);
        res.json(risks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch risks', details: error.message });
    }
});

// 🚀 **NEW: Get full analysis of a parcel (Fixing the issue)**
app.get('/api/parcels/:id/analysis', async (req, res) => {
    try {
        const parcel_id = req.params.id;
        const analysis = await queries.getParcelAnalysis(parcel_id);

        if (!analysis.parcel) {
            return res.status(404).json({ error: 'Parcel not found' });
        }

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch parcel analysis', details: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

