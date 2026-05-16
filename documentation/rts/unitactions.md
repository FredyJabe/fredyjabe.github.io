# Unit Actions DSL

This document describes the unit `actions` mini-language and the currently available runtime behavior.

## File Layout

- Unit definition files are loaded from `<modRoot>/units/**/*.yaml`.
- Each unit file can define one or more units.
- Each root key is the unit ID.

Example with multiple root nodes in one file:

```yaml
worker:
  size: 1
  actions:
    - damage{value=1} ~onTimer:1

tank:
  size: 16
  actions:
    - action{action=emergencyBlink} ~onTimer:1
```

## Format

Each entry in `<unitId>.actions` is a string line:

`action{param=value;otherparam=value} @target ?condition{param=value} ~interaction`

All sections after `action` are optional.

## Actions

| Action | Syntax | Status | Notes |
|---|---|---|---|
| Damage | `damage{value=<float>}` | Implemented | Shield absorbs first; armor reduces remaining health damage with minimum 1. |
| Teleport | `teleport @location{x=<float>;y=<float>}` | Implemented | Destination is taken from `@location{...}`. |
| Build | `build{...}` | Parsed only | Recognized by parser/runtime dispatch but not executed. |
| Custom Action Call | `action{action=<name>}` | Implemented | Executes named custom action from action files. |
| Transform | `transform{unit=<unitId>}` | Implemented | Replaces unit definition; keeps health/shield/energy percentages. |
| Create Unit | `createUnit{unit=<unitId>;amount=<int>}` | Implemented | Queues creation after target unit's `build.buildTime`. |
| Kill | `kill` | Implemented | Sets target unit health to 0. |
| Remove | `remove` | Implemented | Removes unit instantly without `~onDeath`. |
| Set Unit Stat | `setUnitStat{stat=<statName>;value=<float>}` | Implemented | Supports `health`, `maxhealth`, `shield`, `maxshield`, `energy`, `maxenergy`, `armor`. |
| Add Tag | `addTag{tag=<tagId>}` | Implemented | Adds tag to target unit. |
| Remove Tag | `removeTag{tag=<tagId>}` | Implemented | Removes tag from target unit. |
| Set Upgrade Level | `setUpgradeLevel{name=<upgradeName>;level=<int>}` | Implemented | Sets player's upgrade level; creates entry if missing. |
| Send Signal | `sendSignal{signal=<signalName>}` | Implemented | Broadcasts signal to all units and can trigger `~onSignal{signal=...}`. |
| Move Order | `moveOrder @location{x=<float>;y=<float>}` | Implemented | Orders unit to move to target location and triggers `~onMoveOrder`. |
| Heal | `heal{...}` | Planned | Not implemented yet. |
| Shield | `shield{...}` | Planned | Not implemented yet. |
| Buff | `buff{...}` | Planned | Not implemented yet. |
| Debuff | `debuff{...}` | Planned | Not implemented yet. |
| Summon | `summon{...}` | Planned | Not implemented yet. |
| Repair | `repair{...}` | Planned | Not implemented yet. |
| Harvest | `harvest{...}` | Planned | Not implemented yet. |
| Move | `move{...}` | Planned | Not implemented yet. |
| Attack | `attack{...}` | Planned | Not implemented yet. |
| Cast | `cast{...}` | Planned | Not implemented yet. |

## Conditions

| Condition | Syntax | Status | Notes |
|---|---|---|---|
| Compare | `compare{stat=<name>;value=<float>;compare=<mode>}` | Implemented | Modes: `atleast`, `atmost`, `equal`, `greater`, `less`. Stats: `health`, `maxhealth`, `shield`, `maxshield`, `energy`, `maxenergy`, `armor`. |
| Has Tag | `hasTag{tag=<tagId>}` | Implemented | True when acting unit contains tag. |
| Target Has Tag | `targetHasTag{tag=<tagId>}` | Implemented | Checks selected target unit tag; currently resolves to self/owner until full target routing exists. |
| Has Resources | `hasResources{resource=<resourceId>;amount=<float>}` | Implemented | Checks owner player's resource pool for at least amount. |
| Cooldown Ready | `cooldownReady{action=<actionId>}` | Implemented | True when action cooldown is not active on unit. |
| Is Visible | `isVisible` | Implemented | True when unit is visible. |
| Is Hidden | `isHidden` | Implemented | True when unit is hidden/invisible. |
| Has Upgrade Level | `hasUpgradeLevel{name=<upgradeName>;level=<int>}` | Implemented | False by default when upgrade does not exist. |

## Targets

