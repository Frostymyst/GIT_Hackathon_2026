CREATE DATABASE IF NOT EXISTS tasklist;
USE tasklist;

CREATE TABLE IF NOT EXISTS dept(
    dno INT PRIMARY KEY AUTO_INCREMENT,
    dname VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS task_categories (
    cname VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS employees(
    eno INT PRIMARY KEY AUTO_INCREMENT,
    ename VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    epassword VARCHAR(255) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL,
    bdate DATE NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    title VARCHAR(50) NOT NULL,
    dno INT NOT NULL,
    FOREIGN KEY (dno) REFERENCES dept(dno)
);

CREATE TABLE IF NOT EXISTS task(
    tno INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    summary TEXT,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL,
    post_date DATE NOT NULL,
    last_accessed_date DATE NOT NULL,
    assigned_to INT,
    categories VARCHAR(50),

    FOREIGN KEY (assigned_to) REFERENCES employees(eno),
    FOREIGN KEY (categories) REFERENCES task_categories(cname)
);

CREATE TABLE IF NOT EXISTS workson(
    eno INT,
    tno INT,
    PRIMARY KEY (eno, tno),
    FOREIGN KEY (eno) REFERENCES employees(eno),
    FOREIGN KEY (tno) REFERENCES task(tno)
);

INSERT INTO dept (dname) VALUES ('Returns'), ('Shipping'), ('Customer Service'), ('Inventory Management');

INSERT INTO task_categories (cname) VALUES ('Shipping'), ('Returns'), ('Damaged'), ('Price Match'), ('Human Intervention');

INSERT INTO employees (ename, email, epassword, phonenumber, bdate, salary, title, dno) VALUES 
('Alice Smith', 'alice.smith@example.com', 'password123', '123-456-7890', '1985-06-15', 60000.00, 'Tier 1', 1), 
('Bob Johnson', 'bob.johnson@example.com', 'password123', '234-567-8901', '1990-07-20', 65000.00, 'Tier 2', 2), 
('Charlie Brown', 'charlie.brown@example.com', 'password123', '345-678-9012', '1988-09-25', 70000.00, 'Tier 1', 2);

INSERT INTO task (email, summary, description, status, due_date, post_date, last_accessed_date, assigned_to, categories) VALUES 
('susy.smith@example.com', 'Process return for order #12345', 'Customer wants to return a defective product. Please process the return and issue a refund.', 'new', '2024-07-01', '2024-06-20', '2024-06-20', 1, 'Returns'),
('caleb.carter@example.com', 'Investigate delayed shipment for order #54321', 'Customer reports that their order has not arrived on time. Please investigate the issue and provide an update.', 'in-progress', '2024-07-05', '2024-06-18', '2024-06-19', 2, 'Shipping'),
('david.wilson@example.com', 'Resolve pricing discrepancy for order #67890', 'Customer claims that the price charged does not match the advertised price. Please review and adjust accordingly.', 'delayed', '2024-07-10', '2024-06-22', '2024-06-22', 3, 'Price Match');

INSERT INTO workson (eno, tno) VALUES 
(1, 1), 
(2, 2), 
(3, 3);