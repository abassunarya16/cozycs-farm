var hama = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.HAMA);
        data.sort(function(a,b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-bug" style="color:#D32F2F; margin-right:8px;"></i> Hama & Penyakit</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="hama.showForm()">';
        html += '<i class="fas fa-plus"></i> Input Data</button></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-bug" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada riwayat hama/penyakit</h3></div>';
        } else {
            html += '<div style="font-size:14px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px;">';
            html += '<i class="fas fa-history" style="color:#777;"></i> Riwayat Deteksi</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(h) {
                // Layout Kartu
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:600; color:#2E7D32; font-size:14px;"><i class="far fa-calendar-alt" style="margin-right:6px;"></i>' + formatDate(h.tanggal) + '</div>';
                
                var tk = h.tingkat || 'Ringan';
                var bg = tk === 'Berat' ? '#FFEBEE' : tk === 'Sedang' ? '#FFF8E1' : '#E3F2FD';
                var tc = tk === 'Berat' ? '#D32F2F' : tk === 'Sedang' ? '#F57F17' : '#1976D2';
                html += '<div style="font-size:11px; color:' + tc + '; background:' + bg + '; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">' + tk + '</div>';
                html += '</div>';
                
                // Isi Kartu
                html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">';
                
                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-seedling" style="color:#7CB342; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">ID Tanaman</div><div style="font-weight:700; color:#333; font-size:14px;">' + (h.tanaman_id || '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-spider" style="color:#D32F2F; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Jenis Hama/Penyakit</div><div style="font-weight:600; color:#333; font-size:13px;">' + (h.jenis || '-') + '</div></div>';
                html += '</div>';
                
                html += '</div>'; // end grid
                
                if (h.penanganan) {
                    html += '<div style="font-size:12px; color:#00695C; background:#E0F2F1; padding:8px 10px; border-radius:6px; margin-bottom:12px;">';
                    html += '<i class="fas fa-hands-helping" style="margin-right:6px;"></i> <b>Penanganan:</b> ' + h.penanganan + '</div>';
                }

                if (h.catatan) {
                    html += '<div style="font-size:12px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:12px; font-style:italic;"><i class="fas fa-info-circle" style="margin-right:4px;"></i> ' + h.catatan + '</div>';
                }

                // Footer: Tombol Aksi
                html += '<div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px dashed #eee; padding-top:12px;">';
                html += '<button onclick="hama.editForm(\'' + h.id + '\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="hama.deleteData(\'' + h.id + '\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
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
        var data = isEdit ? Storage.getById(Storage.KEYS.HAMA, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas ' + (isEdit ? 'fa-edit' : 'fa-plus-circle') + '" style="margin-right:8px;"></i>' + (isEdit ? 'Edit' : 'Input') + ' Data Hama/Penyakit</h3>';
        html += '<button onclick="hama.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="hama.save(event,\'' + (id||'') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanaman *</label>';
        html += '<input name="tanaman_id" value="' + (data.tanaman_id||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="GH01-T01-L01"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanggal *</label><input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Jenis Hama/Penyakit</label><input name="jenis" value="' + (data.jenis||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: Kutu Daun"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        var tR = data.tingkat==='Ringan'?'selected':'';
        var tS = data.tingkat==='Sedang'?'selected':'';
        var tB = data.tingkat==='Berat'?'selected':'';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tingkat Serangan</label><select name="tingkat" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;"><option '+tR+'>Ringan</option><option '+tS+'>Sedang</option><option '+tB+'>Berat</option></select></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Penanganan</label><input name="penanganan" value="' + (data.penanganan||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: Semprot Pestisida"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Catatan Tambahan</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;font-family:inherit;" placeholder="Opsional...">' + (data.catatan||'') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="hama.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Yakin ingin menghapus data hama/penyakit ini?')) {
            Storage.delete(Storage.KEYS.HAMA, id);
            Router.navigate('hama');
            if(typeof Notification !== 'undefined') Notification.success('Data dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = { tanaman_id: f.tanaman_id.value, tanggal: f.tanggal.value, jenis: f.jenis.value, tingkat: f.tingkat.value, penanganan: f.penanganan.value, catatan: f.catatan.value };
        if (id) Storage.update(Storage.KEYS.HAMA, id, d);
        else Storage.create(Storage.KEYS.HAMA, d);
        closeModal();
        Router.navigate('hama');
        if(typeof Notification !== 'undefined') Notification.success('Data hama disimpan!');
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    function formatDate(d) { 
        if(!d) return '-'; 
        var dt = new Date(d); 
        var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        return ('0' + dt.getDate()).slice(-2) + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear(); 
    }
    function getToday() { return new Date().toISOString().split('T')[0]; }

    return { render, init, showForm, editForm, deleteData, save, closeModal };
})();
