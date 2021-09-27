
import React, {useEffect, useState} from 'react'


import './App.css';
import Graph3D from "./components/Graph3D";
import axios, {AxiosResponse} from "axios";
import jsonata from "jsonata";
import {Route,   BrowserRouter as Router, Switch, Link} from "react-router-dom"
import {Menu, MenuItem, Header, MenuHeader, Image, Icon, Message} from "semantic-ui-react";

/**
 * Main component of the application
 * @constructor
 */
export const App = () => {

    //edit networkBase to change the source of the networks,
    // for example "https://synergistic.aging-research.group/static/curation/cytoscape/" will load it from synergy if CORS settings will allow
    const [networkBase, setNetworkBase] = useState<string>("graph")

    return (
        <Router>
            <div className="App">
                <Menu color="blue" icon tabular fixed="top">
                    <Link to="/mouse_network">
                        <Menu.Item name="mouse" to="/mouse_network">
                            <Header className="ui blue inverted compact segment">
                                <Image src="media/mouse-small.png"/>
                                Mouse
                            </Header>
                        </Menu.Item>
                    </Link>
                    <Link to="/fly_network">
                        <Menu.Item name="fly" to="/fly_network">
                            <Header className="ui blue inverted compact segment">
                                <Image src="media/drosophila-redeyes.png"/>
                                Fly
                            </Header>
                        </Menu.Item>
                    </Link>
                    <Link to="/roundworm_info">
                        <Menu.Item name="worm" to="roundworm_info">
                            <Header className="ui blue inverted compact segment">
                               <Image src="media/nematode.png"/>
                               Worm
                            </Header>
                        </Menu.Item>
                    </Link>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Message>
                                <Switch>
                                    <Route path="/fly_network">
                                        Fly network selected
                                    </Route>
                                    <Route path="/mouse_network">
                                        Mouse network selected
                                    </Route>
                                    <Route path="/roundworm_info">
                                       C. elegans network selected. Warning: graph is very large, wait until it stabilizes
                                    </Route>
                                    <Route path="">
                                        Fly network selected
                                    </Route>
                                </Switch>

                            </Message>
                        </Menu.Item>



                    </Menu.Menu>
            </Menu>
                <Graph3D base={networkBase}></Graph3D>
            </div>
        </Router>

    );
}