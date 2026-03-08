CREATE DATABASE IF NOT EXISTS tasklist;
USE tasklist;

CREATE TABLE IF NOT EXISTS dept(
    dno INT PRIMARY KEY AUTO_INCREMENT,
    dname VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS task_categories (
    cname VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS dept_categories (
    dno INT NOT NULL,
    cname VARCHAR(50) NOT NULL,
    PRIMARY KEY (dno, cname),
    FOREIGN KEY (dno) REFERENCES dept(dno),
    FOREIGN KEY (cname) REFERENCES task_categories(cname)
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
    hired_date DATE NOT NULL,
    dno INT NOT NULL,
    FOREIGN KEY (dno) REFERENCES dept(dno)
);

CREATE TABLE IF NOT EXISTS task(
    tno INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    summary TEXT,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    due_date DATE,
    post_date DATE NOT NULL,
    ordering_access_date DATE NOT NULL,
    assigned_to INT,
    categories VARCHAR(50),
    CONSTRAINT chk_task_single_category CHECK (categories IS NULL OR categories NOT LIKE '%,%'),

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

INSERT INTO dept_categories (dno, cname) VALUES
(1, 'Returns'),
(1, 'Damaged'),
(2, 'Shipping'),
(3, 'Price Match'),
(3, 'Human Intervention'),
(4, 'Shipping'),
(4, 'Returns');

INSERT INTO employees (ename, email, epassword, phonenumber, bdate, salary, title, hired_date, dno) VALUES 
('Alice Smith', 'alice.smith@example.com', 'password123', '123-456-7890', '1985-06-15', 60000.00, 'Tier 1', '2020-01-15', 1), 
('Bob Johnson', 'bob.johnson@example.com', 'password123', '234-567-8901', '1990-07-20', 65000.00, 'Tier 2', '2019-03-10', 2), 
('Charlie Brown', 'charlie.brown@example.com', 'password123', '345-678-9012', '1988-09-25', 70000.00, 'Tier 1', '2021-06-05', 2),
('Cody Underline', 'cody.underline@example.com', 'password123', '345-678-6767', '1988-09-25', 80000.00, 'Tier 3', '2020-01-05', 2);

INSERT INTO task (email, name, summary, description, status, due_date, post_date, ordering_access_date, assigned_to, categories) VALUES 
('susy.smith@example.com', 'Process return for order #12345', 'Process the return for order #12345, which involves handling a defective product returned by the customer. Carefully review the customer\'s request, verify the condition and eligibility of the product for return, and ensure that the customer\'s issue is resolved in accordance with company policies. Prepare to issue the refund promptly once the return is approved.', 'Customer wants to return a defective product. Please process the return and issue a refund. The product appears to be malfunctioning, and the customer has provided all necessary receipts. Please review the case in detail, confirm product eligibility for return, initiate the refund process, and notify the customer once the return has been processed.', 'new', '2024-07-01', '2024-06-20', '2024-06-20', 1, 'Returns'),
('caleb.carter@example.com', 'Investigate delayed shipment for order #54321', 'Investigate the cause of the shipment delay for order #54321. Assess the current status of this shipment by examining tracking data and communicating with the shipping provider where appropriate. Ensure timely follow-up with the customer by providing the latest updates, and be prepared to discuss possible solutions or compensation if significant delay issues persist.', 'Customer reports that their order has not arrived on time. Please investigate the issue and provide an update. Check the tracking information for order #54321, contact the shipping provider if necessary, and communicate the latest status to the customer. If further delays are expected, offer compensation or alternative solutions as appropriate.', 'in-progress', '2024-07-05', '2024-06-18', '2024-06-19', 2, 'Shipping'),
('david.wilson@example.com', 'Resolve pricing discrepancy for order #67890', 'Resolve the pricing discrepancy for order #67890, where the customer reports a mismatch between the charged and advertised prices. Conduct a thorough review of the order details, applicable discounts, and promotion timelines to determine if an error occurred. Take immediate corrective action as needed, including issuing a refund or adjustment, and provide a detailed response to the customer.', 'Customer claims that the price charged does not match the advertised price. Please review and adjust accordingly. Verify the pricing at the time of order placement, compare to current promotional offers, and if a discrepancy is found, process a refund or price adjustment. Ensure to follow all internal pricing dispute resolution steps and inform the customer of the outcome.', 'delayed', '2024-07-10', '2024-06-22', '2024-06-22', 3, 'Price Match');

INSERT INTO workson (eno, tno) VALUES 
(1, 1), 
(2, 2), 
(3, 3);

