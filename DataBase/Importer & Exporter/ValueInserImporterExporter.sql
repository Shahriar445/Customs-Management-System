-- Insert into Importers
INSERT INTO Importers (name, address, contact_number, email) VALUES
('Importer One', '123 Importer St, Import City', '123-456-7890', 'importer1@example.com'),
('Importer Two', '456 Importer Ave, Import Town', '234-567-8901', 'importer2@example.com');

-- Insert into Products
INSERT INTO Products (name, description, hs_code, country_of_origin) VALUES
('Product A', 'Description for Product A', '0101.21', 'Country X'),
('Product B', 'Description for Product B', '0202.32', 'Country Y'),
('Product C', 'Description for Product C', '0303.43', 'Country Z');

-- Insert into Imports
INSERT INTO Imports (importer_id, product_id, quantity, value, import_date, port_of_entry, shipment_method) VALUES
(1, 1, 100, 5000.00, '2024-06-01', 'Port A', 'Air'),
(2, 2, 200, 10000.00, '2024-06-02', 'Port B', 'Sea'),
(1, 3, 150, 7500.00, '2024-06-03', 'Port C', 'Land');

-- Insert into Importer_Payments
INSERT INTO Importer_Payments (import_id, amount, payment_date, payment_method, status) VALUES
(1, 5000.00, '2024-06-05', 'Credit Card', 'Paid'),
(2, 10000.00, '2024-06-06', 'bKash', 'Paid'),
(3, 7500.00, '2024-06-07', 'Credit Card', 'Paid');

-- Insert into Import_Monitoring
INSERT INTO Import_Monitoring (import_id, status, remarks) VALUES
(1, 'Cleared', 'No issues during clearance'),
(2, 'Pending', 'Awaiting customs inspection'),
(3, 'In Transit', 'Shipment on the way to destination');

-- Insert into Exporters
INSERT INTO Exporters (name, address, contact_number, email) VALUES
('Exporter One', '789 Exporter St, Export City', '345-678-9012', 'exporter1@example.com'),
('Exporter Two', '012 Exporter Ave, Export Town', '456-789-0123', 'exporter2@example.com');

-- Insert into Exports
INSERT INTO Exports (exporter_id, product_id, quantity, value, export_date, port_of_departure, shipment_method) VALUES
(1, 1, 100, 5000.00, '2024-06-01', 'Port D', 'Air'),
(2, 2, 200, 10000.00, '2024-06-02', 'Port E', 'Sea'),
(1, 3, 150, 7500.00, '2024-06-03', 'Port F', 'Land');

-- Insert into Exporter_Payments
INSERT INTO Exporter_Payments (export_id, amount, payment_date, payment_method, status) VALUES
(1, 5000.00, '2024-06-05', 'Credit Card', 'Paid'),
(2, 10000.00, '2024-06-06', 'bKash', 'Paid'),
(3, 7500.00, '2024-06-07', 'Credit Card', 'Paid');

-- Insert into Export_Monitoring
INSERT INTO Export_Monitoring (export_id, status, remarks) VALUES
(1, 'Cleared', 'No issues during clearance'),
(2, 'Pending', 'Awaiting customs inspection'),
(3, 'In Transit', 'Shipment on the way to destination');
