import React, {Component} from 'react'
import {connect} from "react-redux";
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {downloadMap, downloadBeaconList, updatePosition} from "./actions/mapAction";
import {PriorityLocation} from "../priorityLocation/priorityLocation";
import {PriorityAreaCalculator} from "../priorityLocation/elements/priorityAreaCalculator";
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
        this.interval = setInterval(async () => {
            await this.props.updatePosition(this._calculatePosition());
            this.setState();
        }, 3000);
        this.reset = setInterval(() => {
            //resetScan();
            this.setState({});
        }, 5000);

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
            beacon.accuracy < 10 ? result.push(beacon) : null;
        });
        return result;
        // return this.props.scanner.beaconsOnRange.sort(function (a, b) {
        //     return a.distance - b.distance;
        //  });

    };

    _calculatePosition = () => {

        let beacons = this._getBeaconsOnPriority();
        let finder = [];
        for (let i = 0; i < beacons.length; i++) {
            let beaconPosition = this.props.mapRedux.beaconsList[beacons[i].name];
            console.log("Beacon pusheado: ", beaconPosition);
            finder[i] = {x: beaconPosition.x, y: beaconPosition.y, distance: beacons[i].accuracy};
        }
        let  areas = PriorityAreaCalculator({
            beaconsOnPriority: finder,
            plan: this.props.mapRedux.plan
        });
        return PriorityLocation({
            areas: areas
        })


    }
}

render()
{
    return (
        <View style={{flex: 12, flexDirection: 'column'}}>
            <View style={{flex: 2}}>
                <AuxModule/>
                {this.props.mapRedux.plan.map((row, index) => {
                    return this.renderRow(row, index)
                })}
            </View>
            <TouchableOpacity style={styles.button} onPress={() => startScan()}>
                <Text style={styles.buttonText}>Start Scanner</Text>
            </TouchableOpacity>
        </View>
    )
}


}

const
    styles = StyleSheet.create({
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

const
    mapStateToPropsAction = {downloadMap, downloadBeaconList, updatePosition};


export default connect(mapStateToProps, mapStateToPropsAction)

(
    FloorPlan
)
;
