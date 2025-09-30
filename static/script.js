const cityInput = document.getElementById("city");
const resultDiv = document.getElementById("result");
const suggestionList = document.getElementById("suggestions");

let currentFocus = -1; // Track highlighted suggestion

// Autocomplete logic
cityInput.addEventListener("input", async function () {
    let prefix = this.value;
    currentFocus = -1; // reset when typing

    if (!prefix) {
        suggestionList.innerHTML = "";
        return;
    }

    let res = await fetch(`/city_suggestions?prefix=${prefix}`);
    let suggestions = await res.json();

    suggestionList.innerHTML = "";
    suggestions.forEach(city => {
        let div = document.createElement("div");
        div.innerHTML = city;
        div.classList.add("suggestion-item");

        div.addEventListener("click", () => {
            cityInput.value = city;
            suggestionList.innerHTML = "";
        });

        suggestionList.appendChild(div);
    });
});

// Keyboard navigation
cityInput.addEventListener("keydown", function (e) {
    let items = suggestionList.getElementsByClassName("suggestion-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
        currentFocus++;
        if (currentFocus >= items.length) currentFocus = 0;
        setActive(items);
    } else if (e.key === "ArrowUp") {
        currentFocus--;
        if (currentFocus < 0) currentFocus = items.length - 1;
        setActive(items);
    } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFocus > -1) {
            items[currentFocus].click();
        }
    }
});

function setActive(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("active-suggestion");
    }
    if (currentFocus >= 0 && currentFocus < items.length) {
        items[currentFocus].classList.add("active-suggestion");
    }
}

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (e.target !== cityInput && !suggestionList.contains(e.target)) {
        suggestionList.innerHTML = "";
    }
});

// Weather fetch logic
document.getElementById("weatherForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    let formData = new FormData(this);
    let response = await fetch("/get_weather", {
        method: "POST",
        body: formData
    });

    let data = await response.json();

    if (data.error) {
        resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
    } else {
        resultDiv.innerHTML = `
            <p><strong>Temperature:</strong> ${data.temperature}°C</p>
            <p><strong>Humidity:</strong> ${data.humidity}%</p>
            <p><strong>Description:</strong> ${data.description}</p>
        `;
    }
});
