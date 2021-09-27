import React, {useEffect, useState} from 'react'

import SpriteText from "three-spritetext";
import ForceGraphVR, {ForceGraphVRGenericInstance, ForceGraphVRInstance} from "3d-force-graph-vr";
import {THREE} from "aframe";
import {Group, Object3D} from "three";
import {useLocation} from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import jsonata from "jsonata";
import {Empty_graph, ISynergyGraph, ISynergyNode} from "./models";



/**
 * This Component is used to display the graph,
 *  you can also configure how it will look like there
 * @param graphData
 * @constructor
 */
export const Graph3D = ({ base }: { base: string}) => {

    const graphInstance: ForceGraphVRInstance = ForceGraphVR()
    let graphElement: HTMLElement;
    let graph: ForceGraphVRGenericInstance<ForceGraphVRInstance>


    const default_network = "fly_network"
    const nodes_threshold = 500


    const [network, setNetwork] = useState<string>(default_network) //network to load (fly by default)
    const [graphData, setGraphData] = useState<ISynergyGraph>(Empty_graph) //graphData (empty by default


    const location = useLocation()

    useEffect(() => {
        console.log("path change to", location.pathname)
        if(location.pathname.length <= 1){
            setNetwork(default_network)
        }
        else {
            setNetwork(location.pathname)
        }
        }, [location])



    /**
     * Converts from cytoscape to our format
     * @param json
     */
    const convert = (json: any) => {

        const wildtype = jsonata(`elements.nodes.data[genes="Wild type"]`).evaluate(json)

        const query = `
        {
         "nodes": elements.nodes.data.{
           "genes":genes, 
           "id":id, 
           "max_lifespan": max_lifespan_ ? max_lifespan_: -1,  
           "min_lifespan": min_lifespan_ ? min_lifespan_: -1,  
           "avg_lifespan": avg_lifespan_ ? avg_lifespan_: -1,        
           "group": $contains(genes, ";") ? 2 : 1
           },
         "links": elements.edges.data.{"id": id, "source": source, "target": target, "name": elements.nodes.data[id=source].genes, "interaction": interaction, "curvature": 0.2}
        }
        `
        const nodes_exp: jsonata.Expression = jsonata(query);
        const results = nodes_exp.evaluate(json)
        results.nodes.forEach(node => {
            node.wildtype_max_lifespan = wildtype.max_lifespan_;
            node.wildtype_avg_lifespan = wildtype.avg_lifespan_;
            node.wildtype_min_lifespan = wildtype.min_lifespan_;
        })
        return results as ISynergyGraph
    }

    /**
     * Updates the setGraph data
     */
    useEffect(()=> {
        const update_graph = async () => {
            const response: AxiosResponse = await axios.get<AxiosResponse>(`${base}/${network}.cyjs`);
            const network_data = response.data
            const conversion = convert(network_data)
            console.log("CONVERSION", conversion)
            setGraphData(conversion)

        }
        update_graph()

    }, [base, network])



    const sprite_for_node = (node: ISynergyNode, box: boolean = true) => {
        const percent: number = Math.round((1 +(node.max_lifespan - node.wildtype_max_lifespan) / node.wildtype_max_lifespan) * 100.0)
        const life_color: string = node.wildtype_max_lifespan >  node.max_lifespan ? "red" : "green"
        const life_text_color: string =  node.wildtype_max_lifespan >  node.max_lifespan ? "pink" : "lightgreen" //node.color;

        const text = String(node.genes).replaceAll(";", " & ") + `\n ( ${percent} )%` //text of the node
        const is_wild_type: boolean =  text === "Wild type"

        const sprite: SpriteText = new SpriteText(text); //sprite with the text
        const VR_dec = 4
        const wild_type_inc = is_wild_type ? 5 : 0
        sprite.textHeight = node.group === 1 ? 10 - VR_dec + wild_type_inc : 8 - VR_dec + wild_type_inc

        sprite.color = is_wild_type ? "white" : life_text_color
        if(box){
            sprite.borderWidth = 1
            sprite.padding = 2
            sprite.borderColor = is_wild_type ? "blue" : life_color
        }
        return sprite
    }

    /**
     * Simple function that just draws the sprite (not used right now)
     * @param node
     */
    const node_to_sprite = (node: ISynergyNode) =>{
        const group = new THREE.Group()
        group.add(sprite_for_node(node, false))
        return group
    }

    const geo_for_node = (node: ISynergyNode) => {
        const percent: number = Math.round((1 +(node.max_lifespan - node.wildtype_max_lifespan) / node.wildtype_max_lifespan) * 100.0)
        const life_color: string = node.wildtype_max_lifespan >  node.max_lifespan ? "red" : "green"
        const text = String(node.genes).replaceAll(";", " & ") + `\n ( ${percent} )%` //text of the node
        const is_wild_type: boolean =  text === "Wild type"
        const wild_type_inc = is_wild_type ? 5 : 0

        const geo = new THREE.TorusGeometry(14 + wild_type_inc, 1) //const geo = new THREE.Sphere(14 + wild_type_inc)
        const geo_color = is_wild_type ? "blue" : life_color
        const mesh = new THREE.Mesh(geo,
            new THREE.MeshLambertMaterial({
                color: geo_color,
                transparent: true,
                opacity: 0.4
            })
        )
        return mesh
    }
    /**
     * Function that does the drawing of the node
     * @param node
     */
    const node_to_advanced_text = (node: ISynergyNode ): Object3D =>{
        const group = new THREE.Group()
        group.add(sprite_for_node(node, true))
        //group.add(geo_for_node(node))
        return group
    }
    /**
     * Initialization of the graph and configuration of how it looks like
     * Here, as well as in
     */
    const configure_graph = (graph: ForceGraphVRGenericInstance<ForceGraphVRInstance>) => {
        return graph.linkCurvature('curvature')
            .linkDirectionalArrowLength(3)
            .linkLabel('name')
            .linkWidth(1)
            .d3VelocityDecay(0.2)
            .nodeThreeObject(node_to_advanced_text as any); // give the function that does the drawing of 3D object
    }

    /**
     * Optimizes for large graphs
     * @param graph
     * @param graph_data
     */
    const optimize = (graph: ForceGraphVRGenericInstance<ForceGraphVRInstance>, graph_data: ISynergyGraph) => {
        if(graph_data.nodes.length > nodes_threshold){
            console.warn("GRAPH IS TOO LARGE, OPTIIZING....")
            return graph
                .linkWidth(0) //smaller links
                .linkDirectionalArrowLength(0) //hiding arrows
                .nodeThreeObject(node_to_sprite as any);
        } else return graph
    }

    useEffect(()=>{
        if(graphElement === undefined) {
            graphElement = document.getElementById('3d-graph') as HTMLElement
            graph = graphInstance(graphElement)
        }
        optimize(configure_graph(graph), graphData).graphData(graphData)


        const source = "media/forever.mp3" //let's add some music
        const audio = document.createElement("audio") as unknown as HTMLAudioElement;
        //
        audio.autoplay = true;
        //
        audio.load()
        audio.addEventListener("load", function() {
            audio.play();
        }, true);
        audio.src = source;
    }, [graphData])



    return (
        <div className="Graph3D" >
            <div id="3d-graph">
            </div>
        </div>
    );

}

export default Graph3D