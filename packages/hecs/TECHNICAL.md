# Technical Details

This document contains information on how some of the more complex pieces of the ECS are implemented and the reasons for doing so.

## Archetype IDs

The ID of each archetype is a fixed length String and each character in the string can be a `0` or a `1`. The index of each character corresponds with a single Component. You can see in `ComponentManager.js` that when registering a component, it is assigned an auto-incrementing ID for this reason. When the World is instantiated we use the number of registered components to generate a base ID of the same length all set to `0`'s.

ID's are used like this because they allow the world to perform extremely efficient archetype swaps whenever entity components change. For example, when an entity has a component removed we can easily swap the corresponding ID character for that component from `1` to `0` and we now know the id of the new archetype. Then all that needs to happen is the entity is moved from one archetype array to another. Blazing!

Bitmasks would be even more efficient than this but the problem is that bitmasks only offer support for 31 bits in JS. This could be expanded using a "BitArray" implementation but then you lose a lot of the performance you set out to gain in the first place.

## Query Performance + Archetypes

In order to support huge amounts of queries in an ECS (and to encourage stateless systems) its not feasible to loop through all related queries whenever an entity changes components. Because of this, we inverse the problem by using Archetypes in a similar way to Unity DOTS. Instead of constantly updating queries, we simply move the entity from one archetype array to another whenever they change.

By doing this we do inverse the problem and remove the constant need to loop through queries, check criteria and add/remove entities, but we introduce the need to maintain archetypes. Ironically, whenever a new archetype is discovered we need to create it, loop through queries and check their criteria too, and then add the archetype if its a match. The biggest difference here is that once an archetype is built and placed, it never needs to be checked again. In my testing most archetypes are discovered in the first few world frames, leaving the world to run extremely efficiently going forward.


## Tracking Modified Components

You can mark components as modified using `.modified()` and they can be tracked in queries using `Modified(Component)`. When components are modified they need to appear in queries for exactly one full cycle of systems starting from the system it was modified in and ending in the system before it in the next update. This way, all systems have a chance to react to the change. If you have four systems `A`, `B`, `C` and `D` and you modify a component in system `C`, then queries that match will track this change in the rest of `C`, `D`, and then in the next update in `A` and `B` too.

To support this, we increment system ticks each time one is updated. When a component is changed, we set `modifiedUntilSystemTick` to equal `currentSystemTick + numberOfSystems`. This leaves us with a super efficient math check to determine if a component is modified when traversing queries that use the `Modified()` rule.

## Query Array Traversal

When looping through the entities that match a query from within a system, internally we are actually looping through the archetypes that match the query rules and then looping through the entities that belong to each archetype. Calling `this.queries.active.forEach()` may look like a `Map` or `Array` call but is in fact a custom implementation for iterating through the archetypes in that query.

Additionally, we iterate through entities in each archetype in reverse. This allows you to change an entities archetype (thus removing it from the array you are iterating over) without the iteration counter breaking.