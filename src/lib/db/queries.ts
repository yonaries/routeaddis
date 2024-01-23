import { eq, lt, gte, ne } from 'drizzle-orm';
import { db, supabase } from './index'
import { users, routes, locations, waypoints, users_saved_locations, users_saved_routes } from './schema'
import 'dotenv/config'; 

export async function allUsers() {
  return await db.select().from(users);
}

export type NewUser = typeof users.$inferInsert;

export async function createUser(user: NewUser): Promise<void> {
  await db.insert(users).values(user).execute();
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id));
}

export async function getUserSavedRoutesByUserId(id: string) {
  return await db.select().from(users_saved_routes).where(eq(users_saved_routes.user_id, id));
}

export async function getUserSavedLocationsByUserId(id: string) {
  return await db.select().from(users_saved_locations).where(eq(users_saved_locations.user_id, id));
}

export async function getRoutes() { 
  return await db.query.routes.findMany({
    with: {
      waypoints: true,
    },
  });
}

export async function searchLocation(place: string) {
  const { data, error } = await supabase.from('locations').select().textSearch('name', `${place}`)
  return data;
}