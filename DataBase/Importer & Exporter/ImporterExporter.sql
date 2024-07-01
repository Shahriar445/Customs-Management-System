-- Importers Table
CREATE TABLE Importers (
    importer_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    contact_number NVARCHAR(20) NOT NULL,
    email NVARCHAR(100) NOT NULL
);

-- Products Table
CREATE TABLE Products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    hs_code NVARCHAR(50) NOT NULL,
    country_of_origin NVARCHAR(100) NOT NULL
);

-- Imports Table
CREATE TABLE Imports (
    import_id INT IDENTITY(1,1) PRIMARY KEY,
    importer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    value DECIMAL(18, 2) NOT NULL,
    import_date DATE NOT NULL,
    port_of_entry NVARCHAR(100) NOT NULL,
    shipment_method NVARCHAR(50) NOT NULL,
    FOREIGN KEY (importer_id) REFERENCES Importers(importer_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Importer Payments Table
CREATE TABLE Importer_Payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    import_id INT NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method NVARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    FOREIGN KEY (import_id) REFERENCES Imports(import_id)
);

-- Import Monitoring Table
CREATE TABLE Import_Monitoring (
    monitoring_id INT IDENTITY(1,1) PRIMARY KEY,
    import_id INT NOT NULL,
    status NVARCHAR(100) NOT NULL,
    remarks NVARCHAR(255),
    last_updated DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (import_id) REFERENCES Imports(import_id)
);

-- Exporters Table
CREATE TABLE Exporters (
    exporter_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    contact_number NVARCHAR(20) NOT NULL,
    email NVARCHAR(100) NOT NULL
);

-- Exports Table
CREATE TABLE Exports (
    export_id INT IDENTITY(1,1) PRIMARY KEY,
    exporter_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    value DECIMAL(18, 2) NOT NULL,
    export_date DATE NOT NULL,
    port_of_departure NVARCHAR(100) NOT NULL,
    shipment_method NVARCHAR(50) NOT NULL,
    FOREIGN KEY (exporter_id) REFERENCES Exporters(exporter_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Exporter Payments Table
CREATE TABLE Exporter_Payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    export_id INT NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method NVARCHAR(50) NOT NULL,
    status NVARCHAR(50) NOT NULL,
    FOREIGN KEY (export_id) REFERENCES Exports(export_id)
);

-- Export Monitoring Table
CREATE TABLE Export_Monitoring (
    monitoring_id INT IDENTITY(1,1) PRIMARY KEY,
    export_id INT NOT NULL,
    status NVARCHAR(100) NOT NULL,
    remarks NVARCHAR(255),
    last_updated DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (export_id) REFERENCES Exports(export_id)
);
