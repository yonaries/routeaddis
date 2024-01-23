> :warning: This project is still under development: it's made for A2SV telegram bot learning phase

## Route Addis - Taxi Route Assistant for Addis Ababa! 🚕

Have you ever found it challenging to navigate through the expansive city of Addis Ababa without your own car? Google maps is great for those who own a car, but the majority of Addis Ababa's population does not typcally own a car, rather relies on taxis and buses for commuting. Since also addis ababa is wide it's obvious it's ompossible to know all the places and how to get there.

This project is made to addresses this gap by creating a user-friendly bot designed specifically to assist you in finding the best taxi route to your destination. With Addis Ababa being a vast city, it's unrealistic to expect everyone to know every corner and route.

## How it work
Route Addis is filled with locations of taxi/bus stations, popular local places and officially assigned taxi routes with their price, distance, duration and waypoints. we then build a graph using this data to figure out the shortest path using djikistra algorithm. then we create a navigation using google maps url.  lastly we show the best route for the user in natural language along with google maps navigation.

## Tech Stack
- Typescript
- [Grammy - Telegram Bot Framework](https://grammy.dev)
- Drizzle ORM
- Postgres
- Winston for logging

## Milestones
- [x] Database Integration
- [x] User Registeration 
- [ ] Finding Routes
   - [x] Recieve inputs from user
    - [ ] Djikstra implimentation
    - [ ] Natural Language response
- [ ] Nearby station
- [x] About Info
