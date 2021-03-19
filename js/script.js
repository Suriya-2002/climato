const loading = document.querySelector('.loading');

const parallaxScrollUp = document.querySelectorAll('.parallax-scroll-up');
const headingPrimary = document.querySelector('.heading-primary');

const weatherPrimary = document.querySelector('.weather__primary');
const weatherSecondary = document.querySelector('.weather__secondary');

const header = document.querySelector('.header');
const headerShadow = document.querySelector('.header__shadow');

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

const footerShadow = document.querySelector('.footer__shadow');

const headerOverlayColors = [
    'header--black',
    'header--blue',
    'header--pink',
    'header--green',
    'header--orange',
    'header--red',
];

let temperatureFahrenheit;
let temperatureCelsius;
let temperatureFeelsLikeFahrenheit;
let temperatureFeelsLikeCelsius;

let errorGlobal = false;

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

const changeBackgroundColor = (colorDark, colorLight) => {
    weatherPrimary.style.background = `linear-gradient(${colorDark}, ${colorLight})`;
    weatherSecondary.style.background = `linear-gradient(${colorLight}, ${colorDark}) `;
    headerShadow.style.background = `linear-gradient(to top, ${colorDark} 70%, transparent)`;

    if (screen.width < 1200)
        headerShadow.style.background = `linear-gradient(to top, ${colorDark} 80%, transparent)`;

    footerShadow.style.background = `linear-gradient(${colorDark}, #000)`;
};

const getEmoji = temperature => {
    icon.style.display = 'inline-block';
    headerOverlayColors.forEach(color => header.classList.remove(color));

    if (temperature > 45) {
        icon.src = './assets/images/hot.gif';
        header.classList.add('header--red');
        changeBackgroundColor('#bd4f6c', '#fc575e');
    } else if (temperature > 30) {
        icon.src = './assets/images/sunglass.gif';
        header.classList.add('header--orange');
        changeBackgroundColor('#f9484a', '#fbd72b');
    } else if (temperature > 20) {
        icon.src = './assets/images/blessed.gif';
        header.classList.add('header--green');
        changeBackgroundColor('#28b485', '#7ed56f');
    } else if (temperature > 10) {
        icon.src = './assets/images/sleep.gif';
        header.classList.add('header--pink');
        changeBackgroundColor('#ff748b', '#fe7bb0');
    } else {
        icon.src = './assets/images/cold.gif';
        header.classList.add('header--blue');
        changeBackgroundColor('#2a2a72', '#009ffd');
    }
};

const updateUI = data => {
    const {
        temp_c,
        temp_f,
        condition: { text: description },
        feelslike_c,
        feelslike_f,
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

    temperatureCelsius = temp_c;
    temperatureFahrenheit = temp_f;

    temperatureFeelsLikeCelsius = feelslike_c;
    temperatureFeelsLikeFahrenheit = feelslike_f;

    timeZoneDOM.textContent = `${tz_id.split('/')[0]} / ${tz_id.split('/')[1]}`;
    areaDOM.textContent = `${area}, ${region}`;
    countryDOM.textContent = country;

    getEmoji(temp_c);

    if (unitsDOM.getAttribute('data-units') === 'celsius') {
        temperatureDOM.textContent = temperatureCelsius;
        unitsDOM.textContent = 'C';

        popUpValue.textContent = temperatureFeelsLikeCelsius;
        popUpUnits.textContent = 'C';
    } else if (unitsDOM.getAttribute('data-units') === 'fahrenheit') {
        temperatureDOM.textContent = temperatureFahrenheit;
        unitsDOM.textContent = 'F';

        popUpValue.textContent = temperatureFeelsLikeFahrenheit;
        popUpUnits.textContent = 'F';
    }

    degreeDOM.innerHTML = '&deg;';
    descriptionDOM.textContent = description;

    searchInput.value = '';

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

const changeTemperatureUnits = () => {
    if (unitsDOM.getAttribute('data-units') === 'celsius') {
        unitsDOM.setAttribute('data-units', 'fahrenheit');

        temperatureDOM.textContent = temperatureFahrenheit;
        unitsDOM.textContent = 'F';

        popUpValue.textContent = temperatureFeelsLikeFahrenheit;
        popUpUnits.textContent = 'F';
    } else if (unitsDOM.getAttribute('data-units') === 'fahrenheit') {
        unitsDOM.setAttribute('data-units', 'celsius');

        temperatureDOM.textContent = temperatureCelsius;
        unitsDOM.textContent = 'C';

        popUpValue.textContent = temperatureFeelsLikeCelsius;
        popUpUnits.textContent = 'C';
    }
};

const apiKey = '8ab0cd3f17d54511bde60005210203';

const getWeatherWithLocation = () => {
    const location = searchInput.value;
    const api = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    fetch(api)
        .then(response => response.json())
        .then(data => {
            updateUI(data);
            errorGlobal = false;
        })
        .catch(error => {
            icon.style.display = 'none';
            descriptionDOM.innerHTML = `<b>${location[0].toUpperCase() + location.slice(1)}</b> not found.`;
            errorGlobal = true;
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
                    errorGlobal = false;
                })
                .catch(error => {
                    icon.style.display = 'none';
                    errorGlobal = true;
                });
        },
        error => {
            icon.style.display = 'none';
            errorGlobal = true;

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

    setTimeout(() => {
        loading.classList.add('loading--hidden');
    }, 1000);
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

temperatureContainerDOM.addEventListener('click', () => {
    if (!errorGlobal) changeTemperatureUnits();
});

temperatureContainerDOM.addEventListener('mouseenter', () => {
    if (!errorGlobal) popUp.classList.add('pop-up--active');
});

temperatureContainerDOM.addEventListener('mouseleave', () => {
    setTimeout(() => {
        popUp.classList.remove('pop-up--active');
    }, 200);
});
