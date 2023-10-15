
DROP TABLE IF EXISTS [movies];
DROP TABLE IF EXISTS [bad_guys];
DROP TABLE IF EXISTS [quotes];

DROP TABLE IF EXISTS [characters];
DROP TABLE IF EXISTS [lovers];


CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT,     released INTEGER,     sequel_id INTEGER);
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Philosopher's Stone", 2001, 2); 
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Chamber of Secrets", 2002, 3); 
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Prisoner of Azkaban", 2004, 4); 
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Goblet of Fire", 2005, 5); 
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Order of the Phoenix", 2007, 6); 
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Half-Blood Prince", 2009, 7); 
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Deathly Hallows - Part 1", 2010, 8); 
INSERT INTO movies (title, released, sequel_id) VALUES ("Harry Potter and the Deathly Hallows - Part 2", 2011, NULL);


CREATE TABLE bad_guys (id INTEGER PRIMARY KEY, villain_name TEXT);
INSERT INTO bad_guys (villain_name) VALUES ("Professor Quirrell");
INSERT INTO bad_guys (villain_name) VALUES ("Gilderoy Lockhart");
INSERT INTO bad_guys (villain_name) VALUES ("Pettigrew"); 
INSERT INTO bad_guys (villain_name) VALUES ("Lord Voldemort");
INSERT INTO bad_guys (villain_name) VALUES ("Dolores Umbridge");
INSERT INTO bad_guys (villain_name) VALUES ("Draco Malfoy");
INSERT INTO bad_guys (villain_name) VALUES ("Lord Voldemort"); 
INSERT INTO bad_guys (villain_name) VALUES ("Lord Voldemort");


CREATE TABLE quotes  (id INTEGER PRIMARY KEY, quote TEXT, title TEXT);
INSERT INTO quotes (quote, title) VALUES ("You're a wizard harry", "Harry Potter and the Philosopher's Stone");
INSERT INTO quotes (quote, title) VALUES ("I don't go looking for trouble. Trouble usually finds me", "Harry Potter and the Prisoner of Azkaban");
INSERT INTO quotes (quote, title) VALUES ("Killing is not so easy as the innocent believe", "Harry Potter and the Half-Blood Prince");

CREATE TABLE characters  (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO characters (name) VALUES ("Harry Potter");
INSERT INTO characters (name) VALUES ("Hermione Granger");
INSERT INTO characters (name) VALUES ("Ron Wisley");
INSERT INTO characters (name) VALUES ("Ginny Weasley");
INSERT INTO characters (name) VALUES ("Neville Londubat");
INSERT INTO characters (name) VALUES ("Luna Lovegood");

CREATE TABLE lovers  (id INTEGER PRIMARY KEY, id_lover INTEGER);
INSERT INTO lovers (id_lover) VALUES (4);
INSERT INTO lovers (id_lover) VALUES (3);
INSERT INTO lovers (id_lover) VALUES (2);
INSERT INTO lovers (id_lover) VALUES (1);
INSERT INTO lovers (id_lover) VALUES (6);
INSERT INTO lovers (id_lover) VALUES (5);