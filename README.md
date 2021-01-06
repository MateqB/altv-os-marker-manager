# Alt:V Marker Manager

Created by Mateq

---

![](https://i.imgur.com/i9NKMNZ.png)

# Description

This is server-side marker manager. It allows you to Create/Delete markers on the server. It also contains Enter/Leave/Interact events for client and server side.

## Installing Dependencies / Installation

Requirements:
-   An Existing or New Gamemode
-   General Scripting Knowledge

Afterwards, simply add the name of this resource to your `server.cfg` resource section.

`altv-os-marker-manager`

Then simply clone this repository into your main server resources folder.

```
cd resources
git clone https://github.com/MateqB/altv-os-marker-manager
```

Ensure your `package.json` includes this property:

```json
"type": "module"
```

# Example

```javascript
import alt from 'alt-server';
import * as MarkerManager from 'altv-os-marker-manager'; // Remember to have it in dependencies

// Create a simple red marker
MarkerManager.createMarker(1, // Type of the marker
new alt.Vector3(0, 0, 72), // Marker position
new alt.Vector3(0, 0, 0), // Marker direction
new alt.Vector3(0, 0, 0), // Marker rotation
new alt.Vector3(1, 1, 1), // Marker scale
new alt.RGBA(255, 0, 0, 255), // Marker color
{} // Marker options (Read "Creating a marker")
)

```

# Usage

There's couple of events to get you started with this resource:

```javascript
// Server-side

// When player enters an marker
alt.onClient('playerEnterMarker', (player, id) => {
  console.log(`${player.name} entered an marker with id: ${id}`)
})

// When player leave an marker
alt.onClient('playerLeaveMarker', (player, id) => {
  console.log(`${player.name} left an marker with id: ${id}`)
})

// When player is in marker and clicked E (To change key replace 'interactcontrol' in client.mjs)
alt.onClient('playerInteractWithMarker', (player, id) => {
    MarkerManager.removeMarker(markerid)  // Remove marker
})

// Client side

// When player enters an marker
alt.on('playerEnterMarker', (id) => {
  alt.log(`You have entered an marker with id: ${id}`)
})

// When player leave an marker
alt.on('playerLeaveMarker', (id) => {
  alt.log(`You have leave an marker with id: ${id}`)
})

// When player is in marker and clicked E (To change key replace 'interactcontrol' in client.mjs)
alt.on('playerInteractWithMarker', (id) => {
  alt.log(`You have interacted with marker, marker id: ${id}`)
})

```

---

## Creating a marker

```javascript
let marker = MarkerManager.createMarker(1, new alt.Vector3(0, 0, 72), new alt.Vector3(0, 0, 0), new alt.Vector3(0, 0, 0), new alt.Vector3(1, 1, 1), new alt.RGBA(255, 0, 0, 255),{})
```

| Argument                            | Description                                                                |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `type`                              | Type of the marker to show.                                                |
| `position { x, y, z }`              | Location of the marker.                                                    |
| `direction { x, y, z }`             | Direction of the marker.                                                   |
| `rotation { x, y, z }`              | Rotation of the marker.                                                    |
| `scale { x, y, z }`                 | Scale of the marker.                                                       |
| `color { red, green, blue, alpha }` | Color of the marker.                                                       |
| `options   `                        | Options of the marker (check 'options')                                    |

For marker types take a look here: [alt:V Wiki - Markers](https://wiki.altv.mp/HUD:Markers)

---

---

## Marker options

| Option                              | Description                                                                |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `bobUpAndDown?: false`              | Marker goes up and down (LOL)                                              |
| `faceCamera?: false`                | Rotates only the y-axis (the heading) towards the camera.                  |
| `p19?: 2`                           | No effect, default value in script is 2                                    |
| `rotate?: false`                    | Rotates only on the y-axis (the heading)                                   |
| `textureDict: null`                 | Name of texture dictionary to load texture from (e.g. "GolfPutting")       |
| `textureName?: null`                | Name of texture inside dictionary to load (e.g. "PuttingMarker")           |
| `drawOnEnts?: false`                | Draws the marker onto any entities that intersect it                       |
| `drawDistance?: 15`                 | Draw distance                                                              |

Example: 
```javascript
MarkerManager.createMarker(1, // Type of the marker
new alt.Vector3(0, 0, 72), // Marker position
new alt.Vector3(0, 0, 0), // Marker direction
new alt.Vector3(0, 0, 0), // Marker rotation
new alt.Vector3(1, 1, 1), // Marker scale
new alt.RGBA(255, 0, 0, 255), // Marker color
{
bobUpAndDown: true,
faceCamera: true
} // Now the marker will face camera and it will bob up and down
)
```

---

## Removing a marker

```javascript
MarkerManager.removeMarker(identifier)
```

| Argument     | Description                                                        |
| ------------ | ------------------------------------------------------------------ |
| `identifier` | Marker id (Available through marker.id).                           |