| Target | Syntax | Status | Notes |
|---|---|---|---|
| Self | `@self` | Defined | Means the unit that executes the action. |
| Target | `@target` | Defined | Should show a select-target cursor to the player. |
| Area | `@area{radius=<float>}` | Defined | Should show an effect-area circle at cursor; supports `radius`. |
| Location | `@location{x=<float>;y=<float>}` | Partially implemented | Should show a select-location cursor; currently consumed by `teleport`. |
| Ally | `@ally` | Planned | Not implemented yet. |
| Enemy | `@enemy` | Planned | Not implemented yet. |
| Owner | `@owner` | Planned | Not implemented yet. |

Current implementation note:
- Runtime currently applies action effects to the action owner unit.
- `teleport` currently consumes coordinates from `@location{x=<float>;y=<float>}`.

## Triggers

| Trigger | Syntax | Status | Notes |
|---|---|---|---|
| Timer (tick) | `~onTimer` | Implemented | Fires every host simulation tick. |
| Timer (interval) | `~onTimer:<seconds>` | Implemented | Fires every `N` seconds with per-unit/action timers. |
| Spawn | `~onSpawn` | Implemented | Fires once for each spawned unit. |
| Death | `~onDeath` | Implemented | Fires once when unit health reaches 0. |
| Selected | `~onSelected` | Implemented | Fires when unit transitions unselected -> selected. |
| Shield Break | `~onShieldBreak` | Implemented | Fires when shield crosses from `>0` to `<=0`. |
| Energy Starved | `~onEnergyStarved` | Implemented | Fires when energy crosses from `>0` to `<=0`. |
| Move Order | `~onMoveOrder` | Implemented | Fires when a move order is issued to the unit. |
| Signal | `~onSignal{signal=<signalName>}` | Implemented | Fires when matching `sendSignal` broadcast is received. |
| Button | `~onButton{text=<buttonText>}` | Parsed/Matchable | Parameterized trigger shape; runtime fires only when corresponding UI event is invoked. |
| Use | `~onUse` | Parsed only | Not auto-triggered yet. |
| Attack | `~onAttack` | Parsed only | Not auto-triggered yet. |
| Damaged | `~onDamaged` | Parsed only | Not auto-triggered yet. |
| Move | `~onMove` | Planned | Not implemented yet. |

## Custom Action Files

Custom actions are loaded from:
- `<modRoot>/actions.yaml`
- `<modRoot>/actions/*.yaml`

Each action file can define one or more actions, and each root key is the action name.

```yaml
emergencyBlink:
  conditions:
    - compare{stat=health;value=25;compare=atmost}
  actions:
    - teleport @location{x=512;y=256}

shieldPulse:
  conditions:
    - compare{stat=shield;value=0;compare=equal}
  actions:
    - damage{value=0}
```

Then reference a custom action from a unit action line:

```yaml
my_unit_id:
  actions:
    - action{action=emergencyBlink} @self ~onTimer:1
```

## Examples

```yaml
my_unit_id:
  actions:
    - damage{value=5} @target ~onAttack
    - teleport @location{x=512;y=256} ~onTimer:3
    - action{action=emergencyBlink} ~onSpawn
    - action{action=emergencyBlink} ~onSelected
    - action{action=emergencyBlink} ~onShieldBreak
    - action{action=emergencyBlink} ~onEnergyStarved
    - action{action=emergencyBlink} ~onMoveOrder
    - transform{unit=tank} @self ~onButton{text=Morph}
    - createUnit{unit=worker;amount=2} @self ~onButton{text=QueueWorker}
    - kill @self ~onButton{text=SelfDestruct}
    - remove @self ~onButton{text=DeleteNow}
    - setUnitStat{stat=health;value=50} @self ~onButton{text=SetHp50}
    - addTag{tag=berserk} @self ~onSpawn
    - removeTag{tag=berserk} @self ~onTimer:10
    - setUpgradeLevel{name=vehicleWeapons;level=2} @self ~onSpawn
    - sendSignal{signal=Retreat} @self ~onButton{text=Retreat}
    - moveOrder @location{x=1024;y=256} ~onButton{text=MoveNow}
    - damage{value=1} @self ?hasTag{tag=berserk} ~onTimer:1
    - damage{value=1} @self ?hasResources{resource=energy;amount=50} ~onTimer:1
    - damage{value=1} @self ?cooldownReady{action=Pulse} ~onTimer:1
    - action{action=emergencyBlink} @self ?isHidden ~onTimer:1
    - action{action=emergencyBlink} @self ?hasUpgradeLevel{name=vehicleWeapons;level=2} ~onSignal{signal=Retreat}
    - damage{value=9999} ~onButton{text=SelfDestruct}
    - build{unit=turret} @area{radius=96} ?compare{stat=energy;value=20;compare=atleast} ~onUse
```

## Notes

- Invalid action lines are ignored during unit loading.
- Keys are case-insensitive for parameters and comparison names.
- Numeric parsing uses invariant culture (`.` decimal separator).
