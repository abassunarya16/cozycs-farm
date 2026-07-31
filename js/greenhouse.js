var greenhouse = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.GREENHOUSE);
        var tanaman = Storage.getAll(Storage.KEYS.TANAMAN);
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-warehouse" style="color:#2E7D32; margin-right:8px;"></i> Greenhouse</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="greenhouse.showForm()">';
        html += '<i class="fas fa-plus"></i> Tambah GH</button></div>';

        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-warehouse" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada daftar Greenhouse</h3></div>';
        } else {
            html += '<div style="font-size:14px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px;">';
            html += '<i class="fas fa-map-marked-alt" style="color:#777;"></i> Fasilitas Tersedia</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(gh) {
                var ghTanaman = tanaman.filter(function(t) { return t.greenhouse_id === gh.id; });
                var hidup = ghTanaman.filter(function(t) { return t.status_tanaman !== 'mati' && t.status_panen !== 'panen'; }).length;
                
                // Layout Kartu
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:700; color:#1B5E20; font-size:16px;"><i class="fas fa-warehouse" style="color:#7CB342; margin-right:6px;"></i>' + gh.kode + (gh.nama ? ' - ' + gh.nama : '') + '</div>';
                
                var st = gh.status === 'nonaktif' ? 'NONAKTIF' : 'AKTIF';
                var bg = gh.status === 'nonaktif' ? '#FFEBEE' : '#E8F5E9';
                var tc = gh.status === 'nonaktif' ? '#D32F2F' : '#2E7D32';
                html += '<div style="font-size:11px; color:' + tc + '; background:' + bg + '; padding:4px 8px; border-radius:6px; font-weight:700;">' + st + '</div>';
                html += '</div>';
                
                // Isi Kartu
                html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">';
                
                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-map-marker-alt" style="color:#D32F2F; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Lokasi</div><div style="font-weight:600; color:#333; font-size:13px;">' + (gh.lokasi || '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-ruler-combined" style="color:#00838F; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Kapasitas / Talang</div><div style="font-weight:600; color:#333; font-size:13px;">' + (gh.kapasitas || 0) + ' Lubang / ' + (gh.jumlah_talang || 0) + ' Talang</div></div>';
                html += '</div>';
                
                html += '<div style="display:flex; align-items:flex-start; gap:8px; grid-column: span 2;">';
                html += '<i class="fas fa-leaf" style="color:#7CB342; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Populasi Saat Ini</div><div style="font-weight:700; color:#2E7D32; font-size:13px;">' + hidup + ' Tanaman Aktif <span style="font-weight:normal; color:#888;">(dari total ' + ghTanaman.length + ' data)</span></div></div>';
                html += '</div>';
                
                html += '</div>'; // end grid

                // Footer: Tombol Aksi
                html += '<div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px dashed #eee; padding-top:12px;">';
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
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas ' + (isEdit ? 'fa-edit' : 'fa-plus-circle') + '" style="margin-right:8px;"></i>' + (isEdit ? 'Edit' : 'Tambah') + ' Greenhouse</h3>';
        html += '<button onclick="greenhouse.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button>';
        html += '</div>';
        
        html += '<div style="padding:20px;">';
        html += '<form onsubmit="greenhouse.save(event,\'' + (id || '') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Kode Greenhouse *</label>';
        html += '<input name="kode" value="' + (data.kode || '') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: GH01"></div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Nama</label>';
        html += '<input name="nama" value="' + (data.nama || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: GH Utara"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Kapasitas (Lubang)</label><input type="number" name="kapasitas" value="' + (data.kapasitas || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="200"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Jumlah Talang</label><input type="number" name="jumlah_talang" value="' + (data.jumlah_talang || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="20"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Lokasi</label>';
        html += '<input name="lokasi" value="' + (data.lokasi || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: Blok A"></div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Status</label>';
        var sA = data.status === 'aktif' ? ' selected' : '';
        var sN = data.status === 'nonaktif' ? ' selected' : '';
        html += '<select name="status" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;">';
        html += '<option value="aktif"' + sA + '>✅ Aktif</option>';
        html += '<option value="nonaktif"' + sN + '>❌ Nonaktif</option>';
        html += '</select></div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Catatan Tambahan</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;font-family:inherit;" placeholder="Opsional...">' + (data.catatan || '') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="greenhouse.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = {
            kode: f.kode.value.toUpperCase(),
            nama: f.nama.value,
            kapasitas: parseInt(f.kapasitas.value) || 0,
            jumlah_talang: parseInt(f.jumlah_talang.value) || 0,
            lokasi: f.lokasi.value,
            status: f.status.value,
            catatan: f.catatan.value
        };
        if (id) Storage.update(Storage.KEYS.GREENHOUSE, id, d);
        else Storage.create(Storage.KEYS.GREENHOUSE, d);
        closeModal();
        Router.navigate('greenhouse');
        if(typeof Notification !== 'undefined') Notification.success('Greenhouse disimpan!');
    }

    // Ubah nama fungsi menjadi deleteData agar seragam dengan yang lain
    function deleteData(id) {
        if (confirm('Yakin ingin menghapus fasilitas Greenhouse ini? Semua tanaman yang terikat GH ini tidak akan ikut terhapus, namun tidak akan memiliki GH yang valid.')) {
            Storage.delete(Storage.KEYS.GREENHOUSE, id);
            Router.navigate('greenhouse');
            if(typeof Notification !== 'undefined') Notification.success('Greenhouse dihapus!');
        }
    }

    function closeModal() {
        document.getElementById('modalContainer').style.display = 'none';
    }

    return { render, init, showForm, editForm, save, deleteData, closeModal };
})();
