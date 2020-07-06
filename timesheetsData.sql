INSERT INTO tsusers (email, fullname, createdAt, updatedAt)
VALUES ('sean@opennetworking.org', 'Sean Condon', NOW(), NOW()),
       ('bill@opennetworking.org', 'Bill Snow', NOW(), NOW()),
       ('ain@opennetworking.org', 'Ain Indermitte', NOW(), NOW());

INSERT INTO tsweeks (year, weekno, monthno, begin, end, createdAt, updatedAt)
VALUES ('2020', 23, 6, '2020-06-01', '2020-06-07', NOW(), NOW()),
       ('2020', 24, 6, '2020-06-08', '2020-06-14', NOW(), NOW()),
       ('2020', 25, 6, '2020-06-15', '2020-06-21', NOW(), NOW()),
       ('2020', 26, 6, '2020-06-22', '2020-06-28', NOW(), NOW()),
       ('2020', 27, 7, '2020-06-29', '2020-07-04', NOW(), NOW()),
       ('2020', 28, 7, '2020-07-05', '2020-07-11', NOW(), NOW()),
       ('2020', 29, 7, '2020-07-12', '2020-07-18', NOW(), NOW());

INSERT INTO tsdays (email, day, weekid, worked_mins, createdAt, updatedAt)
VALUES ('sean@opennetworking.org', '2020-06-01', 1, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-02', 1, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-03', 1, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-04', 1, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-05', 1, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-08', 2, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-09', 2, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-10', 2, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-11', 2, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-12', 2, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-15', 3, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-16', 3, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-17', 3, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-18', 3, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-19', 3, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-22', 4, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-23', 4, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-24', 4, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-25', 4, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-26', 4, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-29', 5, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-06-30', 5, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-01', 5, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-02', 5, 0, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-03', 5, 0, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-06', 6, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-07', 6, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-08', 6, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-09', 6, 480, NOW(), NOW()),
       ('sean@opennetworking.org', '2020-07-10', 6, 480, NOW(), NOW());

INSERT INTO tsweeklies (email, weekid, createdAt, updatedAt)
VALUES ('sean@opennetworking.org', 1, NOW(), NOW()),
       ('sean@opennetworking.org', 2, NOW(), NOW()),
       ('sean@opennetworking.org', 3, NOW(), NOW()),
       ('sean@opennetworking.org', 4, NOW(), NOW()),
       ('sean@opennetworking.org', 5, NOW(), NOW()),
       ('sean@opennetworking.org', 6, NOW(), NOW());
