import React, {Component} from 'react'
import {connect} from "react-redux";
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {downloadMap, downloadBeaconList, updatePosition} from "./actions/mapAction";
import {Location} from "../location/location";
import {resetScan, startScan} from "../auxModule/auxModule";
import AuxModule from "../auxModule/auxModule";

//Leyenda : En el mapa habrá distintos valores según el terreno ...
// valor 1 = Camino transitable. (Azul)
// valor 0 = Camino no transitable. (Rojo)
// valor 2 = Escaleras o ascensores
class FloorPlan extends Component {

    interval;
    reset;

    constructor(props) {
        super(props);

    }

    componentDidMount(): void {
        this.interval = setInterval(() => {
                this.props.updatePosition(this._calculatePosition());
            this.setState();
            console.log("Estado actualizado")
        }, 1000);
        this.reset = setInterval(() => {
            resetScan()
        }, 10000);
        console.log("LOCATION",Location({
            beacon1:{x:3, y:4, d: 1.12899983851278393},
            beacon2:{x: 1, y: 3, d: 1.1615055828898458},
            beacon3:{x: 4, y: 6, d: 1.12899983851278393}
        }))
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
                {row.map((x, index) => {
                    if (x === 1) {
                        //Camino transitable
                        return (<View key={index} style={{flex: 1, backgroundColor: 'blue'}}/>);
                    } else if (x === 0) {
                        // Camino no transitable
                        return (<View key={index} style={{flex: 1, backgroundColor: 'red'}}/>);
                        // Posición actual
                    } else {
                        return (<View key={index} style={{flex: 1, backgroundColor: 'yellow'}}/>);
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
        if (this.props.scanner.beaconsOnRange.length >= 3) {
            let beacons = this._orderBeaconsOnRange();
            let finder = [];
            for (let i = 0; i < 3; i++) {
                let beaconPosition = this.props.mapRedux.beaconsList[beacons[i].name];
                beaconPosition.d = beacons[i].accuracy;
                console.log("Beacon pusheado: ", beaconPosition);
                finder[i] = beaconPosition;
            }
            return Location({
                beacon1: {x: finder[0].x, y: finder[0].y, d: finder[0].d},
                beacon2: {x: finder[1].x, y: finder[1].y, d: finder[1].d},
                beacon3: {x: finder[2].x, y: finder[2].y, d: finder[2].d}
            })
        }else{
            return null
        }

    };

    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <AuxModule/>
                {this.props.mapRedux.plan.map((row, index) => {
                    return this.renderRow(row, index)
                })}
                <TouchableOpacity style={styles.button} onPress={() => startScan()}>
                    <Text style={styles.buttonText}>Start Scanner</Text>
                </TouchableOpacity>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    button: {
        textAlign: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 10,
        width: '90%',
        height: '40%'
    },
    buttonText: {
        color: '#323232',
    },
});

const mapStateToProps = state => {
    return {
        mapRedux: state.MapReducer,
        scanner: state.RangeReducer

    }
};

const mapStateToPropsAction = {downloadMap, downloadBeaconList, updatePosition};


export default connect(mapStateToProps, mapStateToPropsAction)(FloorPlan);
