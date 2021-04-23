import logo from './logo.svg';
import React from 'react'

import './App.css';
import Graph3D from "./components/Graph3D";
import Selection from "./components/Selection";

export default class App extends React.Component {

  render(){
    return (
        <div className="App">
            <Graph3D json="graph/fly_graph.json"/>
        </div>
    );
  }
}