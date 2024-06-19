async function haeData() {
    const vastaus = await fetch('http://localhost:3000/data');
    const data = await vastaus.text();

    if (data == "") {
        document.getElementById('lampotila').innerHTML = "Virhe dataa vastaanottaessa";
    }
    else {
        document.getElementById('lampotila').innerText = data + "°C";
    }
}

setInterval(haeData, 900000); // Update data every minute