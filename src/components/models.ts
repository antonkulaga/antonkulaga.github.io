
export interface ISynergyNode {
    id: string | number
    genes: Array<string>
    max_lifespan: number
    min_lifespan: number
    avg_lifespan: number
    wildtype_max_lifespan: number
    wildtype_min_lifespan: number
    wildtype_avg_lifespan: number
    group: number

    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    fx?: number;
    fy?: number;
    fz?: number;

}
export interface ISynergyLink {
    id: string
    source: string
    target: string
    name: string
    interaction: string
    "curvature": number
}
export interface ISynergyGraph{
    nodes: Array<ISynergyNode>
    links: Array<ISynergyLink>
}

export const Empty_graph: ISynergyGraph = {
    nodes: [],
    links: []
}
