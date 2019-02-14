import React from 'react'


export const PriorityLocation = (Props) => {

    const {
        areas
    } = Props;

    function calculateAreaWithPriority1() {
        let result = [];
        let areasPriority1 = areas.priority1[0];
        console.log("areasPriority1: ", areasPriority1);
        for (let i = 0; i < areas.priority2.length; i++) {
            for (let j = 0; j < areas.priority2[i].length; j++) {
                // areasPriority1.includes(areas.priority2[i][j]) ?
                //     !result.includes(areas.priority2[i][j]) ? result.push(areas.priority2[i][j]) : null : null;
                areasPriority1.some((element) => {
                    return element[0] === areas.priority2[i][j][0] && element[1] === areas.priority2[i][j][1]
                }) ?
                    !result.some((element) => {
                        //console.log("2: ", element[0] === areas.priority2[i][j][0] || element[1] === areas.priority2[i][j][1]);
                        return element[0] === areas.priority2[i][j][0] && element[1] === areas.priority2[i][j][1]
                    }) ? result.push(areas.priority2[i][j]) : null : null;
            }
        }

        console.log("Result: ", result);
        if (result.length > 0) {
            return result
        }

        return areasPriority1;

    }

    function calculateAreaWithPriority2() {
        let result = [];

        if(areas.priority2.length === 1){
            return areas.priority2[0]
        }
        let adder = 1;
        for (let i = 0; i < areas.priority2.length - 1; i++) {
            for (let j = 0; j < areas.priority2[i + adder].length; j++) {
                areas.priority2[i].some((element) => {
                    return element[0] === areas.priority2[i+adder][j][0] && element[1] === areas.priority2[i+adder][j][1]
                }) ? result.push(areas.priority2[i+adder][j]): null;
            }
            adder++;
        }
        return result;
    }

    function calculateArea() {
        console.log("Entrando a priorityLocation");
        if (areas.priority1.length !== 0) {
            return calculateAreaWithPriority1();
        } else {
            return calculateAreaWithPriority2();
        }
    }

    return calculateArea();


};

//Esto me tiene que devolver un area en la que debería estar el dispositivo.