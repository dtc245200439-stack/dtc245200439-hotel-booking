CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    room_type VARCHAR(50) NOT NULL,
    price_per_night NUMERIC(12, 2) NOT NULL CHECK (price_per_night > 0),
    capacity INT NOT NULL CHECK (capacity > 0),
    available BOOLEAN NOT NULL DEFAULT TRUE
);


CREATE TABLE IF NOT EXISTS customers (
id SERIAL PRIMARY KEY,
full_name VARCHAR(150) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
phone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
id SERIAL PRIMARY KEY,
customer_id INT NOT NULL REFERENCES customers(id),
room_id INT NOT NULL REFERENCES rooms(id),
check_in DATE NOT NULL,
check_out DATE NOT NULL,
status VARCHAR(20) NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'confirmed', 'cancelled')),
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
CHECK (check_out > check_in)
);

INSERT INTO rooms (name, room_type, price_per_night, capacity)
VALUES
('P101', 'Standard', 500000, 2),
('P201', 'Deluxe', 900000, 3),
('P301', 'Suite', 1500000, 4)
ON CONFLICT (name) DO NOTHING;

INSERT INTO customers (full_name, email, phone)
VALUES
('Nguyen Van An', 'an@example.com', '0900000001'),
('Tran Thi Binh', 'binh@example.com', '0900000002')
ON CONFLICT (email) DO NOTHING;
