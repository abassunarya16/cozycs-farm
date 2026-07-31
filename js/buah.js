var buah = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.BUAH);
        data.sort(function(a,b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-apple-alt" style="color:#2E7D32; margin-right:8px;"></i> Monitoring Buah</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="buah.showForm()">';
        html += '<i class="fas fa-plus"></i> Input Buah</button></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-apple-alt" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada data buah</h3></div>';
        } else {
            html += '<div style="font-size:14px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px;">';
            html += '<i class="fas fa-chart-line" style="color:#777;"></i> Riwayat Pertumbuhan</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(b) {
                // Layout Kartu
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:600; color:#2E7D32; font-size:14px;"><i class="far fa-calendar-alt" style="margin-right:6px;"></i>' + formatDate(b.tanggal) + '</div>';
                
                var retakBadge = b.retak === 'ya' ? '<span style="color:#D32F2F; background:#FFEBEE; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700; margin-right:6px;">RETAK</span>' : '';
                var fixBadge = b.fix_buah === 'fix buah' ? '<span style="color:#2E7D32; background:#E8F5E9; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700;">FIX BUAH</span>' : '';
                html += '<div>' + retakBadge + fixBadge + '</div>';
                html += '</div>';
                
                // Isi Kartu
                html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">';
                
                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-seedling" style="color:#7CB342; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">ID Tanaman</div><div style="font-weight:700; color:#333; font-size:14px;">' + (b.tanaman_id || '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-ruler-combined" style="color:#00838F; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Diameter</div><div style="font-weight:600; color:#333; font-size:13px;">' + (b.diameter ? b.diameter + ' mm' : '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-weight-hanging" style="color:#F57C00; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Estimasi Bobot</div><div style="font-weight:600; color:#333; font-size:13px;">' + (b.estimasi_bobot ? formatWeight(b.estimasi_bobot) : '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-stopwatch" style="color:#8E24AA; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Umur (HSP)</div><div style="font-weight:600; color:#333; font-size:13px;">' + (b.hsp ? b.hsp + ' Hari' : '-') + '</div></div>';
                html += '</div>';
                
                html += '</div>';
                
                if (b.catatan) {
                    html += '<div style="font-size:12px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:12px; font-style:italic;"><i class="fas fa-info-circle" style="margin-right:4px;"></i> ' + b.catatan + '</div>';
                }

                // Footer: Tombol Aksi
                html += '<div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px dashed #eee; padding-top:12px;">';
                html += '<button onclick="buah.editForm(\'' + b.id + '\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="buah.deleteData(\'' + b.id + '\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
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
        var data = isEdit ? Storage.getById(Storage.KEYS.BUAH, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas ' + (isEdit ? 'fa-edit' : 'fa-plus-circle') + '" style="margin-right:8px;"></i>' + (isEdit ? 'Edit' : 'Input') + ' Buah</h3>';
        html += '<button onclick="buah.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="buah.save(event,\'' + (id||'') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanaman *</label>';
        html += '<input name="tanaman_id" value="' + (data.tanaman_id||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="GH01-T01-L01"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanggal *</label><input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">HSP (Umur Buah)</label><input type="number" name="hsp" value="' + (data.hsp||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Hari"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Diameter (mm)</label><input type="number" name="diameter" value="' + (data.diameter||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="45"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Keliling (mm)</label><input type="number" name="keliling" value="' + (data.keliling||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="141"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Est. Bobot (g)</label><input type="number" name="estimasi_bobot" value="' + (data.estimasi_bobot||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="400"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Bobot Aktual (g)</label><input type="number" name="bobot_aktual" value="' + (data.bobot_aktual||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Isi pas panen"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Warna</label><input name="warna" value="' + (data.warna||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Hijau"></div>';
        
        var netH = data.net==='halus'?'selected':'';
        var netS = data.net==='sedang'?'selected':'';
        var netK = data.net==='kasar'?'selected':'';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Kondisi Net</label><select name="net" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;"><option value="">-</option><option value="halus" '+netH+'>Halus</option><option value="sedang" '+netS+'>Sedang</option><option value="kasar" '+netK+'>Kasar</option></select></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        var retT = data.retak==='tidak'?'selected':'';
        var retY = data.retak==='ya'?'selected':'';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Buah Retak?</label><select name="retak" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;"><option value="tidak" '+retT+'>Tidak</option><option value="ya" '+retY+'>Ya</option></select></div>';
        
        var fixB = data.fix_buah==='belum'?'selected':'';
        var fixF = data.fix_buah==='fix buah'?'selected':'';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Status Buah</label><select name="fix_buah" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;"><option value="belum" '+fixB+'>Belum</option><option value="fix buah" '+fixF+'>Fix Buah</option></select></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Catatan Tambahan</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;font-family:inherit;" placeholder="Opsional...">' + (data.catatan||'') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="buah.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Yakin ingin menghapus data buah ini?')) {
            Storage.delete(Storage.KEYS.BUAH, id);
            Router.navigate('buah');
            if(typeof Notification !== 'undefined') Notification.success('Data buah dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = {
            tanaman_id: f.tanaman_id.value,
            tanggal: f.tanggal.value,
            hsp: parseInt(f.hsp.value) || 0,
            diameter: parseFloat(f.diameter.value) || null,
            keliling: parseFloat(f.keliling.value) || null,
            estimasi_bobot: parseInt(f.estimasi_bobot.value) || null,
            bobot_aktual: parseInt(f.bobot_aktual.value) || null,
            warna: f.warna.value,
            net: f.net.value,
            retak: f.retak.value || 'tidak',
            fix_buah: f.fix_buah.value || 'belum',
            catatan: f.catatan.value
        };
        if (id) Storage.update(Storage.KEYS.BUAH, id, d);
        else Storage.create(Storage.KEYS.BUAH, d);
        if (d.fix_buah === 'fix buah') Storage.update(Storage.KEYS.TANAMAN, d.tanaman_id, { status_buah: 'fix buah' });
        closeModal();
        Router.navigate('buah');
        if(typeof Notification !== 'undefined') Notification.success('Data monitoring buah disimpan!');
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
