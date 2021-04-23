import logo from './logo.svg';
import React from 'react'

import './App.css';
import Graph3D from "./components/Graph3D";

export default class App extends React.Component {

  render(){
    return (
        <div className="App">
            <Graph3D vr="true" json="graph/worm_graph.json" />
        </div>
    );
  }
}