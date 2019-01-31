import React from 'react'


export const PriorityAreaCalculator = (Props) => {

    const {
        beaconsOnPriority,
        plan
    } = Props;

    function calculateArea(beacon){
        let result = [];
        let i = beacon.x - beacon.distance;
        let j = beacon.y - beacon.distance;
        let stop = (beacon.distance * 2) - 1;
        for(i ; i <= stop; i++){
            for(j; j <= stop; j++){
                map[i][j] === 1 ? result.push([i,j]): null;
            }
        }
        return result;
    }



    function calculatePriorities (beaconsOnPriority){
        let priority1 = [];
        let priority2 = [];
        beaconsOnPriority.forEach((beacon) => {
            beacon.distance < 5 ? priority1.push(calculateArea(beacon)) : priority2.push(calculateArea(beacon))
        });
        return {
            priority1: priority1,
            priority2: priority2
        }
    }

    return calculatePriorities(beaconsOnPriority);

};