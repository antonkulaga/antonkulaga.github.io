import React from 'react'

import ForceGraphVR from '3d-force-graph-vr';
import ForceGraph3D from '3d-force-graph';
import SpriteText from "three-spritetext";


const Selection = () =>
{
    return(
    <table>
        <tr>
            <td>
                <p>
                    <a href="/roundworm/" title="Roundworm">
                        <strong>Caenorhabditis elegans</strong>
                        <img className="img-responsive img-thumbnail"
                             src="http://synergistic.aging-research.group//static/curation/images/roundworm.jpg" alt="Caenorhabditis elegans" />
                    </a>
                </p>
                <h3>
                    <small className="designation muted">1770 gene combinations</small>
                    <small className="designation muted">6656 lifespan values</small>
                </h3>
            </td>
            <td>
                <p>
                    <a href="/fruit-fly/" title="Fruit fly">
                        <strong>Drosophila melanogaster</strong>
                        <img className="img-responsive img-thumbnail"
                             src="http://synergistic.aging-research.group//static/curation/images/fruit-fly.jpg" alt="Drosophila melanogaster" />
                    </a>
                </p>
                <h3>
                    <small className="designation muted">27 gene combinations</small>
                    <small className="designation muted">185 lifespan values</small>
                </h3>
            </td>
            <td>
                <p>
                    <a href="/mouse/" title="Mouse">
                        <strong>Mus musculus</strong>
                        <img className="img-responsive img-thumbnail" src="http://synergistic.aging-research.group//static/curation/images/mouse.jpg"  alt="Mus musculus" />
                    </a>
                </p>
                <h3>
                    <small className="designation muted">36 gene combinations</small>
                    <small className="designation muted">147 lifespan values</small>
                </h3>
            </td>
        </tr>
    </table>)
}