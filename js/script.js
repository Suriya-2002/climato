const parallaxScrollUp = document.querySelectorAll('.parallax-scroll-up');
const headingPrimary = document.querySelector('.heading-primary');

const gprsButton = document.querySelector('.gprs__icon');

const searchInput = document.querySelector('.search-bar__input');
const searchButton = document.querySelector('.search-bar__icon');

const timeZoneDOM = document.querySelector('.location__time-zone');
const areaDOM = document.querySelector('.location__area');
const countryDOM = document.querySelector('.location__country');
const icon = document.querySelector('.location__icon');

const temperatureDOM = document.querySelector('.temperature__value');
const degreeDOM = document.querySelector('.temperature__degree');
const unitsDOM = document.querySelector('.temperature__units');
const descriptionDOM = document.querySelector('.temperature__description');

document.addEventListener('scroll', () => {
    const scroll = window.scrollY;

    parallaxScrollUp.forEach(element => {
        const speed = element.getAttribute('data-speed');
        element.style.transform = `translateY(${Math.trunc(scroll * speed)}px)`;
    });

    const speed = headingPrimary.getAttribute('data-speed');
    headingPrimary.style.transform = `translate(-50%, calc(-50% + ${Math.trunc(scroll * speed)}px))`;
    headingPrimary.style.opacity = ``;
});

const loadingUI = () => {
    icon.src = './assets/images/clock.gif';

    timeZoneDOM.textContent = '';
    areaDOM.textContent = '';
    countryDOM.textContent = '';

    temperatureDOM.textContent = '';
    degreeDOM.innerHTML = '';
    unitsDOM.textContent = '';
    descriptionDOM.textContent = 'Loading ...';

    searchInput.blur();
};

const getEmoji = temperature => {
    icon.style.display = 'inline-block';

    if (temperature > 45) icon.src = './assets/images/hot.gif';
    else if (temperature > 30) icon.src = './assets/images/sunglass.gif';
    else if (temperature > 20) icon.src = './assets/images/blessed.gif';
    else if (temperature > 10) icon.src = './assets/images/sleep.gif';
    else icon.src = './assets/images/cold.gif';
};

const updateUI = data => {
    const {
        temp_c: temperature,
        condition: { text: description },
    } = data.current;
    const { tz_id: timeZone, name: area, region, country } = data.location;

    timeZoneDOM.textContent = `${timeZone.split('/')[0]} / ${timeZone.split('/')[1]}`;
    areaDOM.textContent = `${area}, ${region}`;
    countryDOM.textContent = country;

    getEmoji(temperature);

    temperatureDOM.textContent = temperature;
    degreeDOM.innerHTML = '&deg;';
    unitsDOM.textContent = 'C';
    descriptionDOM.textContent = description;

    searchInput.value = '';
};

const apiKey = '8ab0cd3f17d54511bde60005210203';

const getWeatherWithLocation = () => {
    const location = searchInput.value;
    const api = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    fetch(api)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
        });
};

const geolocation = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const coordinates = position.coords;
            const latitude = coordinates.latitude;
            const longitude = coordinates.longitude;

            const api = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

            fetch(api)
                .then(response => response.json())
                .then(data => {
                    updateUI(data);
                });
        },
        error => {
            icon.style.display = 'none';

            if (error.code === 1) {
                descriptionDOM.innerHTML = 'Allow <b>Climato</b> to access this device location.';
            } else if (error.code === 2) {
                descriptionDOM.innerHTML = '<b>Climato</b> needs internet access.';
            }
        }
    );
};

window.addEventListener('load', () => {
    loadingUI();
    geolocation();
});

gprsButton.addEventListener('click', () => {
    loadingUI();
    geolocation();
});

searchButton.addEventListener('click', () => {
    loadingUI();
    getWeatherWithLocation();
});

window.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        loadingUI();
        getWeatherWithLocation();
    }
});
