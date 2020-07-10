INSERT INTO tsusers (email, fullname, createdAt, updatedAt)
VALUES ('sean@opennetworking.org', 'Sean Condon', NOW(), NOW()),
       ('bill@opennetworking.org', 'Bill Snow', NOW(), NOW()),
       ('ain@opennetworking.org', 'Ain Indermitte', NOW(), NOW());

-- TsWeeks is populated by the application

INSERT INTO tsdays (email, day, weekid, worked_mins, createdAt, updatedAt)
VALUES ('sean@opennetworking.org', '2020-06-01', (SELECT id FROM tsweeks WHERE begin <= '2020-06-01' AND end > '2020-06-01'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-02', (SELECT id FROM tsweeks WHERE begin <= '2020-06-02' AND end >= '2020-06-02'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-03', (SELECT id FROM tsweeks WHERE begin <= '2020-06-03' AND end >= '2020-06-03'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-04', (SELECT id FROM tsweeks WHERE begin <= '2020-06-04' AND end >= '2020-06-04'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-05', (SELECT id FROM tsweeks WHERE begin <= '2020-06-05' AND end >= '2020-06-05'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-08', (SELECT id FROM tsweeks WHERE begin <= '2020-06-08' AND end >= '2020-06-08'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-09', (SELECT id FROM tsweeks WHERE begin <= '2020-06-09' AND end >= '2020-06-09'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-10', (SELECT id FROM tsweeks WHERE begin <= '2020-06-10' AND end >= '2020-06-10'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-11', (SELECT id FROM tsweeks WHERE begin <= '2020-06-11' AND end >= '2020-06-11'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-12', (SELECT id FROM tsweeks WHERE begin <= '2020-06-12' AND end >= '2020-06-12'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-15', (SELECT id FROM tsweeks WHERE begin <= '2020-06-15' AND end >= '2020-06-15'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-16', (SELECT id FROM tsweeks WHERE begin <= '2020-06-16' AND end >= '2020-06-16'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-17', (SELECT id FROM tsweeks WHERE begin <= '2020-06-17' AND end >= '2020-06-17'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-18', (SELECT id FROM tsweeks WHERE begin <= '2020-06-18' AND end >= '2020-06-18'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-19', (SELECT id FROM tsweeks WHERE begin <= '2020-06-19' AND end >= '2020-06-19'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-22', (SELECT id FROM tsweeks WHERE begin <= '2020-06-22' AND end >= '2020-06-22'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-23', (SELECT id FROM tsweeks WHERE begin <= '2020-06-23' AND end >= '2020-06-23'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-24', (SELECT id FROM tsweeks WHERE begin <= '2020-06-24' AND end >= '2020-06-24'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-25', (SELECT id FROM tsweeks WHERE begin <= '2020-06-25' AND end >= '2020-06-25'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-26', (SELECT id FROM tsweeks WHERE begin <= '2020-06-26' AND end >= '2020-06-26'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-29', (SELECT id FROM tsweeks WHERE begin <= '2020-06-29' AND end >= '2020-06-29'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-06-30', (SELECT id FROM tsweeks WHERE begin <= '2020-06-30' AND end >= '2020-06-30'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-07-01', (SELECT id FROM tsweeks WHERE begin <= '2020-07-01' AND end >= '2020-07-01'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-07-02', (SELECT id FROM tsweeks WHERE begin <= '2020-07-02' AND end >= '2020-07-02'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-07-03', (SELECT id FROM tsweeks WHERE begin <= '2020-07-03' AND end >= '2020-07-03'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-07-06', (SELECT id FROM tsweeks WHERE begin <= '2020-07-06' AND end >= '2020-07-06'), 480, NOW(), NOW()),
('sean@opennetworking.org', '2020-07-07', (SELECT id FROM tsweeks WHERE begin <= '2020-07-07' AND end >= '2020-07-07'), 480, NOW(), NOW());

INSERT INTO tsweeklies (email, weekid, createdAt, updatedAt)
VALUES ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin = '2020-06-01'), NOW(), NOW()),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin = '2020-06-08'), NOW(), NOW()),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin = '2020-06-15'), NOW(), NOW()),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin = '2020-06-22'), NOW(), NOW()),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin = '2020-06-29'), NOW(), NOW()),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin = '2020-07-06'), NOW(), NOW());
