var App = {
    init: function() {
        var loadBar = document.getElementById('splashLoaderBar');
        var loadText = document.getElementById('splashLoadingText');
        var percent = 0;
        
        if (loadBar && loadText) {
            loadBar.style.animation = 'none';
            loadBar.style.width = '0%';
            
            var loadingInterval = setInterval(function() {
                percent += Math.floor(Math.random() * 8) + 3;
                if (percent >= 100) {
                    percent = 100;
                    clearInterval(loadingInterval);
                    loadText.textContent = 'SELESAI! 100%';
                    loadBar.style.width = '100%';
                    finishLoading();
                } else {
                    loadText.textContent = 'MEMUAT... ' + percent + '%';
                    loadBar.style.width = percent + '%';
                }
            }, 200);
        } else {
            finishLoading();
        }
    }
};

function finishLoading() {
    try { Storage.init(); } catch(e) {}
    try { Notification.init(); } catch(e) {}
    try { Router.init(); } catch(e) {}
    
    fetchWeatherAndLocation();
    
    // Setup tombol-tombol (Waktu tunggu dikurangi agar langsung aktif)
    setTimeout(function() {
        // ==========================================
// TOMBOL SYNC / REFRESH
// ==========================================
var refreshBtn = document.getElementById('syncBtn');

if (refreshBtn) {

    refreshBtn.addEventListener('click', function (e) {

        e.preventDefault();

        var icon = this.querySelector('i');

        if (icon) {
            icon.classList.add('fa-spin');
        }

        // Ambil ulang lokasi & cuaca
        fetchWeatherAndLocation();

        // Refresh halaman yang sedang dibuka
        setTimeout(function () {

            if (typeof Router !== 'undefined') {
                Router.navigate(Router.getCurrentPage());
            }

            if (typeof Notification !== 'undefined' &&
                typeof Notification.updateBadge === 'function') {
                Notification.updateBadge();
            }

            if (icon) {
                icon.classList.remove('fa-spin');
            }

        }, 1000);

    });

}
        
        // ==========================================
        // TOMBOL NOTIFIKASI
        // ==========================================
        var notifBtn = document.getElementById('btnNotification');
        if (notifBtn) {
            notifBtn.addEventListener('click', function() {
                try { Notification.showNotificationPanel(); } catch(e) {}
            });
        }
    }, 500); // Waktu diubah dari 2000ms menjadi 500ms biar ga lemot saat diklik pertama kali
    
    // Hide splash
    setTimeout(function() {
        var splash = document.getElementById('splashScreen');
        var app = document.getElementById('appContainer');
        if (splash && app) {
            splash.classList.add('hide');
            app.style.display = 'block';
            setTimeout(function() { if (splash && splash.parentNode) splash.remove(); }, 600);
        }
    }, 400);
}

// ==========================================
// FETCH LOKASI & CUACA (Dengan penanganan error)
// ==========================================
function fetchWeatherAndLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(pos) {
                var lat = pos.coords.latitude;
                var lon = pos.coords.longitude;
                
                fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=10&addressdetails=1&accept-language=id')
                    .then(function(r) { return r.json(); })
                    .then(function(data) {
                        var addr = data.address || {};
                        var city = addr.city || addr.town || addr.village || addr.county || addr.state || 'Lokasi Anda';
                        localStorage.setItem('cozycs_location', JSON.stringify({ city: city, lat: lat, lon: lon }));
                        var locEl = document.getElementById('locText');
                        if (locEl) locEl.textContent = city;
                    }).catch(function(e){ console.log("Info: API Lokasi lambat/gagal"); });
                
                fetchCuaca(lat, lon);
            },
            function(err) { console.log("GPS Ditolak/Gagal membaca lokasi"); },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }
}

function fetchCuaca(lat, lon) {

    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=relative_humidity_2m,temperature_2m,weather_code')
        .then(function(r) {
            return r.json();
        })
        .then(function(data) {

            if (data && data.current) {

                var c = data.current;
                var temp = Math.round(c.temperature_2m);
                var humid = Math.round(c.relative_humidity_2m);
                var code = c.weather_code || 0;

                var icon = '⛅';

                if (code === 0) {
                    icon = '☀️';
                } else if (code <= 2) {
                    icon = '🌤️';
                } else if (code === 3) {
                    icon = '☁️';
                } else if (code <= 48) {
                    icon = '🌫️';
                } else if (code <= 67) {
                    icon = '🌧️';
                } else if (code >= 95) {
                    icon = '⛈️';
                }

                // Simpan ke LocalStorage
                localStorage.setItem('cozycs_weather', JSON.stringify({
                    icon: icon,
                    temp: temp,
                    humid: humid,
                    time: Date.now()
                }));

                // Update Dashboard jika elemen ada
                var iconEl = document.getElementById('weatherIcon');
                var tempEl = document.getElementById('weatherTemp');
                var humidEl = document.getElementById('weatherHumid');

                if (iconEl) iconEl.textContent = icon;
                if (tempEl) tempEl.textContent = temp + '°C';
                if (humidEl) humidEl.textContent = humid + '%';

                // Refresh Dashboard otomatis
                if (typeof Router !== 'undefined' &&
                    Router.getCurrentPage() === 'dashboard') {

                    setTimeout(function () {
                        Router.navigate('dashboard');
                    }, 100);
                }

            }

        })
        .catch(function(e) {
            console.log("Info: Gagal mengambil cuaca", e);
        });

}

// Auto refresh setiap 15 menit
setInterval(function() { fetchWeatherAndLocation(); }, 900000);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { App.init(); });
} else {
    App.init();
}
