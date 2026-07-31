var spray = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.SPRAY);
        data.sort(function(a,b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-spray-can" style="color:#2E7D32; margin-right:8px;"></i> Penyemprotan</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="spray.showForm()">';
        html += '<i class="fas fa-plus"></i> Input Semprot</button></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-spray-can" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada riwayat penyemprotan</h3></div>';
        } else {
            html += '<div style="font-size:14px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px;">';
            html += '<i class="fas fa-history" style="color:#777;"></i> Riwayat Perawatan & Mix Cairan</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(s) {
                // Layout Kartu
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:600; color:#2E7D32; font-size:14px;"><i class="far fa-calendar-alt" style="margin-right:6px;"></i>' + formatDate(s.tanggal) + '</div>';
                html += '<div style="font-size:11px; color:#8E24AA; background:#F3E5F5; padding:4px 8px; border-radius:6px; font-weight:700;"><i class="fas fa-blender" style="margin-right:4px;"></i>MIX SPRAY</div>';
                html += '</div>';
                
                // Isi Kartu
                html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">';
                
                if (s.nama_produk) {
                    html += '<div style="display:flex; align-items:flex-start; gap:8px; grid-column: span 2;">';
                    html += '<i class="fas fa-tag" style="color:#1976D2; font-size:14px; margin-top:2px;"></i>';
                    html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Nama Produk</div><div style="font-weight:700; color:#333; font-size:14px;">' + s.nama_produk + '</div></div>';
                    html += '</div>';
                }

                html += '<div style="display:flex; align-items:flex-start; gap:8px; grid-column: span 2;">';
                html += '<i class="fas fa-flask" style="color:#2E7D32; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Jenis / Campuran Cairan</div><div style="font-weight:600; color:#333; font-size:13px;">' + (s.jenis_semprot || '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-prescription-bottle" style="color:#00838F; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Dosis</div><div style="font-weight:600; color:#333; font-size:13px;">' + (s.dosis || '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-bullseye" style="color:#D32F2F; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Target</div><div style="font-weight:600; color:#333; font-size:13px;">' + (s.target || '-') + '</div></div>';
                html += '</div>';

                if (s.operator) {
                    html += '<div style="display:flex; align-items:flex-start; gap:8px; grid-column: span 2;">';
                    html += '<i class="fas fa-user-check" style="color:#1976D2; font-size:14px; margin-top:2px;"></i>';
                    html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Operator</div><div style="font-weight:600; color:#333; font-size:13px;">' + s.operator + '</div></div>';
                    html += '</div>';
                }
                
                html += '</div>'; // end grid
                
                if (s.catatan) {
                    html += '<div style="font-size:12px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:12px; font-style:italic;"><i class="fas fa-info-circle" style="margin-right:4px;"></i> ' + s.catatan + '</div>';
                }

                // Footer: Tombol Aksi
                html += '<div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px dashed #eee; padding-top:12px;">';
                html += '<button onclick="spray.editForm(\'' + s.id + '\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="spray.deleteData(\'' + s.id + '\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
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
        var data = isEdit ? Storage.getById(Storage.KEYS.SPRAY, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas ' + (isEdit ? 'fa-edit' : 'fa-plus-circle') + '" style="margin-right:8px;"></i>' + (isEdit ? 'Edit' : 'Input') + ' Penyemprotan</h3>';
        html += '<button onclick="spray.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="spray.save(event,\'' + (id||'') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanggal *</label>';
        html += '<input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;"></div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Nama Produk</label>';
        html += '<input name="nama_produk" value="' + (data.nama_produk||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: Amistartop, Antracol, dll"></div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Jenis / Campuran Cairan *</label>';
        html += '<input name="jenis_semprot" value="' + (data.jenis_semprot||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: Fungisida + Insektisida"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Dosis</label><input name="dosis" value="' + (data.dosis||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: 5 ml/L"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Target Hama</label><input name="target" value="' + (data.target||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Contoh: Kutu Daun"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Operator</label>';
        html += '<input name="operator" value="' + (data.operator||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Nama"></div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Catatan Tambahan</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;font-family:inherit;" placeholder="Opsional...">' + (data.catatan||'') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="spray.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Yakin ingin menghapus data penyemprotan ini?')) {
            Storage.delete(Storage.KEYS.SPRAY, id);
            Router.navigate('spray');
            if(typeof Notification !== 'undefined') Notification.success('Data dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = { 
            tanggal: f.tanggal.value, 
            nama_produk: f.nama_produk.value, 
            jenis_semprot: f.jenis_semprot.value, 
            dosis: f.dosis.value, 
            target: f.target.value, 
            operator: f.operator.value, 
            catatan: f.catatan.value 
        };
        if (id) Storage.update(Storage.KEYS.SPRAY, id, d);
        else Storage.create(Storage.KEYS.SPRAY, d);
        closeModal();
        Router.navigate('spray');
        if(typeof Notification !== 'undefined') Notification.success('Penyemprotan disimpan!');
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
