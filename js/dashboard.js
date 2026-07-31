var dashboard = (function() {

    function render() {
        var stats = calculateStats();
        var weather = getWeatherData();
        var location = getSavedLocationName();
        
        var html = '';
        html += '<div class="dashboard-container">';
        
        // WELCOME CARD
        html += '<div style="background:#fff;border-radius:16px;padding:20px 16px;margin-bottom:16px;box-shadow:0 2px 12px rgba(0,0,0,0.06);border:1px solid #e8e8e8;">';
        
        html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">';
        html += '<div style="width:48px;height:48px;background:linear-gradient(135deg,#E8F5E9,#C8E6C9);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">👨‍🌾</div>';
        html += '<div style="flex:1;">';
        html += '<div id="greetingText" style="font-size:17px;font-weight:700;color:#1B5E20;">' + getGreeting() + '</div>';
        html += '<div style="font-size:12px;color:#888;">Semoga panen melimpah hari ini!</div>';
        html += '</div>';
        
        html += '<div style="text-align:center;flex-shrink:0;">';
        html += '<div id="weatherIcon" style="font-size:28px;">' + weather.icon + '</div>';
        html += '<div id="weatherTemp" style="font-size:13px;font-weight:600;color:#555;">' + weather.temp + '</div>';
        html += '<div id="weatherHumid" style="font-size:10px;color:#999;">' + weather.humid + '</div>';
        html += '</div>';
        html += '</div>';
        
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #f0f0f0;">';
        html += '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#888;">';
        html += '<i class="far fa-calendar-alt" style="color:#2E7D32;"></i>';
        html += '<span id="dateTimeText">Memuat...</span>';
        html += '</div>';
        html += '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#888;">';
        html += '<i class="fas fa-map-marker-alt" style="color:#D32F2F;"></i>';
        html += '<span id="locText">' + location + '</span>';
        html += '</div>';
        html += '</div>';
        
        html += '</div>';

        // PANEL MONITOR SENSOR
        html += '<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e0e0e0;">';
        html += '<div style="font-size:13px;font-weight:700;color:#1B5E20;text-transform:uppercase;margin-bottom:12px;"><i class="fas fa-sliders-h"></i> Monitoring Sensor Terakhir</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">';
        
        // PERBAIKAN: Memastikan pemanggilan Router.navigate menggunakan format string yang tepat
        html += '<div onclick="Router.navigate(\'nutrisi\')" style="background:#F3E5F5;padding:14px 8px;border-radius:10px;cursor:pointer;transition:transform 0.1s;" onactive="this.style.transform=\'scale(0.95)\'">';
        html += '<i class="fas fa-flask" style="color:#7B1FA2;font-size:20px;margin-bottom:6px;"></i>';
        html += '<div style="font-size:18px;font-weight:bold;color:#7B1FA2;">' + (stats.ppmTerakhir || '-') + '</div>';
        html += '<div style="font-size:11px;color:#666;">PPM</div></div>';

        html += '<div onclick="Router.navigate(\'nutrisi\')" style="background:#E0F2F1;padding:14px 8px;border-radius:10px;cursor:pointer;transition:transform 0.1s;" onactive="this.style.transform=\'scale(0.95)\'">';
        html += '<i class="fas fa-vial" style="color:#00838F;font-size:20px;margin-bottom:6px;"></i>';
        html += '<div style="font-size:18px;font-weight:bold;color:#00838F;">' + (stats.phTerakhir || '-') + '</div>';
        html += '<div style="font-size:11px;color:#666;">pH</div></div>';

        html += '<div onclick="Router.navigate(\'nutrisi\')" style="background:#E3F2FD;padding:14px 8px;border-radius:10px;cursor:pointer;transition:transform 0.1s;" onactive="this.style.transform=\'scale(0.95)\'">';
        html += '<i class="fas fa-thermometer-half" style="color:#1976D2;font-size:20px;margin-bottom:6px;"></i>';
        html += '<div style="font-size:18px;font-weight:bold;color:#1976D2;">' + (stats.suhuAirTerakhir || '-') + '</div>';
        html += '<div style="font-size:11px;color:#666;">Suhu Air</div></div>';

        html += '</div></div>';
        
        // STATS GRID
        html += '<div class="stats-grid">';
        html += makeStatCard('Total Tanaman', 'fa-seedling', '#E8F5E9', '#2E7D32', stats.totalTanaman, 'tanaman');
        html += makeStatCard('Tanaman Hidup', 'fa-heart', '#FFF3E0', '#F57C00', stats.tanamanHidup, 'tanaman');
        html += makeStatCard('Sudah Polinasi', 'fa-feather', '#E3F2FD', '#1976D2', stats.sudahPolinasi, 'polinasi');
        html += makeStatCard('Fix Buah', 'fa-apple-alt', '#FCE4EC', '#D32F2F', stats.fixBuah, 'buah');
        html += makeStatCard('Panen Hari Ini', 'fa-box', '#FFF9C4', '#F9A825', stats.panenHariIni, 'panen');
        html += makeStatCard('Tugas Pending', 'fa-tasks', '#FFEBEE', '#D32F2F', stats.tugasPending, 'jadwal');
        html += '</div>';
        
        html += '</div>';
        return html;
    }

    function init() {
        updateDateTime();
        setInterval(updateDateTime, 30000);
    }

    function getWeatherData() {
        try {
            var saved = localStorage.getItem('cozycs_weather');
            if (saved) {
                var data = JSON.parse(saved);
                return {
                    icon: data.icon || '⛅',
                    temp: (data.temp !== undefined && data.temp !== null ? data.temp : '--') + '°C',
                    humid: (data.humid !== undefined && data.humid !== null ? data.humid : '--') + '%'
                };
            }
        } catch(e) {}
        return { icon: '⛅', temp: '--°C', humid: '--%' };
    }

    function getSavedLocationName() {
        try {
            var saved = localStorage.getItem('cozycs_location');
            if (saved) {
                var data = JSON.parse(saved);
                return data.city || 'Cozycs Farm';
            }
        } catch(e) {}
        return 'Cozycs Farm';
    }

    function updateDateTime() {
        var now = new Date();
        var days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
        var dtEl = document.getElementById('dateTimeText');
        var greetEl = document.getElementById('greetingText');
        if (dtEl) dtEl.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear() + '  |  ' + ('0'+now.getHours()).slice(-2) + ':' + ('0'+now.getMinutes()).slice(-2) + ' WIB';
        if (greetEl) greetEl.textContent = getGreeting();
    }

    function makeStatCard(label, icon, bg, color, value, targetPage) {
        // PERBAIKAN: Navigasi router yang lebih kokoh
        var action = targetPage ? ' onclick="if(typeof Router !== \'undefined\') { Router.navigate(\'' + targetPage + '\'); }" style="cursor:pointer;"' : '';
        return '<div class="stat-card"' + action + '>' +
            '<div class="stat-icon" style="background:' + bg + '"><i class="fas ' + icon + '" style="color:' + color + '"></i></div>' +
            '<div class="stat-info"><span class="stat-value">' + value + '</span><span class="stat-label">' + label + '</span></div>' +
            '</div>';
    }

    function calculateStats() {
        var tanaman = Storage.getAll(Storage.KEYS.TANAMAN) || [];
        var nutrisi = Storage.getAll(Storage.KEYS.NUTRISI) || [];
        var panen = Storage.getAll(Storage.KEYS.PANEN) || [];
        var today = getToday();
        
        // PERBAIKAN: Pastikan data nutrisi tidak crash kalau kosong
        var sortedNutrisi = nutrisi.slice().sort(function(a, b) { 
            return new Date(b.tanggal) - new Date(a.tanggal); 
        });
        var latestNutrisi = sortedNutrisi[0] || {};
        
        var pendingTasks = 0;
        try { if (typeof Notification !== 'undefined' && typeof Notification.getPendingTaskCount === 'function') pendingTasks = Notification.getPendingTaskCount(); } catch(e) {}
        
        return {
            totalTanaman: tanaman.length,
            tanamanHidup: tanaman.filter(function(t) { return t.status_tanaman !== 'mati' && t.status_panen !== 'panen'; }).length,
            sudahPolinasi: tanaman.filter(function(t) { return t.status_polinasi === 'sudah polinasi'; }).length,
            fixBuah: tanaman.filter(function(t) { return t.status_buah === 'fix buah'; }).length,
            // PERBAIKAN: Penanganan jika nilai 0 agar tetap muncul
            ppmTerakhir: latestNutrisi.ppm_pagi !== undefined ? latestNutrisi.ppm_pagi : (latestNutrisi.ppm_sore !== undefined ? latestNutrisi.ppm_sore : null),
            phTerakhir: latestNutrisi.ph_pagi !== undefined ? latestNutrisi.ph_pagi : (latestNutrisi.ph_sore !== undefined ? latestNutrisi.ph_sore : null),
            suhuAirTerakhir: latestNutrisi.suhu_air !== undefined ? latestNutrisi.suhu_air : null,
            panenHariIni: panen.filter(function(p) { return p.tanggal === today; }).length,
            tugasPending: pendingTasks
        };
    }

    function getToday() { return new Date().toISOString().split('T')[0]; }

    function getGreeting() {
        var h = new Date().getHours();
        if (h < 11) return 'Selamat Pagi';
        if (h < 15) return 'Selamat Siang';
        if (h < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    }

    return { render: render, init: init };

})();
