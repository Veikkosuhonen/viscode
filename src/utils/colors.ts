import *  as THREE from 'three'

let colors = {}


const init = () => colors = {
    nord0: new THREE.Color('#2E3440'),
    nord1: new THREE.Color('#3B4252'),
    nord2: new THREE.Color('#434C5E'),
    nord3: new THREE.Color('#4C566A'),
    snow0: new THREE.Color('#D8DEE9'),
    snow1: new THREE.Color('#E5E9F0'),
    snow2: new THREE.Color('#ECEFF4'),
    frost0: new THREE.Color('#8FBCBB'),
    frost1: new THREE.Color('#88C0D0'),
    frost2: new THREE.Color('#81A1C1'),
    frost3: new THREE.Color('#5E81AC'),
    error: new THREE.Color('#BF616A'),
    success: new THREE.Color('#A3BE8C'),
}

export { colors, init }