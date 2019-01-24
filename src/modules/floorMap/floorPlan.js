import React, {Component} from 'react'
import {connect} from "react-redux";
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {downloadMap, downloadBeaconList} from "./actions/mapAction";
import {Location} from "../location/location";
import {resetScan} from "../auxModule/auxModule";

//Leyenda : En el mapa habrá distintos valores según el terreno ...
// valor 1 = Camino transitable. (Azul)
// valor 0 = Camino no transitable. (Rojo)
// valor 2 = Escaleras o ascensores
class FloorPlan extends Component {

    interval;
    reset;

    constructor(props) {
        super(props);
        this.state = {
            beaconsToTriangulate: []
        }

    }

    componentWillMount() {
        this.props.downloadMap();
        this.props.downloadBeaconList()
        console.log("calculo de location : ", Location({
            beacon1: {x: 100, y: 100, d: 50},
            beacon2: {x: 160, y: 120, d: 36.06},
            beacon3: {x: 70, y: 150, d: 63.83}
        }));
    }

    componentDidMount(): void {
        this.interval = setInterval(() => {
            this.setState({
                beaconsToTriangulate: this.props.beaconArray.beaconsOnRange
            });
        }, 1500);
        this.reset = setInterval(() => {
            resetScan()
        }, 10000);
    }

    componentWillUnmount(): void {
        clearInterval(this.interval);
        clearInterval(this.reset);
    }

    renderRow = (row, index) => {
        if (index < 4) {
            return null;
        }
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                {row.map((x) => {
                    if (x === 1) {
                        //Camino transitable
                        return (<View style={{flex: 1, backgroundColor: 'blue'}}/>);
                    } else {
                        // Camino no transitable
                        return (<View style={{flex: 1, backgroundColor: 'red'}}/>);
                    }
                })}
            </View>
        )
    };

    _orderBeaconsOnRange = () => {
        return this.props.scanner.beaconsOnRange.sort(function (a, b) {
            return a.distance - b.distance;
        });

    };

    _calculatePosition = () => {
        let beacons = this._orderBeaconsOnRange();
        let finder = [];
        for (let i = 0; i > 3; i++) {
            let index = this.props.mapRedux.beaconsList.indexOf(beacons[i].name);
            let aux = this.props.mapRedux.beaconsList[index];
            aux.push(beacons[i].distance);
            finder[i] = aux;
        }
        return Location({
            beacon1: {x: finder[0][1], y: finder[0][2], d: finder[0][3]},
            beacon2: {x: finder[1][1], y: finder[1][2], d: finder[1][3]},
            beacon3: {x: finder[2][1], y: finder[2][2], d: finder[2][3]}
        })

    };

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                {this.props.mapRedux.plan.map((row, index) => {
                    return this.renderRow(row, index)
                })}
            </View>
        )
    }


}

const mapStateToProps = state => {
    return {
        mapRedux: state.MapReducer,
        scanner: state.RangeReducer

    }
};

const mapStateToPropsAction = {downloadMap, downloadBeaconList};


export default connect(mapStateToProps, mapStateToPropsAction)(FloorPlan);
