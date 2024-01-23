import { serial, integer, text, boolean, varchar, array, pgTable, oneToMany } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  is_bot: boolean('is_bot').notNull(),
  first_name: text('first_name').notNull(),
  username: varchar('username', { length: 256 }).notNull(),
  phone_number: text('phone_number').notNull(),
  language_code: varchar('language_code', { length: 2 }),
});

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  street: text('street'),
  is_station: boolean('is_station').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  start_location_id: integer('start_location_id').references(() => locations.id).notNull(),
  end_location_id: integer('end_location_id').references(() => locations.id).notNull(),
  price: integer('price').notNull(),
  distance: integer('distance').notNull(),
  duration: integer('duration').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
});

export const waypoints = pgTable('waypoints', {
  id: serial('id').primaryKey(),
  route_id: integer('route_id').references(() => routes.id).notNull(),
  location_id: integer('location_id').references(() => locations.id).notNull(),
});

export const users_saved_locations = pgTable('users_saved_locations', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  location_id: integer('location_id').references(() => locations.id).notNull(),
});

export const users_saved_routes = pgTable('users_saved_routes', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  route_id: integer('route_id').references(() => routes.id).notNull(),
});