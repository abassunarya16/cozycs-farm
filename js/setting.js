var setting = (function() {

    function render() {
        var s = Storage.getSettings();
        var si = Storage.getStorageInfo();
        var bl = Storage.getBackupList();
        
        var html = '<div class="module-container">';
        html += '<div class="page-title"><h2><i class="fas fa-cog"></i> Pengaturan</h2></div>';
        
        // Farm Info
        html += '<div class="card"><div class="card-header"><h3 class="card-title"><i class="fas fa-info-circle"></i> Informasi Farm</h3></div>';
        html += '<div class="card-body">';
        html += '<form onsubmit="setting.saveFarm(event)">';
        html += '<div style="margin-bottom:12px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Nama Farm</label>';
        html += '<input type="text" id="farmName" value="' + (s.farmName || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<button type="submit" class="btn btn-primary">💾 Simpan</button>';
        html += '</form></div></div>';
        
        // Storage Info
        html += '<div class="card"><div class="card-header"><h3 class="card-title"><i class="fas fa-database"></i> Penyimpanan</h3></div>';
        html += '<div class="card-body">';
        html += '<div class="storage-bar"><div class="storage-bar-fill" style="width:' + si.usagePercentage + '%;background:' + (si.usagePercentage > 80 ? '#D32F2F' : '#2E7D32') + '"></div></div>';
        html += '<p class="text-sm text-muted">' + si.totalSizeFormatted + ' / 5 MB (' + si.usagePercentage + '%)</p>';
        html += '</div></div>';
        
        // Backup & Restore
        html += '<div class="card"><div class="card-header"><h3 class="card-title"><i class="fas fa-cloud-upload-alt"></i> Backup & Restore</h3></div>';
        html += '<div class="card-body">';
        html += '<button class="btn btn-primary btn-block" onclick="setting.backup()"><i class="fas fa-download"></i> Backup JSON</button>';
        html += '<button class="btn btn-outline btn-block" onclick="setting.restore()" style="margin-top:8px;"><i class="fas fa-upload"></i> Restore JSON</button>';
        html += '<button class="btn btn-danger btn-block" onclick="setting.reset()" style="margin-top:8px;"><i class="fas fa-trash"></i> Reset Semua Data</button>';
        
        if (bl.length > 0) {
            html += '<div style="margin-top:12px;"><strong>📂 Backup Tersimpan:</strong>';
            bl.slice(0, 5).forEach(function(b) {
                html += '<div class="backup-item"><span>' + formatDateTime(b.date) + ' (' + formatBytes(b.size) + ')</span>';
                html += '<button class="btn btn-sm btn-outline" onclick="setting.restoreBackup(\'' + b.key + '\')">Restore</button></div>';
            });
            html += '</div>';
        }
        
        html += '</div></div>';
        html += '</div>';
        return html;
    }

    function init() {}

    function saveFarm(event) {
        event.preventDefault();
        var name = document.getElementById('farmName').value;
        Storage.updateSettings({ farmName: name });
        Notification.success('Informasi farm disimpan!');
    }

    function backup() {
        var data = Storage.exportAll();
        var json = JSON.stringify(data, null, 2);
        downloadFile(json, 'cozycs-backup-' + getToday() + '.json');
        Notification.success('Backup berhasil didownload!');
    }

    function restore() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function() {
                try {
                    var data = JSON.parse(reader.result);
                    Storage.importAll(data);
                    Notification.success('Data berhasil direstore!');
                    setTimeout(function() { location.reload(); }, 1500);
                } catch (err) {
                    Notification.error('File backup rusak!');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function restoreBackup(key) {
        if (confirm('Restore backup ini? Data saat ini akan ditimpa.')) {
            try {
                Storage.restoreBackup(key);
                Notification.success('Data direstore!');
                setTimeout(function() { location.reload(); }, 1500);
            } catch (e) {
                Notification.error('Restore gagal!');
            }
        }
    }

    function reset() {
        if (confirm('HAPUS SEMUA DATA?\n\nIni tidak bisa dibatalkan!')) {
            Storage.clearAll();
            Storage.init();
            Notification.success('Semua data direset!');
            setTimeout(function() { location.reload(); }, 1500);
        }
    }

    function downloadFile(content, filename) {
        var blob = new Blob([content], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getToday() { return new Date().toISOString().split('T')[0]; }

    function formatDateTime(dateStr) {
        if (!dateStr) return '-';
        var d = new Date(dateStr);
        return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    }

    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 KB';
        return (bytes / 1024).toFixed(1) + ' KB';
    }

    return {
        render: render, init: init, saveFarm: saveFarm,
        backup: backup, restore: restore, restoreBackup: restoreBackup, reset: reset
    };

})();