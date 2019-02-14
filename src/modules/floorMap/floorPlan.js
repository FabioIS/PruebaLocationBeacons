import React, {Component} from 'react'
import {connect} from "react-redux";
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {downloadMap, downloadBeaconList, updatePosition} from "./actions/mapAction";
import {PriorityLocation} from "../priorityLocation/priorityLocation";
import {PriorityAreaCalculator} from "../priorityLocation/elements/priorityAreaCalculator";
import {resetScan, startScan, currentlyScanning} from "../auxModule/auxModule";
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
        this.state = {
            beaconsToShow: []
        }

    }

    componentDidMount(): void {
        this.interval = setInterval(async () => {
            if (this.props.scanner.beaconsOnRange.length > 0) {
                await this.props.updatePosition(this._calculatePosition());
                this.setState();
            }
        }, 2000);
        this.reset = setInterval(() => {
                resetScan();
                this.setState({});
        }, 7000);

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

    _getBeaconsOnPriority = () => {
        let result = [];
        this.props.scanner.beaconsOnRange.forEach((beacon) => {
            console.log()
            10 ** ((-50 - beacon.rssi) / 35) <= 10 ? result.push(beacon) : null;
        });
        return result;
    };

    _calculatePosition = () => {

        let beacons = this._getBeaconsOnPriority();
        console.log("Beaacons to show: ", beacons);
        this.setState({
            beaconsToShow: beacons
        });
        let finder = [];
        for (let i = 0; i < beacons.length; i++) {
            // distance : Formula para calcular distancia entre beacon y movil a partir de el rssi esperado a un metro ( -50) y una
            //constante en 20 y 40 ( 35 ). Los valores dados salen después de calcular varias posibilidades.
            let distance = Math.round(10 ** ((-50 - beacons[i].rssi) / 35));
            //Si la distancia es 0.algo la redondeamos a 1 para que los calculos funcionen. A efectos prácticos es lo mismo
            distance === 0 ? distance = 1 : null;
            let beaconPosition = this.props.mapRedux.beaconsList[beacons[i].name];
            finder[i] = {x: beaconPosition.x, y: beaconPosition.y, distance: distance};
        }
        console.log("Finder: ", finder);
        let areas = PriorityAreaCalculator({
            beaconsOnPriority: finder,
            plan: this.props.mapRedux.plan
        });
        console.log("These are the areas: ", areas);
        return PriorityLocation({
            areas: areas
        })


    };

    _showBeaconsForCalculation = () => {
        if (this.state.beaconsToShow.length > 0) {
            return this.state.beaconsToShow.map((beacon) => {
                return <Text>{beacon.name} --- {10 ** ((-50 - beacon.rssi) / 35)}</Text>
            })
        } else {
            return null;
        }
    };

    render() {
        return (
            <View style={{flex: 12, flexDirection: 'column'}}>
                <View style={{flex: 8}}>
                    <AuxModule/>
                    {this.props.mapRedux.plan.map((row, index) => {
                        return this.renderRow(row, index)
                    })}
                </View>
                <View style={{flex: 4}}>
                    <TouchableOpacity style={styles.button} onPress={() => startScan()}>
                        <Text style={styles.buttonText}>Start Scanner</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'column', flex : 1}}>
                        {this._showBeaconsForCalculation()}
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    button: {
        flex: 1,
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

const
    mapStateToProps = state => {
        return {
            mapRedux: state.MapReducer,
            scanner: state.RangeReducer

        }
    };

const mapStateToPropsAction = {downloadMap, downloadBeaconList, updatePosition};


export default connect(mapStateToProps, mapStateToPropsAction)(FloorPlan);
