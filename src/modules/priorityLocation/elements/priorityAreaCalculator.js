import React from 'react'


export const PriorityAreaCalculator = (Props) => {

    const {
        beaconsOnPriority,
        plan
    } = Props;

    function calculateArea(beacon) {
        console.log("Plan: ", plan);
        let result = [];
        let i = beacon.x - beacon.distance + 1;
        let stop = (beacon.distance * 2) - 1;
        for (let xCounter = 0; xCounter < stop; xCounter++) {
            let j = beacon.y - beacon.distance + 1;
            let row = plan[i];
            if (row !== undefined) {
                for (let yCounter = 0; yCounter < stop; yCounter++) {
                    row[j] === 1 && row[j] !== undefined ? result.push([i, j]) : null;
                    j++
                }
            }
            i++
        }
        return result;
    }


    function calculatePriorities(beaconsOnPriority) {
        console.log("Entrando a priorityArea", beaconsOnPriority);
        let priority1 = [];
        let priority2 = [];
        beaconsOnPriority.forEach((beacon) => {
            beacon.distance < 5 ? priority1.push(calculateArea(beacon)) : priority2.push(calculateArea(beacon))
        });
        console.log({
            priority1: priority1,
            priority2: priority2
        });
        return {
            priority1: priority1,
            priority2: priority2
        }

    }

    return calculatePriorities(beaconsOnPriority);

};