import logo from './logo.svg';
import React from 'react'

import './App.css';
import Graph3D from "./components/Graph3D";

export default class App extends React.Component {

  render(){
    return (
        <div className="App">
            <div id="3d-graph"></div>
            <Graph3D vr="true" json="graph/mouse_graph.json" />
        </div>
    );
  }
}