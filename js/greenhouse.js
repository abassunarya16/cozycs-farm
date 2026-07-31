var greenhouse = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.GREENHOUSE);
        var tanaman = Storage.getAll(Storage.KEYS.TANAMAN);
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-warehouse" style="color:#2E7D32; margin-right:8px;"></i> Greenhouse</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="greenhouse.showForm()">';
        html += '<i class="fas fa-plus"></i> Tambah Greenhouse</button></div>';

        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-warehouse" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada greenhouse</h3></div>';
        } else {
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(gh) {
                var ghTanaman = tanaman.filter(function(t) { return t.greenhouse_id === gh.id; });
                var hidup = ghTanaman.filter(function(t) { return t.status_tanaman !== 'mati' && t.status_panen !== 'panen'; }).length;
                
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Card
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:600; color:#2E7D32; font-size:14px;"><i class="fas fa-warehouse" style="margin-right:6px;"></i>' + gh.kode + ' - ' + (gh.nama || '') + '</div>';
                html += '<span class="status-badge ' + (gh.status === 'aktif' ? 'active' : 'warning') + '">' + (gh.status || 'aktif') + '</span>';
                html += '</div>';
                
                // Info Grid
                html += '<div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; text-align:center; margin-bottom:12px;">';
                html += '<div style="background:#E8F5E9; padding:10px; border-radius:8px;"><div style="font-size:18px; font-weight:700; color:#2E7D32;">' + ghTanaman.length + '</div><div style="font-size:10px; color:#666;">Total Tanaman</div></div>';
                html += '<div style="background:#FFF3E0; padding:10px; border-radius:8px;"><div style="font-size:18px; font-weight:700; color:#F57C00;">' + hidup + '</div><div style="font-size:10px; color:#666;">Tanaman Hidup</div></div>';
                html += '<div style="background:#E3F2FD; padding:10px; border-radius:8px;"><div style="font-size:18px; font-weight:700; color:#1976D2;">' + (gh.kapasitas || '-') + '</div><div style="font-size:10px; color:#666;">Kapasitas</div></div>';
                html += '<div style="background:#FCE4EC; padding:10px; border-radius:8px;"><div style="font-size:18px; font-weight:700; color:#D32F2F;">' + (gh.jumlah_talang || '-') + '</div><div style="font-size:10px; color:#666;">Talang</div></div>';
                html += '</div>';
                
                // Detail
                html += '<div style="font-size:11px; color:#888; margin-bottom:10px;">📍 ' + (gh.lokasi || '-') + '</div>';
                if (gh.catatan) html += '<div style="font-size:11px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:10px;">📝 ' + gh.catatan + '</div>';
                
                // Tombol Aksi
                html += '<div style="display:flex; justify-content:flex-end; gap:8px;">';
                html += '<button onclick="greenhouse.editForm(\'' + gh.id + '\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="greenhouse.deleteData(\'' + gh.id + '\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
                html += '</div>';
                
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    function init() {}

    function showForm(id) {
        var isEdit = !!id;
        var data = isEdit ? Storage.getById(Storage.KEYS.GREENHOUSE, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;">';
        html += '<h3 style="margin:0;font-size:16px;"><i class="fas '+(isEdit?'fa-edit':'fa-plus-circle')+'" style="margin-right:8px;color:#2E7D32;"></i>' + (isEdit?'Edit':'Tambah') + ' Greenhouse</h3>';
        html += '<button onclick="greenhouse.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="greenhouse.save(event,\'' + (id||'') + '\')">';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Kode *</label><input name="kode" value="' + (data.kode||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Nama</label><input name="nama" value="' + (data.nama||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Kapasitas</label><input type="number" name="kapasitas" value="' + (data.kapasitas||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Jumlah Talang</label><input type="number" name="jumlah_talang" value="' + (data.jumlah_talang||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Lokasi</label><input name="lokasi" value="' + (data.lokasi||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Status</label><select name="status" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;background:#fff;"><option value="aktif">✅ Aktif</option><option value="nonaktif">❌ Nonaktif</option></select></div>';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Catatan</label><textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;">' + (data.catatan||'') + '</textarea></div>';
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="greenhouse.closeModal()" style="padding:12px 20px;background:#eee;border:none;border-radius:10px;font-size:14px;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">💾 Simpan</button>';
        html += '</div>';
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Hapus greenhouse ini?')) {
            Storage.remove(Storage.KEYS.GREENHOUSE, id);
            Router.navigate('greenhouse');
            Notification.success('Greenhouse dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = { kode: f.kode.value.toUpperCase(), nama: f.nama.value, kapasitas: parseInt(f.kapasitas.value) || 0, jumlah_talang: parseInt(f.jumlah_talang.value) || 0, lokasi: f.lokasi.value, status: f.status.value, catatan: f.catatan.value };
        if (id) Storage.update(Storage.KEYS.GREENHOUSE, id, d);
        else Storage.create(Storage.KEYS.GREENHOUSE, d);
        closeModal();
        Router.navigate('greenhouse');
        Notification.success('Greenhouse disimpan!');
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }

    return { render: render, init: init, showForm: showForm, editForm: editForm, deleteData: deleteData, save: save, closeModal: closeModal };
})();
