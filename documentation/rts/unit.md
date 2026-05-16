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
| `movement` | object | `{}` | No | See [Movement Fields](#movement-fields) table. |
| `build` | object | `{}` | No | See [Build Fields](#build-fields) table. |
| `defense` | object | `{}` | No | See [Defense Fields](#defense-fields) table. |
| `graphics` | object | `{}` | No | See [Graphics Fields](#graphics-fields) table. |
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

### Graphics Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| `graphics.image` | string | `"none"` | Relative paths resolve from the unit file directory. |
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

  build:
    buildTime: 12.0

  defense:
    health: 450
    armor: 3
    shield: 100
    shieldRegen: 0.5

  graphics:
    image: assault_mech.png
    layers: 1
    frames: 4
    idle:
      start: 0
      end: 0
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

- Unit actions DSL: [UnitActions.md](UnitActions.md)
