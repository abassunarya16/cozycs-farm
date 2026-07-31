var nutrisi = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.NUTRISI);
        data.sort(function(a,b) { return new Date(b.tanggal) - new Date(a.tanggal); });
        var latest = data[0] || {};
        
        var html = '<div class="module-container">';
        
        html += '<div class="page-title">';
        html += '<h2><i class="fas fa-flask"></i> Nutrisi</h2>';
        html += '<button class="btn btn-primary" onclick="nutrisi.showForm()"><i class="fas fa-plus"></i> Input Nutrisi</button>';
        html += '</div>';
        
        if (data.length > 0) {
            html += '<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e0e0e0;">';
            html += '<div style="font-size:13px;font-weight:700;color:#1B5E20;margin-bottom:12px;"><i class="fas fa-chart-bar"></i> Pembacaan Terakhir</div>';
            html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">';
            
            html += '<div style="background:#F3E5F5;padding:12px;border-radius:10px;">';
            html += '<div style="font-size:20px;font-weight:700;color:#7B1FA2;">'+(latest.ppm_pagi||'-')+'</div>';
            html += '<div style="font-size:11px;color:#666;">PPM</div></div>';
            
            html += '<div style="background:#E0F2F1;padding:12px;border-radius:10px;">';
            html += '<div style="font-size:20px;font-weight:700;color:#00838F;">'+(latest.ph_pagi||'-')+'</div>';
            html += '<div style="font-size:11px;color:#666;">pH</div></div>';
            
            html += '<div style="background:#E3F2FD;padding:12px;border-radius:10px;">';
            html += '<div style="font-size:20px;font-weight:700;color:#1976D2;">'+(latest.suhu_air?latest.suhu_air+'°C':'-')+'</div>';
            html += '<div style="font-size:11px;color:#666;">Suhu Air</div></div>';
            
            html += '</div></div>';
        }
        
        if (data.length === 0) {
            html += '<div class="empty-state"><i class="fas fa-flask"></i><h3>Belum ada data nutrisi</h3></div>';
        } else {
            html += '<div style="font-size:14px;font-weight:700;color:#333;margin-bottom:10px;"><i class="fas fa-history"></i> Riwayat Nutrisi</div>';
            
            data.slice(0, 20).forEach(function(n) {
                html += '<div style="background:#fff;border-radius:10px;padding:14px;margin-bottom:10px;box-shadow:0 2px 6px rgba(0,0,0,0.04);border:1px solid #f0f0f0;">';
                
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
                html += '<strong style="color:#2E7D32;">' + formatDate(n.tanggal) + '</strong>';
                if (n.operator) html += '<span style="font-size:11px;color:#888;">👤 ' + n.operator + '</span>';
                html += '</div>';
                
                html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;margin-bottom:10px;">';
                html += '<div><div style="font-size:10px;color:#888;">PPM</div><div style="font-weight:700;color:#7B1FA2;">'+(n.ppm_pagi||'-')+'</div></div>';
                html += '<div><div style="font-size:10px;color:#888;">pH</div><div style="font-weight:700;color:#00838F;">'+(n.ph_pagi||'-')+'</div></div>';
                html += '<div><div style="font-size:10px;color:#888;">Vol</div><div style="font-weight:600;">'+(n.volume_air||'-')+'</div></div>';
                html += '<div><div style="font-size:10px;color:#888;">Suhu</div><div style="font-weight:600;color:#1976D2;">'+(n.suhu_air?n.suhu_air+'°C':'-')+'</div></div>';
                html += '</div>';
                
                if (n.catatan) html += '<div style="font-size:11px;color:#666;background:#f9f9f9;padding:8px;border-radius:6px;margin-bottom:8px;">📝 ' + n.catatan + '</div>';
                
                html += '<div style="display:flex;justify-content:flex-end;gap:6px;">';
                html += '<button onclick="nutrisi.editForm(\''+n.id+'\')" style="padding:6px 12px;background:#E3F2FD;color:#1976D2;border:none;border-radius:6px;font-size:11px;cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="nutrisi.deleteData(\''+n.id+'\')" style="padding:6px 12px;background:#FFEBEE;color:#D32F2F;border:none;border-radius:6px;font-size:11px;cursor:pointer;"><i class="fas fa-trash"></i> Hapus</button>';
                html += '</div>';
                
                html += '</div>';
            });
        }
        
        html += '</div>';
        return html;
    }

    function init() {}

    function showForm(id) {
        var isEdit = !!id;
        var data = isEdit ? Storage.getById(Storage.KEYS.NUTRISI, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;">';
        html += '<h3 style="margin:0;font-size:16px;">' + (isEdit?'Edit':'Input') + ' Nutrisi</h3>';
        html += '<button onclick="nutrisi.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="nutrisi.save(event,\'' + (id||'') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Tanggal *</label>';
        html += '<input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label>PPM Pagi</label><input type="number" name="ppm_pagi" value="' + (data.ppm_pagi||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label>PPM Sore</label><input type="number" name="ppm_sore" value="' + (data.ppm_sore||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label>pH Pagi</label><input type="number" name="ph_pagi" value="' + (data.ph_pagi||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label>pH Sore</label><input type="number" name="ph_sore" value="' + (data.ph_sore||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label>Volume (L)</label><input type="number" name="volume_air" value="' + (data.volume_air||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label>Suhu (°C)</label><input type="number" name="suhu_air" value="' + (data.suhu_air||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:14px;"><label>Operator</label><input name="operator" value="' + (data.operator||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div style="margin-bottom:14px;"><label>Catatan</label><textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;">' + (data.catatan||'') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="nutrisi.closeModal()" style="padding:12px 20px;background:#eee;border:none;border-radius:10px;font-size:14px;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Hapus data nutrisi ini?')) {
            Storage.remove(Storage.KEYS.NUTRISI, id);
            Router.navigate('nutrisi');
            Notification.success('Data dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = {
            tanggal: f.tanggal.value,
            ppm_pagi: parseInt(f.ppm_pagi.value) || null,
            ppm_sore: parseInt(f.ppm_sore.value) || null,
            ph_pagi: parseFloat(f.ph_pagi.value) || null,
            ph_sore: parseFloat(f.ph_sore.value) || null,
            volume_air: parseInt(f.volume_air.value) || null,
            suhu_air: parseFloat(f.suhu_air.value) || null,
            operator: f.operator.value,
            catatan: f.catatan.value
        };
        if (id) Storage.update(Storage.KEYS.NUTRISI, id, d);
        else Storage.create(Storage.KEYS.NUTRISI, d);
        closeModal();
        Router.navigate('nutrisi');
        Notification.success('Nutrisi disimpan!');
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    
    function formatDate(d) { 
        if(!d) return '-'; 
        var dt = new Date(d); 
        return ('0' + dt.getDate()).slice(-2) + '/' + ('0' + (dt.getMonth() + 1)).slice(-2) + '/' + dt.getFullYear(); 
    }
    
    function getToday() { return new Date().toISOString().split('T')[0]; }

    return { 
        render: render, 
        init: init, 
        showForm: showForm, 
        editForm: editForm, 
        deleteData: deleteData, 
        save: save, 
        closeModal: closeModal 
    };

})();
