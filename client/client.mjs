import * as alt from 'alt-client';
import * as native from 'natives';

let interactcontrol = 51 // E
let markers = new Map();

class Marker {
    constructor(id, type, pos = new alt.Vector3(0, 0, 0), dir = new alt.Vector3(0, 0, 0), rot = new alt.Vector3(0, 0, 0), scale = new alt.Vector3(0, 0, 0), rgba = new alt.RGBA(255, 255, 255, 255), options = { bobUpAndDown: false, faceCamera: false, p19: 2, rotate: false, textureDict: null, textureName: null, drawOnEnts: false, drawDistance: 15 }, colshapepos = new alt.Vector3(0,0,0)) {
        this.id = id,
        this.type = type,
        this.pos = pos,
        this.dir = dir,
        this.rot = rot,
        this.scale = scale,
        this.rgba = rgba,
        this.options = options,
        this.colshapepos = colshapepos,
        this.inMarker = false;
        this.drawMarker = false;
    }
    everytick = alt.everyTick(() => {
        if(this.drawMarker) {
            native.drawMarker(this.type, this.pos.x, this.pos.y, this.pos.z, this.dir.x, this.dir.y, this.dir.z, this.rot.x, this.rot.y, this.rot.z, this.scale.x, this.scale.y, this.scale.z, this.rgba.r, this.rgba.g, this.rgba.b, this.rgba.a, this.options.bobUpAndDown, this.options.faceCamera, this.options.p19, this.options.rotate, this.options.textureDict, this.options.textureName, this.options.drawOnEnts);
            native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, 0)
            if(this.inMarker && native.isControlJustReleased(0, interactcontrol)) {
                alt.emit('playerInteractWithMarker', this.id)
                alt.emitServer('playerInteractWithMarker', this.id)
            }
        }
    })
    interval = alt.setInterval(() => {
        let dis = distance(alt.Player.local.pos, this.pos);
        if(dis < this.options.drawDistance) {
            this.drawMarker = true;
        } else {
            this.drawMarker = false;
        }
    }, 1000)
    colshapeenterlistener = alt.onServer('playerEnteredColshape', (clpos) => {
        if(distance(clpos, this.colshapepos) < 1) {
            alt.emit('playerEnterMarker', this.id);
            alt.emitServer('playerEnterMarker', this.id);
            this.inMarker = true;
        }
    })
    colshapeleavelistener = alt.onServer('playerLeavedColshape', (clpos) => {
        if(distance(clpos, this.colshapepos) < 1) {
            alt.emit('playerLeaveMarker', this.id);
            alt.emitServer('playerLeaveMarker', this.id);
            this.inMarker = false;
        }
    })
    destroy() {
        alt.clearEveryTick(this.everytick);
        alt.clearInterval(this.interval)
    }
}
// Events

alt.onServer('altv-marker-manager:markerCreated', (mrk) => {
    let marker = new Marker(mrk.id, mrk.type, mrk.pos, mrk.dir, mrk.rot, mrk.scale, mrk.rgba, mrk.options, mrk.colshape)
    markers.set(mrk.id, marker)  
    alt.log(`Marker created: ${mrk.id} Markers: ${markers.size}`)
})

alt.onServer('altv-marker-manager:markerRemoved', (id) => {
    if(markers.has(id)) {
        markers.get(id).destroy();
        markers.delete(id)
    }
})

// Functions
export function distance(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
}
