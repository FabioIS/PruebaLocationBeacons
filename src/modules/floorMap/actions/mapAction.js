

export const downloadMap = () => async (dispatch) => {
    let map = [];
    for (let i = 0; i < 10; i++) {
        let rowMap = [];
        for (let j = 0; j < 18; j++) {
            if (i === 9) {
                rowMap[j] = 1;
            } else if (i === 8) {
                if (j < 8) {
                    rowMap[j] = 0;
                } else {
                    rowMap[j] = 1;
                }
            } else if (i < 4) {
                rowMap[j] = 0;
            } else if (i <= 7 && i > 3) {
                if (j < 8) {
                    rowMap[j] = 0;
                } else if (j >= 8) {
                    if (i === 4) {
                        if (j >= 8 && j < 12) {
                            rowMap[j] = 1;
                        } else {
                            rowMap[j] = 0;
                        }
                    } else if (i === 5) {
                        if (j >= 8 && j < 14) {
                            rowMap[j] = 1;
                        } else {
                            rowMap[j] = 0;
                        }
                    } else if (i === 6) {
                        if (j < 14) {
                            rowMap[j] = 1;
                        } else {
                            rowMap[j] = 0;
                        }
                    } else if (i === 7) {
                        if (j < 17) {
                            rowMap[j] = 1;
                        } else {
                            rowMap[j] = 0;
                        }
                    }
                }
            }
            map[i] = rowMap;
        }
    }
    dispatch({
        type: 'DOWNLOAD_MAP',
        payload: map
    })
};


// Descarga las posiciones absolutas de las balizas en el mapa. Cualquier modificación en nombre o posición HACERLA AQUI
export const downloadBeaconList = () => async (dispatch) => {
    let beaconsList = {
        "BlueUp-04-025410":{x: 9,y: 3, distance: NaN},
        "BlueUp-04-025411":{x: 4,y: 10, distance: NaN},
        "BlueUp-04-025412":{x: 8,y: 17, distance: NaN}
    };
    console.log("BeaconsList: ",beaconsList);

    dispatch({
        type: 'DOWNLOAD_BEACONLIST',
        payload: beaconsList
    })
};

//Devolvemos el valor anterior al mapa y actualizamos la nueva posición.
export const updatePosition = (position) => async (dispatch, getState) => {
    if (position !== undefined) {
        let newMap = getState().MapReducer.plan;
        let prevPosition = getState().MapReducer.prevPosition;
        if(prevPosition.length > 0) {
            prevPosition.forEach((oldPosition) => {
                newMap[oldPosition[1]][oldPosition[2]] = oldPosition[0];
            });
        }
        prevPosition = [];
        // Posicion 0 = valor del mapa, posición 1 = eje x, posicion 2 = eje Y
        for(let i = 0; i < position.length; i++){
            prevPosition[i] = [newMap[position[i][0]][position[i][1]], position[i][0], position[i][1]];
            newMap[position[i][0]][position[i][1]] = 5;
        }
        console.log("PrevPosition: ", prevPosition);
        // console.log("Vamos a ver: ", prevPosition);
        // console.log("NewMap : ", newMap);
        // console.log("PrevPosition : ",prevPosition);
        dispatch({
            type: 'UPDATE_MAP',
            payload: {newMap: newMap, prevPosition: prevPosition}
        })
    }
};