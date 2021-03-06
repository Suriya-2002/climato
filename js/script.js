const parallaxScrollUp = document.querySelectorAll('.parallax-scroll-up');
const headingPrimary = document.querySelector('.heading-primary');

const popUp = document.querySelector('.pop-up');
const popUpValue = document.querySelector('.pop-up__value');
const popUpUnits = document.querySelector('.pop-up__units');

const gprsButton = document.querySelector('.gprs__icon');

const searchInput = document.querySelector('.search-bar__input');
const searchButton = document.querySelector('.search-bar__icon');

const timeZoneDOM = document.querySelector('.location__time-zone');
const areaDOM = document.querySelector('.location__area');
const countryDOM = document.querySelector('.location__country');
const icon = document.querySelector('.location__icon');

const temperatureContainerDOM = document.querySelector('.temperature');
const temperatureDOM = document.querySelector('.temperature__value');
const degreeDOM = document.querySelector('.temperature__degree');
const unitsDOM = document.querySelector('.temperature__units');
const descriptionDOM = document.querySelector('.temperature__description');

const precipitation1DOM = document.querySelector('.card__content-value--precipitation-1');
const precipitation2DOM = document.querySelector('.card__content-value--precipitation-2');

const wind1DOM = document.querySelector('.card__content-value--wind-1');
const wind2DOM = document.querySelector('.card__content-value--wind-2');
const windSecondary1DOM = document.querySelector('.card__content-secondary-value--wind-1');
const windSecondary2DOM = document.querySelector('.card__content-secondary-value--wind-2');

const pressure1DOM = document.querySelector('.card__content-value--pressure-1');
const pressure2DOM = document.querySelector('.card__content-value--pressure-2');

const humidityDOM = document.querySelector('.card__content-value--humidity');
const cloudDOM = document.querySelector('.card__content-value--cloud');
const uvDOM = document.querySelector('.card__content-value--uv');

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

    popUpValue.textContent = '--';
    popUpUnits.textContent = '';

    precipitation1DOM.textContent = '--';
    precipitation2DOM.textContent = '--';

    wind1DOM.textContent = '--';
    wind2DOM.textContent = '--';
    windSecondary1DOM.textContent = '??';
    windSecondary2DOM.textContent = '??';

    pressure1DOM.textContent = '--';
    pressure2DOM.textContent = '--';

    humidityDOM.textContent = '--';
    cloudDOM.textContent = '--';
    uvDOM.textContent = '--';
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
        temp_c,
        condition: { text: description },
        feelslike_c,
        precip_mm,
        precip_in,
        wind_kph,
        wind_mph,
        wind_dir,
        wind_degree,
        pressure_mb,
        pressure_in,
        humidity,
        cloud,
        uv,
    } = data.current;
    const { tz_id, name: area, region, country } = data.location;

    timeZoneDOM.textContent = `${tz_id.split('/')[0]} / ${tz_id.split('/')[1]}`;
    areaDOM.textContent = `${area}, ${region}`;
    countryDOM.textContent = country;

    getEmoji(temp_c);

    temperatureDOM.textContent = temp_c;
    degreeDOM.innerHTML = '&deg;';
    unitsDOM.textContent = 'C';
    descriptionDOM.textContent = description;

    searchInput.value = '';

    popUpValue.textContent = feelslike_c;
    popUpUnits.textContent = 'C';

    precipitation1DOM.textContent = precip_mm;
    precipitation2DOM.textContent = precip_in;

    wind1DOM.textContent = wind_kph;
    wind2DOM.textContent = wind_mph;
    windSecondary1DOM.textContent = wind_dir;
    windSecondary2DOM.textContent = wind_degree;

    pressure1DOM.textContent = pressure_mb;
    pressure2DOM.textContent = pressure_in;

    humidityDOM.textContent = humidity;
    cloudDOM.textContent = cloud;
    uvDOM.textContent = uv;
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

temperatureContainerDOM.addEventListener('mouseenter', () => {
    popUp.classList.add('pop-up--active');
});

temperatureContainerDOM.addEventListener('mouseleave', () => {
    setTimeout(() => {
        popUp.classList.remove('pop-up--active');
    }, 200);
});
