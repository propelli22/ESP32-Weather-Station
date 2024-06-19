async function haeData() {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 30000);

    try {
        const response = await Promise.race([
            fetch('http://localhost:3000/data', { signal: controller.signal }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 30000)
            )
        ]);
        
        const data = await response.text();
        
        if (data == "") {
            document.getElementById('lampotila').innerHTML = "Ei dataa";
        } else {
            document.getElementById('lampotila').innerText = data + "°C";
        }
    } catch (error) {
        console.error(error);
        document.getElementById('lampotila').innerHTML = "Tapahtui virhe";
    } finally {
        clearTimeout(timeout);
        const d = new Date();
        const tunnit = d.getHours();
        const minuutit = d.getMinutes().toString().padStart(2, '0');
        const paiva = d.getDate();
        const kuukausi = d.getMonth() + 1;
        const vuosi = d.getFullYear();
        document.getElementById('paivitetty').innerHTML = `Viimeksi päivitetty: ${paiva}.${kuukausi}.${vuosi} klo ${tunnit}:${minuutit}`;
    }
}

setInterval(haeData, 900000); // 15min delay
window.onload = haeData;