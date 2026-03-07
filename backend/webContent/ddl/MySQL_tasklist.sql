CREATE DATABASE IF NOT EXISTS tasklist;
USE tasklist;

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

    PRIMARY KEY (eno),
    FOREIGN KEY (dno) REFERENCES dept(dno)
)

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
    categories VARCHAR(255),

    FOREIGN KEY (assigned_to) REFERENCES employees(eno),
    FOREIGN KEY (categories) REFERENCES task_categories(cname)
)

CREATE TABLE IF NOT EXISTS task_categories (
    cname VARCHAR(50) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS dept(
    dno INT PRIMARY KEY AUTO_INCREMENT,
    dname VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS workson(
    eno INT,
    tno INT,
    PRIMARY KEY (eno, tno),
    FOREIGN KEY (eno) REFERENCES employees(eno),
    FOREIGN KEY (tno) REFERENCES task(tno)
);