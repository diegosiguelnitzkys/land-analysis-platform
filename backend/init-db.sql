CREATE TABLE IF NOT EXISTS land_parcels (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    size_acres NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_assessments (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES land_parcels(id),
    risk_type TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    risk_score NUMERIC, -- New: numerical score for risk level
    value_impact TEXT, -- New: calculated impact on value
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comparables (
    id SERIAL PRIMARY KEY,
    parcel_id INTEGER REFERENCES land_parcels(id),
    sale_price NUMERIC NOT NULL,
    sale_date DATE NOT NULL,
    distance_miles NUMERIC NOT NULL,
    property_type TEXT NOT NULL,
    price_per_acre NUMERIC, -- New: calculated price per acre
    adjusted_price_per_acre NUMERIC, -- New: price after adjustments
    distance_adjustment NUMERIC, -- New: distance-based adjustment factor
    time_adjustment NUMERIC -- New: time-based adjustment factor
);
