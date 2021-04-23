#!/usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

const path = require("path")
const fs = require("fs")
const jsonata = require("jsonata");
const log = console.log
const print = log

const graph_path = path.join(__dirname, "graph")

const read_json = file => JSON.parse(fs.readFileSync(file), "utf8")

const syn_convert = (json) => {

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
     "links": elements.edges.data.{"id": id, "source": source, "target": target, "name": name, "interaction": interaction}
    }
    `
    const nodes_exp = jsonata(query);
    const results = nodes_exp.evaluate(json)
    results.nodes.forEach(node => {
        node.wildtype_max_lifespan = wildtype.max_lifespan_;
        node.wildtype_avg_lifespan = wildtype.avg_lifespan_;
        node.wildtype_min_lifespan = wildtype.min_lifespan_;
    })
    return results
}

program
    .version('0.1.0')
    .arguments('<synergy> [graph]')
    .description('synergy conversion command', {
        synergy: 'synergy cytoscape json',
        graph: 'resulting graph filename [optional]'
    })
    .action((synergy, graph) => {
        console.log('synergy:', synergy);
        console.log('graph:', graph);

        const input = fs.existsSync(synergy)? synergy: path.join(__dirname, "graph", synergy)

        const converted = syn_convert(read_json(input))
        if(!graph){
            print(converted)
        } else {
            const output = path.basename(graph) === graph ? path.join(__dirname, "graph", graph): graph
            fs.writeFileSync(output, JSON.stringify(converted, null, 2), "utf8")
            print(`JSON written to ${output}`)
        }
    })


if (!process.argv) {
    // e.g. display usage
    program.help();
}
program.parse(process.argv)