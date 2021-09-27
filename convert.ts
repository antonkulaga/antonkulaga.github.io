#!/usr/bin/env node

import { program } from "commander";

program.version('0.0.2');

import * as path from "path"
import * as fs from "fs"
import jsonata from "jsonata";
import axios, {AxiosResponse} from "axios";
import cytoscape from "cytoscape"
const log = console.log



const fetch_data = async (network: string = "fly"): Promise<any> => {
    const response = await axios.get<AxiosResponse>(`https://synergistic.aging-research.group/static/curation/cytoscape/${network}_network.cyjs`);
    return response.data
}

const fetch_network = async (network: string = "fly") => {
    const data = await fetch_data(network)
    return cytoscape(data as any)
}


//const read_json = file => JSON.parse(fs.readFileSync(file,{encoding: "utf8"}))

const syn_convert = (json: any) => {

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
    return results
}

const convert_network =  async (network: string = "fly") => {
    const json = await fetch_data(network)
    return syn_convert(json)
}

program
    .version('0.1.0')
    .arguments('<synergy> [graph]')
    .description('synergy conversion command', {
        network: 'fly',
        graph: 'resulting graph filename [optional]'
    })
    .action((synergy, graph) => {
        console.log('synergy:', synergy);
        console.log('graph:', graph);

        //const input = fs.existsSync(synergy)? synergy: path.join(__dirname, "graph", synergy)

        convert_network().then((converted)=>{
            if(!graph){
                log(converted)
            } else {
                const output = path.basename(graph) === graph ? path.join(__dirname, "graph", graph): graph
                fs.writeFileSync(output, JSON.stringify(converted, null, 2), "utf8")
                log(`JSON written to ${output}`)
            }
        })
        //const converted = syn_convert(read_json(input))

    })


if (!process.argv) {
    // e.g. display usage
    program.help();
}
program.parse(process.argv)