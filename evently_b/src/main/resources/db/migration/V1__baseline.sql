CREATE SCHEMA IF NOT EXISTS public;

-- V1__baseline.sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE public.event (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  date_event TIMESTAMP,
  local_event VARCHAR(255),
  capacity BIGINT,
  image BYTEA,
  created_date TIMESTAMP,
  created_by UUID NOT NULL, -- Declarar a coluna antes de definir a chave estrangeira
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE TABLE public.events_registrations (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  event_id BIGINT NOT NULL,
  registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE,
  CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES public.event (id) ON DELETE CASCADE
);
