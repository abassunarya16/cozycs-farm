var jadwal = (function() {

    function render() {
        var tasks = getTasks();
        var done = tasks.filter(function(t) { return t.done; }).length;
        var total = tasks.length || 1;
        var pct = Math.round((done / total) * 100);
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title">';
        html += '<h2><i class="fas fa-calendar-check"></i> Jadwal Harian</h2>';
        html += '<span class="text-muted">' + formatToday() + '</span>';
        html += '</div>';
        
        // Progress
        html += '<div class="card">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
        html += '<span style="font-weight:600;">📋 Progres Hari Ini</span>';
        html += '<span style="font-weight:700;color:#2E7D32;">' + pct + '% (' + done + '/' + tasks.length + ')</span>';
        html += '</div>';
        html += '<div style="background:#eee;border-radius:6px;height:10px;overflow:hidden;">';
        html += '<div style="background:#2E7D32;height:100%;width:' + pct + '%;"></div>';
        html += '</div>';
        html += '</div>';
        
        // Checklist
        html += '<div class="card">';
        html += '<h4 style="margin-bottom:12px;">📝 Daftar Tugas</h4>';
        
        tasks.forEach(function(task) {
            // Style untuk tugas selesai: BURAM bukan coret
            var bg = task.done ? '#E8F5E9' : '#fff';
            var border = task.done ? '#A5D6A7' : '#e0e0e0';
            var opacity = task.done ? '0.55' : '1';
            var textColor = task.done ? '#888' : '#333';
            var fontWeight = task.done ? '400' : '500';
            
            html += '<div style="background:' + bg + ';border:1px solid ' + border + ';border-radius:10px;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px;opacity:' + opacity + ';">';
            html += '<input type="checkbox" ' + (task.done ? 'checked' : '') + ' onchange="jadwal.toggle(\'' + task.key + '\', this.checked)" style="width:20px;height:20px;accent-color:#2E7D32;cursor:pointer;">';
            html += '<i class="fas ' + task.icon + '" style="color:#2E7D32;width:20px;text-align:center;"></i>';
            html += '<span style="font-size:14px;color:' + textColor + ';font-weight:' + fontWeight + ';">' + task.task + '</span>';
            
            // Icon status
            if (task.done) {
                html += '<i class="fas fa-check-circle" style="color:#2E7D32;margin-left:auto;font-size:16px;"></i>';
            } else {
                html += '<i class="far fa-circle" style="color:#ccc;margin-left:auto;font-size:16px;"></i>';
            }
            
            html += '</div>';
        });
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }

    function init() {}

    function getTasks() {
        var today = getToday();
        var jd = Storage.getAll(Storage.KEYS.JADWAL);
        var tj = null;
        
        for (var i = 0; i < jd.length; i++) {
            if (jd[i].tanggal === today) {
                tj = jd[i];
                break;
            }
        }
        
        return [
            { task: 'Cek PPM pagi', key: 'cek_ppm_pagi', icon: 'fa-flask', done: !!(tj && tj.cek_ppm_pagi) },
            { task: 'Cek pH pagi', key: 'cek_ph_pagi', icon: 'fa-vial', done: !!(tj && tj.cek_ph_pagi) },
            { task: 'Polinasi', key: 'polinasi', icon: 'fa-feather', done: !!(tj && tj.polinasi) },
            { task: 'Seleksi buah', key: 'seleksi_buah', icon: 'fa-check-double', done: !!(tj && tj.seleksi_buah) },
            { task: 'Pruning', key: 'pruning', icon: 'fa-cut', done: !!(tj && tj.pruning) },
            { task: 'Penyemprotan', key: 'penyemprotan', icon: 'fa-spray-can', done: !!(tj && tj.penyemprotan) },
            { task: 'Cek akar', key: 'cek_akar', icon: 'fa-seedling', done: !!(tj && tj.cek_akar) },
            { task: 'Cek hama', key: 'cek_hama', icon: 'fa-bug', done: !!(tj && tj.cek_hama) }
        ];
    }

    function toggle(key, checked) {
        var today = getToday();
        var jd = Storage.getAll(Storage.KEYS.JADWAL);
        var tj = null;
        
        for (var i = 0; i < jd.length; i++) {
            if (jd[i].tanggal === today) {
                tj = jd[i];
                break;
            }
        }
        
        if (!tj) {
            tj = { id: 'jdwl-' + Date.now(), tanggal: today };
            Storage.create(Storage.KEYS.JADWAL, tj);
        }
        
        tj[key] = checked;
        Storage.update(Storage.KEYS.JADWAL, tj.id, tj);
        
        if (typeof Notification !== 'undefined' && Notification.updateBadge) {
            Notification.updateBadge();
        }
        
        Router.navigate('jadwal');
    }

    function formatToday() {
        var d = new Date();
        var months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    function getToday() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    return { render: render, init: init, toggle: toggle };

})();