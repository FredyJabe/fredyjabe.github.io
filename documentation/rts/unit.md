# Units Format

This page documents the unit definition YAML format currently loaded by the game, including every supported field and runtime behavior.

## File Location and Structure

- Unit files are loaded from: `<modRoot>/units/**/*.yaml`
- A single file can contain one or multiple units.
- Each root key is the unit ID.

Example:

```yaml
worker:
  size: 1
  isVisible: true
  isSelectable: true
  movement:
    type: Ground
    speed: 2.0
  defense:
    health: 100
  graphics:
    image: worker.png
  tags:
    - worker
  actions:
    - damage{value=1} ~onTimer:1

tank:
  size: 16
  movement:
    type: Ground
    speed: 0.25
  defense:
    health: 300
  graphics:
    image: tank.png
```

## Supported Fields

### Root Unit Object

| Field | Type | Default | Required | Notes |
|---|---|---|---|---|
| `<unitId>` | object | n/a | Yes | Root key name is the unit ID used by runtime. |

### Unit Fields

| Field | Type | Default | Required | Notes |
|---|---|---|---|---|
| `size` | int | `1` | No | Clamped to minimum `1`. Used as unit footprint/selection size basis. |
| `isVisible` | bool | `true` | No | If false, image path loading is skipped and visibility checks use false. |
| `isSelectable` | bool | `true` | No | Controls whether the unit can be selected. |
| `movement` | object | `{}` | No | See [Movement Fields](movement-fields) table. |
| `build` | object | `{}` | No | See [Build Fields](build-fields) table. |
| `defense` | object | `{}` | No | See [Defense Fields](defense-fields) table. |
| `attack` | object | `{}` | No | Each child key is a weapon ID (`attack.primary`, `attack.secondary`, etc.). |
| `graphics` | object | `{}` | No | See [Graphics Fields](graphics-fields) table. |
| `tags` | list<string> | `[]` | No | Trimmed, case-insensitive tag set at runtime. |
| `actions` | list<string> | `[]` | No | Action DSL lines parsed via `ActionHelper.TryParse`. Invalid lines are ignored. |

### Movement Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `movement.type` | string | `"None"` | Also affects vertical presentation (`Hover`, `Air`, `Flying`). |
| `movement.speed` | float | `0` | If accel/decel/maxSpeed are all unset/non-positive, this is used for movement speed (`speed * tileSize`). |
| `movement.acceleration` | float | `0` | Parsed and stored. |
| `movement.deceleration` | float | `0` | Parsed and stored. |
| `movement.maxSpeed` | float | `0` | Parsed and stored. |
| `movement.turnSpeed` | float | `360` | Max facing rotation speed in degrees/second. Clamped to `>= 0`. |

### Build Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `build.buildTime` | float | `0` | Clamped to `>= 0`. Used by `createUnit` action delay. |

### Defense Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `defense.health` | int | `1` | Clamped to minimum `1`. |
| `defense.healthRegen` | float | `0` | Clamped to `>= 0`. |
| `defense.armor` | int | `0` | Clamped to `>= 0`. |
| `defense.shield` | int | `0` | Clamped to `>= 0`. |
| `defense.shieldRegen` | float | `0` | Clamped to `>= 0`. |
| `defense.energy` | int | `0` | Clamped to `>= 0`. |
| `defense.energyRegen` | float | `0` | Clamped to `>= 0`. |
| `defense.isInvulnerable` | bool | `false` | Prevents incoming damage from applying. |

### Attack Fields

- `attack` is a dictionary/object map where each node is a weapon definition.
- Example:

```yaml
attack:
  primary:
    canAttack: true
    damage: 20
    range: 5
  antiAir:
    canAttack: true
    canAttackGround: false
    canAttackAir: true
    damage: 12
    range: 7
```

Weapon fields:

