
-- weeks and projects tables are populated through the application
-- The generated projects are shared projects. Add projects
INSERT INTO projects(name, priority)
VALUES ('HC001', 2),
       ('Darpa DK9867', 2);

-- To populate user table
INSERT INTO users(email, first_name, last_name, supervisor_email, darpa_allocation_pct, is_supervisor, is_active)
VALUES ('sean@opennetworking.org', 'Sean', 'Condon', 'ain@opennetworking.org', 100, false, true),
       ('bill@opennetworking.org', 'Bill', 'Snow', 'ain@opennetworking.org', 50, true, true),
       ('ain@opennetworking.org', 'Ain', 'Indermitte', 'bill@opennetworking.org', 100, true, true),
       ('valdar@opennetworking.org', 'Valdar', 'Rudman', 'ain@opennetworking.org', 0, false, false);

-- user projects
INSERT INTO user_projects(user_email, project_name)
VALUES ('sean@opennetworking.org', 'Sick'),
('sean@opennetworking.org', 'Holiday'),
('sean@opennetworking.org', 'PTO'),
('sean@opennetworking.org', 'G_A'),
('sean@opennetworking.org', 'IR_D');

-- days
INSERT INTO days (day_user_email, day, week_id)
VALUES ('sean@opennetworking.org', '2020-08-31', (SELECT id FROM weeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01')),
('sean@opennetworking.org', '2020-09-01', (SELECT id FROM weeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01')),
('sean@opennetworking.org', '2020-09-02', (SELECT id FROM weeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01')),
('sean@opennetworking.org', '2020-09-03', (SELECT id FROM weeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01')),
('sean@opennetworking.org', '2020-09-04', (SELECT id FROM weeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01')),
('sean@opennetworking.org', '2020-09-07', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08')),
('sean@opennetworking.org', '2020-09-08', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08')),
('sean@opennetworking.org', '2020-09-09', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08')),
('sean@opennetworking.org', '2020-09-10', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08')),
('sean@opennetworking.org', '2020-09-11', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08')),
('sean@opennetworking.org', '2020-09-14', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15')),
('sean@opennetworking.org', '2020-09-15', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15')),
('sean@opennetworking.org', '2020-09-16', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15')),
('sean@opennetworking.org', '2020-09-17', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15')),
('sean@opennetworking.org', '2020-09-18', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15')),
('sean@opennetworking.org', '2020-09-21', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22')),
('sean@opennetworking.org', '2020-09-22', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22')),
('sean@opennetworking.org', '2020-09-23', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22')),
('sean@opennetworking.org', '2020-09-24', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22')),
('sean@opennetworking.org', '2020-09-25', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22')),
('sean@opennetworking.org', '2020-09-28', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29')),
('sean@opennetworking.org', '2020-09-29', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29')),
('sean@opennetworking.org', '2020-09-30', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29')),
('sean@opennetworking.org', '2020-10-01', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29')),
('sean@opennetworking.org', '2020-10-02', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-28' AND '2020-09-29')),
('sean@opennetworking.org', '2020-10-05', (SELECT id FROM weeks WHERE begin BETWEEN '2020-10-05' AND '2020-10-06')),
('sean@opennetworking.org', '2020-10-06', (SELECT id FROM weeks WHERE begin BETWEEN '2020-10-05' AND '2020-10-06'));

-- Times
INSERT INTO times(name, minutes, day_id)
VALUES ('Sick', 15, (SELECT id FROM day WHERE day_user_email='sean@opennetworking.org' AND day = '2020-09-02'),
('Holiday', 15, (SELECT id FROM day WHERE day_user_email='sean@opennetworking.org' AND day = '2020-09-02'),
('PTO', 15, (SELECT id FROM day WHERE day_user_email='sean@opennetworking.org' AND day = '2020-09-02'),
('G_A', 15, (SELECT id FROM day WHERE day_user_email='sean@opennetworking.org' AND day = '2020-09-02'),
('IR_D', 15, (SELECT id FROM day WHERE day_user_email='sean@opennetworking.org' AND day = '2020-09-02'));

-- weeklies
INSERT INTO weeklies (weekly_user_email, week_id, document, preview, user_signed, admin_signed)
VALUES ('sean@opennetworking.org', (SELECT id FROM weeks WHERE begin BETWEEN '2020-08-31' AND '2020-09-01'), 'document_url', 'preview_url', 'Envelop_id', true),
       ('sean@opennetworking.org', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-07' AND '2020-09-08'), 'document_url', 'preview_url', 'Envelop_id', true),
       ('sean@opennetworking.org', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-14' AND '2020-09-15'), 'document_url', 'preview_url', 'Envelop_id', false),
       ('sean@opennetworking.org', (SELECT id FROM weeks WHERE begin BETWEEN '2020-09-21' AND '2020-09-22'), 'document_url', 'preview_url', 'Envelop_id', false);