# Roles and Behaviors

While experimenting with Screeps, I found that it was useful to have creeps that performed specific jobs because I could customize the way their body was constructed to optimize them for that job. Later, I found that in order to perform a job, the creep would work on specific subtasks that had a specific goal. When the goal was complete, it would rotate to the next logical subtask. So, to make things more modular and understandable, I abstracted these as "roles" and "behaviors".

A creep's "role" is the job that it is designed to perform in the robot army. This determines the body that is created for it and the set of behaviors that it would perform. For example, a Harvester role will be spawned, navigate to an energy source, and harvest that energy source until it dies.

A "behavior" is the task or goal that the creep is working on at the present moment. A Harvester only has one behavior, it is assigned to an energy source and harvests from that energy source until it can't do it any more. I call this the Harvest behavior.

## Builder

### Behaviors

* Build - Navigate to the build target and build until complete

## Gatherer

### Behaviors

* Gather - Navigate to the energy target and collect it until full
* Deposit - Take the carried energy to a storage location and deposit carried energy until empty

## Harvester

### Behaviors

* Harvest - Harvest from the target until death
