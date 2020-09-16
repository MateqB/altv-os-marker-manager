import * as alt from 'alt-server';
let markers = new Map();

class Marker {
    constructor(id, type = 1, pos = new alt.Vector3(0, 0, 0), dir = new alt.Vector3(0, 0, 0), rot = new alt.Vector3(0, 0, 0), scale = new alt.Vector3(0, 0, 0), rgba = new alt.RGBA(255, 255, 255, 255), options = { bobUpAndDown: false, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false, drawDistance: 15 }, colshape = null) {
        this.id = id,
        this.type = type,
        this.pos = pos,
        this.dir = dir,
        this.rot = rot,
        this.scale = scale,
        this.rgba = rgba,
        this.options = mergeDefault({ bobUpAndDown: false, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false, drawDistance: 15 }, options),
        this.colshape = colshape
    }
}

// Events
alt.on('entityEnterColshape', (colshape, entity) => {
    if(entity instanceof alt.Player) {
        let player = alt.Player.getByID(entity.id)
        alt.emitClient(player, 'playerEnteredColshape', colshape.pos);
    }
})

alt.on('entityLeaveColshape', (colshape, entity) => {
    if(entity instanceof alt.Player) {
        let player = alt.Player.getByID(entity.id)
        alt.emitClient(player, 'playerLeavedColshape', colshape.pos);
    }
})

alt.on('playerConnect', (player) => {
    setTimeout(() => {
        markers.forEach((value, key, map) => {
            alt.emitClient(player, 'altv-marker-manager:markerCreated', value);
        })
    }, 5000)
})

// Functions
export function createMarker(type, pos, dir, rot, scale, rgba, options) {
    for(let i = 0; i <= markers.size; i++) {
        if(i < markers.size) {
            if(!markers.has(i)) {
                let colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, scale.y);
                let marker = new Marker(i, type, pos, dir, rot, scale, rgba, options, colshape.pos)
                markers.set(i, marker)
                alt.emitClient(null, 'altv-marker-manager:markerCreated', marker);
                return marker;
            }
        }
        if(i == markers.size) {
            let colshape = new alt.ColshapeSphere(pos.x, pos.y, pos.z, scale.y);
            let marker = new Marker(i, type, pos, dir, rot, scale, rgba, options, colshape.pos)
            markers.set(i, marker)  
            alt.emitClient(null, 'altv-marker-manager:markerCreated', marker);
            return marker;     
        }
    }
}

export function removeMarker(id) {
    if(markers.get(id)) {
        markers.delete(id)
        alt.emitClient(null, 'altv-marker-manager:markerRemoved', id)
        return true;
    } else return false;
}

function mergeDefault(def, given) {
    if (!given)
        return def;
    for (const key in def) {
        if (!{}.hasOwnProperty.call(given, key)) {
            given[key] = def[key];
        }
        else if (given[key] === Object(given[key])) {
            given[key] = this.mergeDefault(def[key], given[key]);
        }
    }
    return given;
}
