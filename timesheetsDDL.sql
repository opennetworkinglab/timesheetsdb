CREATE DATABASE timesheets;
GRANT ALL PRIVILEGES ON timesheets.* TO scondon@localhost;
USE timesheets;

# Obsolete - run the application instead which will run create the database
# and populate it

CREATE TABLE tsusers (
    email char(50) primary key,
    fullname char(100),
    CONSTRAINT tsuser_fullname_uk UNIQUE KEY (fullname)
);

CREATE TABLE tsweek (
     weekid INT UNSIGNED PRIMARY KEY,
     year SMALLINT UNSIGNED,
     weekno SMALLINT UNSIGNED,
     month SMALLINT UNSIGNED,
     begin DATE,
     end DATE,
     CONSTRAINT tsweek_begin_uk UNIQUE KEY (begin),
     CONSTRAINT tsweek_end_uk UNIQUE KEY (end),
     CONSTRAINT tsweek_yrno_uk UNIQUE KEY (year, weekno)
);

CREATE TABLE tsweekly (
    email char(50),
    weekid INT UNSIGNED,
    document BLOB,
    signed TIMESTAMP,
    CONSTRAINT tsweekly_pk PRIMARY KEY (email, weekid),
    CONSTRAINT tsweekly_email_fk FOREIGN KEY (email) REFERENCES tsuser(email),
    CONSTRAINT tsweekly_weekid_fk FOREIGN KEY (weekid) REFERENCES tsweek(weekid)
);

CREATE TABLE tsrecords (
    email char(50),
    day date,
    weekid INT UNSIGNED NOT NULL,
    worked_mins SMALLINT UNSIGNED NOT NULL,
    ngpa_min SMALLINT UNSIGNED,
    admin_min SMALLINT UNSIGNED,
    fundr_min SMALLINT UNSIGNED,
    salesm_min SMALLINT UNSIGNED,
    other_min SMALLINT UNSIGNED,
    leavesick_min SMALLINT UNSIGNED,
    leavepto_min SMALLINT UNSIGNED,
    holiday_min SMALLINT UNSIGNED,
    timein1 TIME,
    timeout1 TIME,
    timein2 TIME,
    timeout2 TIME,
    reg_min SMALLINT UNSIGNED,
    ot_min SMALLINT UNSIGNED,
    CONSTRAINT tsrecords_pk PRIMARY KEY (email, day),
    CONSTRAINT tsrecords_email_fk FOREIGN KEY (email) REFERENCES tsuser(email),
    CONSTRAINT tsrecords_weekid_fk FOREIGN KEY (weekid) REFERENCES tsweek(weekid)
);
