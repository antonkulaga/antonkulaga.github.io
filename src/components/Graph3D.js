import React from 'react'

import ForceGraphVR from '3d-force-graph-vr';
import ForceGraph3D from '3d-force-graph';
import SpriteText from "three-spritetext";


export default class Graph3D extends React.Component {

    constructor(props) {
        super(props);
        this.json = !!props.json ? props.json : "graph/mouse_graph.json"
        this.vr = !!props.vr
    }

    render(){
        return (
            <div className="Graph3D" >
                <div id="3d-graph">
                </div>
            </div>
        );
    }

    node_to_sprite(node){
        const text = String(node.genes)
        const sprite = new SpriteText(text);
        const VR_dec = -4
        sprite.textHeight = node.group === 1 ? 10 + VR_dec : 8 + VR_dec
        sprite.color = node.color;
        return sprite;
    }

    node_to_advanced_text(node){
        const group = new THREE.Group();
        const text = String(node.genes)
        const is_wild_type =  text === "Wild type"
        const sprite = new SpriteText(text);
        const VR_dec = 4
        const wild_type_inc = is_wild_type ? 5 : 0
        sprite.textHeight = node.group === 1 ? 12 - VR_dec + wild_type_inc : 10 - VR_dec + wild_type_inc
        const life_color = node.wildtype_max_lifespan >  node.max_lifespan ? "red" : "green"
        const life_text_color =  node.wildtype_max_lifespan >  node.max_lifespan ? "pink" : "lightgreen" //node.color;

        sprite.color = is_wild_type ? "white" : life_text_color
        group.add(sprite)
        /*
        const geos =  [
            new THREE.SphereGeometry(Math.random() * 10),
            new THREE.BoxGeometry(Math.random() * 20, Math.random() * 20, Math.random() * 20),
            new THREE.ConeGeometry(Math.random() * 10, Math.random() * 20),
            new THREE.CylinderGeometry(Math.random() * 10, Math.random() * 10, Math.random() * 20),
            new THREE.DodecahedronGeometry(Math.random() * 10),
            new THREE.TorusGeometry(Math.random() * 10, Math.random() * 2),
            new THREE.TorusKnotGeometry(Math.random() * 10, Math.random() * 2)
        ]
        */
        const geo = new THREE.SphereGeometry(4 + wild_type_inc)
        const geo_color = is_wild_type ? "blue" : life_color
        const mesh = new THREE.Mesh(geo,
            new THREE.MeshLambertMaterial({
                color: geo_color,
                transparent: true,
                opacity: 0.5
            })
        )
        group.add(mesh)

        return group
    }


    componentDidMount(){
        const graphElement = document.getElementById('3d-graph')
        //const Graph = this.vr ? ForceGraphVR({ controlType: 'orbit' }) : ForceGraph3D({ controlType: 'orbit' })  // this part of code is a bit weird
        const Graph = ForceGraphVR()
        (graphElement)
        .jsonUrl(this.json)
        //.nodeAutoColorBy('group')
        .nodeThreeObject(this.node_to_advanced_text);
    }
}