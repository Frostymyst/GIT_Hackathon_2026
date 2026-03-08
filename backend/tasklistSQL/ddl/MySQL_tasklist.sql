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
('Cody Underline', 'cody.underline@example.com', 'password123', '345-678-6767', '1988-09-25', 80000.00, 'Tier 3', '2020-01-05', 2),
('Dana Hopper', 'dana.hopper@example.com', 'password456', '456-789-0123', '1992-12-12', 72000.00, 'Tier 2', '2022-05-14', 3),
('Emily Rose', 'emily.rose@example.com', 'password789', '567-890-1234', '1986-03-18', 68000.00, 'Tier 1', '2023-02-10', 4);

INSERT INTO task (email, name, summary, description, status, due_date, post_date, ordering_access_date, assigned_to, categories) VALUES
('susy.smith@example.com', 'Process return for order #12345', 'Process the return for order #12345, which involves handling a defective product returned by the customer. Carefully review the customer''s request, verify the condition and eligibility of the product for return, and ensure that the customer''s issue is resolved in accordance with company policies. Prepare to issue the refund promptly once the return is approved.', 'Customer wants to return a defective product. Please process the return and issue a refund. The product appears to be malfunctioning, and the customer has provided all necessary receipts. Please review the case in detail, confirm product eligibility for return, initiate the refund process, and notify the customer once the return has been processed.', 'in-progress', '2024-07-01', '2024-06-20', '2024-06-20', 1, 'Returns'),
('caleb.carter@example.com', 'Investigate delayed shipment for order #54321', 'Investigate the cause of the shipment delay for order #54321. Assess the current status of this shipment by examining tracking data and communicating with the shipping provider where appropriate. Ensure timely follow-up with the customer by providing the latest updates, and be prepared to discuss possible solutions or compensation if significant delay issues persist.', 'Customer reports that their order has not arrived on time. Please investigate the issue and provide an update. Check the tracking information for order #54321, contact the shipping provider if necessary, and communicate the latest status to the customer. If further delays are expected, offer compensation or alternative solutions as appropriate.', 'in-progress', '2024-07-05', '2024-06-18', '2024-06-19', 2, 'Shipping'),
('david.wilson@example.com', 'Resolve pricing discrepancy for order #67890', 'Resolve the pricing discrepancy for order #67890, where the customer reports a mismatch between the charged and advertised prices. Conduct a thorough review of the order details, applicable discounts, and promotion timelines to determine if an error occurred. Take immediate corrective action as needed, including issuing a refund or adjustment, and provide a detailed response to the customer.', 'Customer claims that the price charged does not match the advertised price. Please review and adjust accordingly. Verify the pricing at the time of order placement, compare to current promotional offers, and if a discrepancy is found, process a refund or price adjustment. Ensure to follow all internal pricing dispute resolution steps and inform the customer of the outcome.', 'delayed', '2024-07-10', '2024-06-22', '2024-06-22', 3, 'Price Match'),
('jane.doe@example.com', 'Investigate damaged item in shipment', 'Investigate claim of a damaged item received in shipping for order #88888.', 'Customer received a damaged item. Please arrange for a replacement and notify the warehouse.', 'new', '2024-07-02', '2024-06-23', '2024-06-23', 4, 'Damaged'),
('peter.chen@example.com', 'Human intervention requested for special order #24680', 'Special case requiring human review and intervention for order #24680.', 'Automated system could not process customer request for order #24680. Please manually review and assist.', 'waiting', '2024-07-07', '2024-06-24', '2024-06-24', 5, 'Human Intervention'),
('anita.sharma@example.com', 'Handle bulk return request for corporate customer', 'Bulk return processing for corporate client with several items returned, requires coordination with multiple departments.', 'Corporate customer has submitted a bulk return. Review items and ensure all are processed according to B2B return policy. Communicate resolution back to the client point of contact.', 'in-progress', '2024-07-12', '2024-06-25', '2024-06-25', 6, 'Returns'),
('mary.baker@example.com', 'Address expedited shipping complaint', 'Customer complaint about not receiving the expedited shipping service paid for.', 'Customer states order #55577 did not arrive expedited as paid. Investigate and escalate for potential late-delivery compensation.', 'new', '2024-07-04', '2024-06-21', '2024-06-21', 2, 'Shipping'),
('jon.snow@example.com', 'Correct human error in order entry', 'Order #99000 created with incorrect customer name and address, requires correction.', 'Manual correction required for customer details on order #99000. Contact customer for verification.', 'on-hold', '2024-07-11', '2024-06-26', '2024-06-26', 1, 'Human Intervention'),
('oliver.king@example.com', 'Order #55599: Price match request review', 'Review and approve or reject price match request submitted by customer for recent purchase.', 'Customer believes they are entitled to a lower price offered by a competitor. Validate claim and process as per policy.', 'in-progress', '2024-07-13', '2024-06-27', '2024-06-27', 3, 'Price Match'),
('sara.evans@example.com', 'Oversee filing of damaged product incident', 'Manage documentation and claims for serious product damage incident reported by shipper.', 'Shipper reported significant item damage during unloading. Complete internal incident report and coordinate claim.', 'waiting', '2024-07-08', '2024-06-28', '2024-06-28', 4, 'Damaged'),
('lucas.garcia@example.com', 'Urgent: Address bounced package', 'Shipment for order #12321 bounced back to warehouse, urgent customer follow-up required.', 'Shipment bounced due to incorrect address. Contact customer to confirm details and re-ship.', 'new', '2024-07-14', '2024-06-28', '2024-06-28', 2, 'Shipping'),
('wendy.tan@example.com', 'Rush return for VIP customer', 'VIP client needs immediate processing of large return for preferred status reasons.', 'Handle expedited processing of return for VIP under the relevant special policy. Notify customer upon completion.', 'in-progress', '2024-07-03', '2024-06-29', '2024-06-29', 1, 'Returns'),
('frank.lee@example.com', 'Human review needed for incomplete claim', 'LLM was unable to auto-classify incomplete customer claim. Manual attention required.', 'Review unusual support ticket flagged as ambiguous by LLM.', 'on-hold', '2024-07-15', '2024-07-01', '2024-07-01', 5, 'Human Intervention'),
('helen.gray@example.com', 'Shipping surcharge dispute', 'Customer disputes additional shipping surcharge for expedited delivery.', 'Contact shipping provider and confirm if surcharge was applied in error. Respond to customer and issue correction if needed.', 'new', '2024-07-09', '2024-07-01', '2024-07-01', 6, 'Shipping'),
('ian.green@example.com', 'Return: accessories missing from returned package', 'Check for missing accessories in returned order #99775.', 'Returned package for order #99775 is missing chargers. Reach out to customer for clarification.', 'investigating', '2024-07-16', '2024-07-02', '2024-07-02', 4, 'Returns'),
('felicia.white@example.com', 'Internal: Audit recent damaged goods claims', 'Perform internal audit of all damaged goods reported last month for compliance.', 'Gather all recent incidents of damaged goods and verify they were handled according to policy. Flag any inconsistencies.', 'new', '2024-07-17', '2024-07-02', '2024-07-02', 2, 'Damaged'),
('kyle.black@example.com', 'Double-check price on price match approval', 'Confirm price matched is correct before finalizing refund for order #33311.', 'Double-check competitor price screenshot and verify amount is correct before issuing refund.', 'waiting', '2024-07-18', '2024-07-03', '2024-07-03', 3, 'Price Match');

INSERT INTO workson (eno, tno) VALUES 
(1, 1), 
(2, 2), 
(3, 3);

