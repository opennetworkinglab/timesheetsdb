INSERT INTO tsusers (email, first_name, last_name, supervisor_email, darpa_allocation_pct, is_supervisor, is_active)
VALUES ('sean@opennetworking.org', 'Sean', 'Condon', 'ain@opennetworking.org', 100, false, true),
       ('bill@opennetworking.org', 'Bill', 'Snow', 'ain@opennetworking.org', 50, true, true),
       ('ain@opennetworking.org', 'Ain', 'Indermitte', 'bill@opennetworking.org', 100, true, true),
       ('valdar@opennetworking.org', 'Valdar', 'Rudman', 'ain@opennetworking.org', 0, false, false);

-- TsWeeks is populated by the application

INSERT INTO tsdays (email, day, week_id, time_name, minutes)
VALUES ('sean@opennetworking.org', '2020-08-31', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-01', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-02', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-03', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-04', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-07', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-08', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-09', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-10', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-11', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-14', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-15', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-16', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-17', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-18', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-21', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-22', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-23', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-24', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-25', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-28', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-29', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-09-30', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-10-01', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29'), 0, 480, 0, 0, 0),
('sean@opennetworking.org', '2020-10-02', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29'), 0, 480, 0, 0, 0),
('sean@opennetworking.org', '2020-10-05', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-10-05' AND '2020-10-06'),480, 0, 0, 0, 0),
('sean@opennetworking.org', '2020-10-06', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-10-05' AND '2020-10-06'),480, 0, 0, 0, 0);

INSERT INTO tsweekly (ts_user_email, week_id, user_signed, admin_signed, preview, document)
VALUES ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01'), '2020-09-10T12:00:00', '2020-09-11T10:00:00', 'preview url1', 'document url1'),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08'), '2020-09-17T11:00:00', null, 'preview url2', 'document url2'),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15'), '2020-09-21T11:08:00', null, 'preview url3', 'document url3'),
       ('sean@opennetworking.org', (SELECT id FROM tsweeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22'), '2020-09-28T11:10:00', null, 'preview url4', 'document url4');

INSERT INTO times(name, minutes)
VALUES('Sick', 100);