
document.getElementById("weatherForm").addEventListener("submit", async function(e) {
    e.preventDefault()
    let formData = new FormData(this);
    let response = await fetch("/get_weather", {
        method: "POST",
        body: formData
    })
    let data = await response.json();
    let resultDiv = document.getElementById("result")
    if (data.error) {
        resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
    } 
    else {
        resultDiv.innerHTML = `
            <p><strong>Temperature:</strong> ${data.temperature}°C</p>
            <p><strong>Humidity:</strong> ${data.humidity}%</p>
            <p><strong>Description:</strong> ${data.description}</p>
        `
        ;
    }
});
   