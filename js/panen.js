var panen = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.PANEN);
        data.sort(function(a,b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-harvest" style="color:#2E7D32; margin-right:8px;"></i> Panen</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="panen.showForm()">';
        html += '<i class="fas fa-plus"></i> Input Panen</button></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-harvest" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada data panen</h3></div>';
        } else {
            html += '<div style="font-size:14px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px;">';
            html += '<i class="fas fa-history" style="color:#777;"></i> Riwayat Hasil Panen</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(p) {
                // Layout Kartu
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:600; color:#2E7D32; font-size:14px;"><i class="far fa-calendar-alt" style="margin-right:6px;"></i>' + formatDate(p.tanggal) + '</div>';
                
                var gColor = p.grade === 'A' ? '#2E7D32' : '#1976D2';
                var gBg = p.grade === 'A' ? '#E8F5E9' : '#E3F2FD';
                html += '<div style="font-size:11px; color:' + gColor + '; background:' + gBg + '; padding:4px 8px; border-radius:6px; font-weight:700;">GRADE ' + (p.grade || 'A') + '</div>';
                html += '</div>';
                
                // Isi Kartu
                html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">';
                
                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-seedling" style="color:#7CB342; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">ID Tanaman</div><div style="font-weight:700; color:#333; font-size:14px;">' + p.tanaman_id + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-weight-hanging" style="color:#F57C00; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Bobot</div><div style="font-weight:700; color:#333; font-size:14px;">' + formatWeight(p.bobot) + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-cube" style="color:#8E24AA; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Kadar Manis (Brix)</div><div style="font-weight:600; color:#333; font-size:13px;">' + (p.brix ? p.brix + '°Bx' : '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-tag" style="color:#00838F; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Harga / kg</div><div style="font-weight:600; color:#333; font-size:13px;">' + (p.harga ? 'Rp ' + Number(p.harga).toLocaleString('id-ID') : '-') + '</div></div>';
                html += '</div>';

                if (p.pembeli) {
                    html += '<div style="display:flex; align-items:flex-start; gap:8px; grid-column: span 2;">';
                    html += '<i class="fas fa-user-tag" style="color:#D32F2F; font-size:14px; margin-top:2px;"></i>';
                    html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Pembeli</div><div style="font-weight:600; color:#333; font-size:13px;">' + p.pembeli + '</div></div>';
                    html += '</div>';
                }
                
                html += '</div>'; // end grid
                
                if (p.catatan) {
                    html += '<div style="font-size:12px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:12px; font-style:italic;"><i class="fas fa-info-circle" style="margin-right:4px;"></i> ' + p.catatan + '</div>';
                }

                // Footer: Tombol Aksi
                html += '<div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px dashed #eee; padding-top:12px;">';
                html += '<button onclick="panen.editForm(\'' + p.id + '\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="panen.deleteData(\'' + p.id + '\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
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
        var data = isEdit ? Storage.getById(Storage.KEYS.PANEN, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas ' + (isEdit ? 'fa-edit' : 'fa-plus-circle') + '" style="margin-right:8px;"></i>' + (isEdit ? 'Edit' : 'Input') + ' Panen</h3>';
        html += '<button onclick="panen.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="panen.save(event,\'' + (id||'') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanaman *</label>';
        html += '<input name="tanaman_id" value="' + (data.tanaman_id||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="GH01-T01-L01"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanggal *</label><input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Bobot (gram) *</label><input type="number" name="bobot" value="' + (data.bobot||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="1500"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        var gA = data.grade==='A'?'selected':'';
        var gB = data.grade==='B'?'selected':'';
        var gC = data.grade==='C'?'selected':'';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Grade</label><select name="grade" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;"><option value="A" '+gA+'>A</option><option value="B" '+gB+'>B</option><option value="C" '+gC+'>C</option></select></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Brix (%)</label><input type="number" name="brix" value="' + (data.brix||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="14.5"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Harga/kg (Rp)</label><input type="number" name="harga" value="' + (data.harga||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="35000"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Pembeli</label><input name="pembeli" value="' + (data.pembeli||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Nama pembeli"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Catatan Tambahan</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;font-family:inherit;" placeholder="Opsional...">' + (data.catatan||'') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="panen.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Yakin ingin menghapus data panen ini?')) {
            Storage.delete(Storage.KEYS.PANEN, id);
            Router.navigate('panen');
            if(typeof Notification !== 'undefined') Notification.success('Data panen dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = {
            tanaman_id: f.tanaman_id.value,
            tanggal: f.tanggal.value,
            bobot: parseInt(f.bobot.value) || 0,
            grade: f.grade.value,
            brix: parseFloat(f.brix.value) || null,
            harga: parseInt(f.harga.value) || 0,
            pembeli: f.pembeli.value,
            catatan: f.catatan.value
        };
        if (id) Storage.update(Storage.KEYS.PANEN, id, d);
        else Storage.create(Storage.KEYS.PANEN, d);
        
        Storage.update(Storage.KEYS.TANAMAN, d.tanaman_id, { status_panen: 'panen', status_tanaman: 'panen' });
        
        closeModal();
        Router.navigate('panen');
        if(typeof Notification !== 'undefined') Notification.success('Data panen disimpan!');
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    function formatDate(d) { 
        if(!d) return '-'; 
        var dt = new Date(d); 
        var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        return ('0' + dt.getDate()).slice(-2) + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear(); 
    }
    function formatWeight(g) { if(!g)return'0 g'; return g>=1000?(g/1000).toFixed(1)+' kg':g+' g'; }
    function getToday() { return new Date().toISOString().split('T')[0]; }

    return { render, init, showForm, editForm, deleteData, save, closeModal };
})();
