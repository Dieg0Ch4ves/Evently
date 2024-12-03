-- V1__baseline.sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE event (
  id BIGINT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date_event TIMESTAMP NOT NULL,
  local_event VARCHAR(255),
  capacity BIGINT,
  image BYTEA,
  created_date TIMESTAMP NOT NULL
);

CREATE TABLE events_registrations (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id BIGINT NOT NULL,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE
);
