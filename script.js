// script.js

class TraverseData {
    constructor(station, observedAngle, distance, easting = 0, northing = 0, bearing = 0) {
        this.station = station;
        this.observedAngle = observedAngle;
        this.distance = distance;
        this.bearing = bearing;
        this.delEasting = 0;
        this.delNorthing = 0;
        this.corrEasting = 0;
        this.corrNorthing = 0;
        this.easting = easting;
        this.northing = northing;
    }
}

let traverseDataList = [];
let initialBearing = 0;

function convertToDegrees(angleStr) {
    const [degrees, minutes, seconds] = angleStr.split(',').map(Number);
    return degrees + minutes / 60 + seconds / 3600;
}

function calculateBearing(observedAngle, initialBearing) {
    let backBearing = initialBearing > 180 ? initialBearing - 180 : initialBearing + 180;
    let bearing = backBearing + observedAngle;
    return bearing > 360 ? bearing - 360 : bearing;
}

function calculateDelEasting(distance, bearing) {
    return distance * Math.sin((Math.PI / 180) * bearing);
}

function calculateDelNorthing(distance, bearing) {
    return distance * Math.cos((Math.PI / 180) * bearing);
}

function addData() {
    const station = parseInt(document.getElementById('station').value);
    const observedAngle = convertToDegrees(document.getElementById('observedAngle').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const easting = parseFloat(document.getElementById('initialEasting').value);
    const northing = parseFloat(document.getElementById('initialNorthing').value);
    const bearing = convertToDegrees(document.getElementById('bearing').value);

    let data = new TraverseData(station, observedAngle, distance, easting, northing, bearing);
    traverseDataList.push(data);

    updateTable();
}

function updateTable() {
    const tableBody = document.getElementById('traverseTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    traverseDataList.forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.station}</td>
            <td>${data.observedAngle.toFixed(4)}</td>
            <td>${data.distance.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

function calculateTraverse() {
    for (let i = 1; i < traverseDataList.length; i++) {
        let currentData = traverseDataList[i];
        let previousData = traverseDataList[i - 1];

        currentData.bearing = calculateBearing(currentData.observedAngle, previousData.bearing);
        currentData.delEasting = calculateDelEasting(currentData.distance, currentData.bearing);
        currentData.delNorthing = calculateDelNorthing(currentData.distance, currentData.bearing);

        currentData.easting = previousData.easting + currentData.delEasting;
        currentData.northing = previousData.northing + currentData.delNorthing;
    }

    // Add corrections and recalculate bearings, eastings, northings if needed
    // ...

    updateTable();
}

document.getElementById('addDataBtn').addEventListener('click', addData);
document.getElementById('calculateBtn').addEventListener('click', calculateTraverse);
