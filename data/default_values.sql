INSERT INTO parking_types 
  (code, name, first_3hrs_fee, succeeding_hrs_fee, exceed_24hrs_fee)
VALUES 
  ('SP', 'Small parking', 40, 20, 5000),
  ('MP', 'Medium parking', 40, 60, 5000),
  ('LP', 'Large parking', 40, 100, 5000);

INSERT INTO parking_entrances (name)
VALUES ('Entrance 1'), ('Entrance 2'), ('Entrance 3');

INSERT INTO parking_spots (parking_type_id)
VALUES ('1'), ('2'), ('3'), ('1');

INSERT INTO parking_spot_entrances 
  (parking_spot_id, parking_entrance_id, distance)
VALUES 
  (1, 1, 5),
  (1, 2, 4),
  (1, 3, 2),
  (2, 1, 1),
  (2, 2, 3),
  (2, 3, 2),
  (3, 1, 10),
  (3, 2, 7),
  (3, 3, 2),
  (4, 1, 3),
  (4, 2, 5),
  (4, 3, 2);

INSERT INTO vehicle_types (code, name) 
VALUES ('S', 'Small'), ('M', 'Medium'), ('L', 'Large');
