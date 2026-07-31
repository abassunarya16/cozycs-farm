var Notification = (function() {

    // ========================================
    // TOAST NOTIFICATION
    // ========================================
    function showToast(message, type, duration) {
        type = type || 'info';
        duration = duration || 3000;
        
        var container = document.getElementById('toastContainer');
        if (!container) return;
        
        var icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        var colors = {
            success: '#4CAF50',
            error: '#D32F2F',
            warning: '#F57C00',
            info: '#1976D2'
        };
        
        var toast = document.createElement('div');
        toast.style.cssText = 'background:#fff;border-radius:10px;padding:12px 16px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;gap:10px;border-left:4px solid ' + (colors[type] || '#2E7D32') + ';margin-bottom:8px;font-size:13px;animation:slideIn 0.3s ease;max-width:300px;';
        toast.innerHTML = '<i class="fas ' + (icons[type] || 'fa-info-circle') + '" style="color:' + (colors[type] || '#2E7D32') + ';font-size:18px;"></i>' +
            '<span style="flex:1;">' + message + '</span>' +
            '<button style="background:none;border:none;color:#999;cursor:pointer;font-size:14px;" onclick="this.parentElement.remove()">✕</button>';
        
        container.appendChild(toast);
        
        if (duration > 0) {
            setTimeout(function() {
                if (toast.parentNode) toast.remove();
            }, duration);
        }
    }

    function success(msg, duration) { showToast(msg, 'success', duration); }
    function error(msg, duration) { showToast(msg, 'error', duration || 5000); }
    function warning(msg, duration) { showToast(msg, 'warning', duration); }
    function info(msg, duration) { showToast(msg, 'info', duration); }

    // ========================================
    // BADGE NOTIFICATION (Lonceng)
    // ========================================
    function updateBadge() {
        var badge = document.getElementById('notificationBadge');
        if (!badge) return;
        
        var count = getPendingTaskCount();
        
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    function getPendingTaskCount() {
        var tasks = getDailyTasks();
        var pending = tasks.filter(function(t) { return !t.done; });
        return pending.length;
    }

    // ========================================
    // TOGGLE TASK (KLIK LANGSUNG)
    // ========================================
    function toggleTask(key) {
    // Kalau tugas panen, arahkan ke halaman panen
    if (key === 'panen_urgent') {
        document.getElementById('modalContainer').style.display = 'none';
        Router.navigate('panen');
        return;
    }
    
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
        jd = Storage.getAll(Storage.KEYS.JADWAL);
        for (var j = 0; j < jd.length; j++) {
            if (jd[j].tanggal === today) { tj = jd[j]; break; }
        }
    }
    
    tj[key] = !tj[key];
    Storage.update(Storage.KEYS.JADWAL, tj.id, tj);
    
    updateBadge();
    
    if (tj[key]) {
        showToast('✅ Tugas selesai!', 'success', 1500);
    } else {
        showToast('🔄 Tugas dikembalikan', 'info', 1500);
    }
    
    setTimeout(function() { showNotificationPanel(); }, 300);
}

    // ========================================
    // DAILY TASKS
    // ========================================
    function getDailyTasks() {
        var today = getToday();
        var jd = Storage.getAll(Storage.KEYS.JADWAL);
        var tj = null;
        
        for (var i = 0; i < jd.length; i++) {
            if (jd[i].tanggal === today) {
                tj = jd[i];
                break;
            }
        }
        
        var tasks = [
            { task: 'Cek PPM pagi', key: 'cek_ppm_pagi', icon: 'fa-flask', done: !!(tj && tj.cek_ppm_pagi) },
            { task: 'Cek pH pagi', key: 'cek_ph_pagi', icon: 'fa-vial', done: !!(tj && tj.cek_ph_pagi) },
            { task: 'Polinasi', key: 'polinasi', icon: 'fa-feather', done: !!(tj && tj.polinasi) },
            { task: 'Seleksi buah', key: 'seleksi_buah', icon: 'fa-check-double', done: !!(tj && tj.seleksi_buah) },
            { task: 'Pruning', key: 'pruning', icon: 'fa-cut', done: !!(tj && tj.pruning) },
            { task: 'Penyemprotan', key: 'penyemprotan', icon: 'fa-spray-can', done: !!(tj && tj.penyemprotan) },
            { task: 'Cek akar', key: 'cek_akar', icon: 'fa-seedling', done: !!(tj && tj.cek_akar) },
            { task: 'Cek hama', key: 'cek_hama', icon: 'fa-bug', done: !!(tj && tj.cek_hama) }
        ];
        
        // Tambah tanaman siap panen
        var tanaman = Storage.getAll(Storage.KEYS.TANAMAN);
        var siapPanen = tanaman.filter(function(t) {
            return t.status_panen === 'siap panen' || (t.hst && t.hst >= 55 && t.status_panen !== 'panen');
        });
        
        if (siapPanen.length > 0) {
            tasks.push({
                task: siapPanen.length + ' tanaman siap panen!',
                key: 'panen_urgent',
                icon: 'fa-harvest',
                done: false,
                urgent: true
            });
        }
        
        return tasks;
    }

    // ========================================
    // NOTIFICATION PANEL
    // ========================================
    function showNotificationPanel() {
        var tasks = getDailyTasks();
        var pending = tasks.filter(function(t) { return !t.done; });
        var done = tasks.filter(function(t) { return t.done; });
        
        var content = '<div style="padding:0;">';
        
        // Header
        content += '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;">';
        content += '<h3 style="margin:0;font-size:16px;"><i class="fas fa-bell" style="color:#F57C00;"></i> Notifikasi Tugas</h3>';
        content += '<button onclick="document.getElementById(\'modalContainer\').style.display=\'none\'" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button>';
        content += '</div>';
        
        content += '<div style="padding:20px;">';
        
        // Progress
        var total = tasks.length;
        var pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
        content += '<div style="margin-bottom:16px;">';
        content += '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">';
        content += '<span style="font-size:13px;font-weight:600;">Progres Hari Ini</span>';
        content += '<span style="font-size:13px;font-weight:700;color:#2E7D32;">' + pct + '% (' + done.length + '/' + total + ')</span>';
        content += '</div>';
        content += '<div style="background:#eee;border-radius:6px;height:8px;overflow:hidden;">';
        content += '<div style="background:#2E7D32;height:100%;width:' + pct + '%;"></div>';
        content += '</div></div>';
        
        // Pending Tasks
        if (pending.length > 0) {
            content += '<div style="font-size:13px;font-weight:700;color:#D32F2F;margin-bottom:10px;"><i class="fas fa-exclamation-circle"></i> ' + pending.length + ' Tugas Pending</div>';
            pending.forEach(function(task) {
                var bg = task.urgent ? '#FFF3E0' : '#fff';
                var border = task.urgent ? '#FFCC80' : '#e0e0e0';
                content += '<div onclick="Notification.toggleTask(\'' + task.key + '\')" style="background:' + bg + ';border:1px solid ' + border + ';border-radius:8px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;gap:10px;cursor:pointer;">';
                content += '<i class="fas ' + task.icon + '" style="color:#F57C00;width:18px;text-align:center;"></i>';
                content += '<span style="font-size:13px;flex:1;font-weight:500;">' + task.task + '</span>';
                if (task.urgent) content += '<span style="background:#D32F2F;color:#fff;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;">URGENT</span>';
                content += '<i class="far fa-circle" style="color:#ccc;font-size:18px;"></i>';
                content += '</div>';
            });
        }
        
        // Completed Tasks - BURAM (opacity), bukan coret
        if (done.length > 0) {
            content += '<div style="font-size:13px;font-weight:700;color:#2E7D32;margin:14px 0 10px;"><i class="fas fa-check-circle"></i> ' + done.length + ' Tugas Selesai</div>';
            done.forEach(function(task) {
                content += '<div onclick="Notification.toggleTask(\'' + task.key + '\')" style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:8px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;gap:10px;cursor:pointer;opacity:0.55;">';
                content += '<i class="fas fa-check-circle" style="color:#2E7D32;width:18px;text-align:center;"></i>';
                content += '<span style="font-size:13px;flex:1;color:#666;">' + task.task + '</span>';
                content += '<i class="fas fa-undo" style="color:#999;font-size:14px;"></i>';
                content += '</div>';
            });
        }
        
        if (tasks.length === 0) {
            content += '<div style="text-align:center;padding:30px;color:#888;">✅ Semua tugas selesai!</div>';
        }
        
        content += '</div></div>';
        
        document.getElementById('modalContent').innerHTML = content;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    // ========================================
    // INIT
    // ========================================
    function init() {
        updateBadge();
        setInterval(updateBadge, 300000);
    }

    function getToday() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    return {
        init: init,
        showToast: showToast,
        success: success,
        error: error,
        warning: warning,
        info: info,
        getDailyTasks: getDailyTasks,
        getPendingTaskCount: getPendingTaskCount,
        updateBadge: updateBadge,
        showNotificationPanel: showNotificationPanel,
        toggleTask: toggleTask
    };

})();