# Features

## Foreman

The foreman is the object that oversees everything. It takes care of the smooth running of the system at a high level. It handles:

* Cleaning up memory for dead objects
* For each room:
    * Spawning new creeps
    * Placement and maintenance of roads
    * Placement of extensions

## Jobs system

The first work distribution system the robot army had was where the individual creeps found their own tasks. Unfortunately, because they all use the same criteria, there is often overlap in what they choose. This wastes a lot of time where multiple creeps are all traveling to the same job location, but only one of them can complete it. This wastes the time of the creeps that are traveling in a direction of work they aren't going to do.

The new idea is to have a central list of jobs that must be completed so that creeps can assign themselves tasks that don't overlap. A job is a task that fulfills a "need" that an object has. For example, a spawn might need energy, a creep might need to be healed, or a tower might need to be constructed. A single object can have multiple needs at the same time but can only have one need of a given type.

Needs are fulfilled by other objects in the robot army, whether objects in the game world such as creeps or structures, or objects in the AI system itself like the `Foreman` or `RoomPlanner` objects. The job system must track the following information:

* What object has a need
* What the object needs
* What object is assigned, if any, to fulfill that need
* When the need was created (allows for reporting based on age, among other things)

Because we want to keep unfulfilled needs in a specific order by age or priority, we store the jobs state between ticks in `Memory`.

### Workflow

1. Deserialize jobs state
1. Visit all objects by type (see: `Game.constructionSites`, `Game.creeps`, `Game.structures`, etc)
    1. Check current needs
    1. Remove completed needs
    1. Remove needs of destroyed or unavailable objects
    1. Remove assignments of destroyed or unavailable objects
    1. Add new needs
1. Visit all assignable objects by room
    1. Allow them to assign themselves to needs
1. Serialize jobs state

### Serialization

The serialized `Memory` storage structure looks like this:

```javascript
{
  needs: {
    // An extension needs energy and repair
    "5d4bbc0706b55c2b2440218c": {
      "resource.energy": {
        // A creep has been assigned to deliver the energy
        assignee: "5d52d30fdc8788211b610e3c"
      },
      // Nothing is assigned yet to perform the repair
      repair: {}
    },
    // A constructed wall needs repair
    "5d50b71d8fef3a63886e6bdc": {
      repair: {}
    },
    // A room `E23N3` needs a builder creep spawned
    "E23N3": {
      "creep.builder": {
        // A spawn point has been assigned to spawn the creep
        assignee: "5d499c31ec5de17406d26d35"
      }
    }
  }
}
```
