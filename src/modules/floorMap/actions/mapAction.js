export const downloadMap = () => async (dispatch) => {
    let map = [];
    for (let i = 0; i < 10; i++) {
        let rowMap = [];
        for (let j = 0; j < 18; j++) {
            if (i === 9) {
                rowMap[j] = 1;
            } else if(i === 8){
                if(j < 8){
                    rowMap[j] = 0;
                }else{
                    rowMap[j] = 1;
                }
            }else if(i < 4){
                rowMap[j] = 0;
            }else if (i <= 7 && i > 3) {
                if (j < 8) {
                    rowMap[j] = 0;
                }else if (j >= 8) {
                    if(i === 4){
                        if(j >= 8 && j < 12){
                            rowMap[j] = 1;
                        }else{
                            rowMap[j] = 0;
                        }
                    }else if(i === 5){
                        if(j >= 8 && j < 14){
                            rowMap[j] = 1;
                        }else{
                            rowMap[j] = 0;
                        }
                    }else if(i === 6){
                        if(j < 14){
                            rowMap[j] = 1;
                        }else{
                            rowMap[j] = 0;
                        }
                    }else if(i === 7){
                        if(j < 17){
                            rowMap[j] = 1;
                        }else{
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

export const downloadBeaconList = () => {
    let beaconsList = [];
    beaconsList.push(["BlueUp-04-025412", 1 , 3]);
    beaconsList.push(["BlueUp-04-025411", 1 , 3]);
    beaconsList.push(["BlueUp-04-025410", 1 , 3]);

    dispatch({
        type: 'DOWNLOAD_BEACONLIST',
        payload: map
    })
};

export const updatePosition = (position, getState) => {
    let newMap = getState.plan;
    let prevPosition = x[position[0]][position[1]];
    newMap[position[0]][position[1]] = 5;

    dispatch({
        type: 'UPDATE_MAP',
        payload: newMap,
        prevPosition: prevPosition
    })
};