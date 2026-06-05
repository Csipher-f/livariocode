-- Add rent_period column to properties table
create type public.rent_period as enum ('monthly', 'six_months', 'yearly');

alter table public.properties
add column rent_period public.rent_period not null default 'yearly';