| Field | Type | Default |
|---|---|---|
| `canAttack` | bool | `false` |
| `canAttackAndMove` | bool | `false` |
| `canAttackGround` | bool | `true` |
| `canAttackAir` | bool | `false` |
| `damage` | float | `1` |
| `bonusDamage` | list<string> | `[]` |
| `projectileSpeed` | float | `1` |
| `projectileLife` | float | `100` |
| `range` | float | `5` |
| `minrange` | float | `0` |
| `rotationSpeed` | float | `100` |
| `shootingAngle` | float | `360` |
| `position.x` | float | `0` |
| `position.y` | float | `0` |
| `position.z` | float | `unit graphics.layers` |
| `graphics` | object | `{ image: "none", layers: 1, frames: 1, idle: {start: 0, end: 0}, move: {start: 0, end: 0}, attack: {start: 0, end: 0} }` |

Notes:

- `position.x` and `position.y` are weapon-local offsets from the unit world position.
- `position.z` offsets weapon rendering upward on screen (applied as Y offset `-z`); if omitted, runtime uses the main unit `graphics.layers` value.
- `graphics` under a weapon follows the same structure as unit-level `graphics` (`image`, `layers`, `frames`, `idle`, `move`, `attack`).
- When any weapon has `canAttackAndMove: true` (and `canAttack: true`), the unit may enter attack state while moving if an enemy is in range.
- Weapon graphics are not auto-rescaled to unit scale; each weapon uses its own `graphics.imageScale`.

### Graphics Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `graphics.image` | string | `"none"` | Relative paths resolve from the unit file directory. |
| `graphics.offset.x` | float | `0` | Visual-only X offset in world pixels (does not move gameplay position). |
| `graphics.offset.y` | float | `0` | Visual-only Y offset in world pixels (does not move gameplay position). |
| `graphics.imageScale` | float | `1.0` | Alias supported: `imageScale`. Clamped to minimum `0.01`. |
| `graphics.layers` | int | `1` | Clamped to minimum `1`. |
| `graphics.frames` | int | `1` | Clamped to minimum `1`. |
| `graphics.idle.start` | int | `0` | Clamped to `>= 0`. |
| `graphics.idle.end` | int | `0` | Clamped to `>= 0`. |
| `graphics.idle.animationTime` | float | `1.0` | Clamped to minimum `0.01`. |
| `graphics.move.start` | int | `0` | Clamped to `>= 0`. |
| `graphics.move.end` | int | `0` | Clamped to `>= 0`. |
| `graphics.move.animationTime` | float | `1.0` | Clamped to minimum `0.01`. |
| `graphics.attack.start` | int | `0` | Clamped to `>= 0`. |
| `graphics.attack.end` | int | `0` | Clamped to `>= 0`. |
| `graphics.attack.animationTime` | float | `1.0` | Clamped to minimum `0.01`. |

## Runtime Behavior Notes

- Duplicate unit IDs across loaded files/mods are ignored after first load.
- Files with malformed YAML are skipped.
- Unknown fields are ignored by the deserializer.
- Actions are parsed at load time; invalid lines are dropped.
- `tags` are case-insensitive at runtime.

## Minimal Unit Example

```yaml
scout:
  size: 8
  movement:
    type: Hover
    speed: 3.0
  defense:
    health: 60
    armor: 0
  graphics:
    image: scout.png
  tags:
    - light
    - recon
```

## Full Example

```yaml
assault_mech:
  size: 18
  isVisible: true
  isSelectable: true

  movement:
    type: Ground
    speed: 0.35
    acceleration: 0.0
    deceleration: 0.0
    maxSpeed: 0.0

  build:
    buildTime: 12.0

  defense:
    health: 450
    healthRegen: 0.0
    armor: 3
    shield: 100
    shieldRegen: 0.0
    energy: 80
    energyRegen: 0.5
    isInvulnerable: false

  graphics:
    image: assault_mech.png
    imageScale: 1.0
    layers: 1
    frames: 4
    idle:
      start: 0
      end: 0
      animationTime: 1.0
    move:
      start: 1
      end: 2
      animationTime: 0.4
    attack:
      start: 3
      end: 3
      animationTime: 0.2

  tags:
    - mech
    - armored

  actions:
    - action{action=emergencyBlink} ~onShieldBreak
    - moveOrder @location{x=1024;y=256} ~onButton{text=Advance}
```

## Related Docs

- Unit actions DSL: [UnitActions](unitactions)
