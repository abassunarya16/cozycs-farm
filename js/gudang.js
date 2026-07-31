var gudang = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.GUDANG);
        // Urutkan berdasarkan tanggal masuk terbaru
        data.sort(function(a, b) { 
            var dateA = new Date(a.tanggal_masuk || a.createdAt);
            var dateB = new Date(b.tanggal_masuk || b.createdAt);
            return dateB - dateA; 
        });
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-warehouse" style="color:#2E7D32; margin-right:8px;"></i> Gudang</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="gudang.showForm()">';
        html += '<i class="fas fa-plus"></i> Tambah Stok</button></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-box-open" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Gudang masih kosong</h3></div>';
        } else {
            html += '<div style="font-size:14px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px;">';
            html += '<i class="fas fa-boxes" style="color:#777;"></i> Daftar Stok & Penjualan</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(g) {
                // Layout Kartu per Data
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu: Tanggal & Status Badge
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:600; color:#2E7D32; font-size:14px;"><i class="far fa-calendar-alt" style="margin-right:6px;"></i>' + formatDate(g.tanggal_masuk) + '</div>';
                
                // Lencana Status (Stok vs Terjual)
                var statusLabel = (g.status || 'stok').toUpperCase();
                var statusBg = statusLabel === 'STOK' ? '#FFF8E1' : '#E8F5E9';
                var statusColor = statusLabel === 'STOK' ? '#F57F17' : '#2E7D32';
                html += '<div style="font-size:11px; color:' + statusColor + '; background:' + statusBg + '; padding:4px 8px; border-radius:6px; font-weight:700; letter-spacing:0.5px;">' + statusLabel + '</div>';
                html += '</div>';
                
                // Isi Kartu: Grid Informasi (ID, Bobot, Grade, Pembeli)
                html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">';
                
                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-seedling" style="color:#7CB342; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">ID Tanaman</div><div style="font-weight:600; color:#333; font-size:13px;">' + (g.tanaman_id || '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-weight-hanging" style="color:#FFB300; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Bobot</div><div style="font-weight:600; color:#333; font-size:13px;">' + formatWeight(g.bobot) + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-star" style="color:#F4511E; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Grade</div><div style="font-weight:600; color:#333; font-size:13px;">' + (g.grade || '-') + '</div></div>';
                html += '</div>';

                if (g.status === 'terjual' || g.pembeli) {
                    html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                    html += '<i class="fas fa-user-tag" style="color:#1976D2; font-size:14px; margin-top:2px;"></i>';
                    html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Pembeli</div><div style="font-weight:600; color:#333; font-size:13px;">' + (g.pembeli || '-') + '</div></div>';
                    html += '</div>';
                }
                
                html += '</div>'; // End Grid

                // Footer Kartu: Tombol Aksi (Edit & Hapus)
                html += '<div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px dashed #eee; padding-top:12px;">';
                html += '<button onclick="gudang.editForm(\'' + g.id + '\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="gudang.deleteData(\'' + g.id + '\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
                html += '</div>';
                
                html += '</div>'; // End of Card
            });
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    function init() {}

    function showForm(id) {
        var isEdit = !!id;
        var data = isEdit ? Storage.getById(Storage.KEYS.GUDANG, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas ' + (isEdit ? 'fa-edit' : 'fa-plus-circle') + '" style="margin-right:8px;"></i>' + (isEdit ? 'Edit' : 'Tambah') + ' Stok Gudang</h3>';
        html += '<button onclick="gudang.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="gudang.save(event,\'' + (id || '') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanggal Masuk *</label>';
        html += '<input type="date" name="tanggal_masuk" value="' + (data.tanggal_masuk || getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">ID Tanaman</label><input type="text" name="tanaman_id" value="' + (data.tanaman_id || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="MD-001"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Bobot (g)</label><input type="number" name="bobot" value="' + (data.bobot || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="1500"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        
        // Grade Select
        var gA = data.grade === 'A' ? 'selected' : '';
        var gB = data.grade === 'B' ? 'selected' : '';
        var gC = data.grade === 'C' ? 'selected' : '';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Grade</label>';
        html += '<select name="grade" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none; background:#fff;">';
        html += '<option value="A" ' + gA + '>A</option><option value="B" ' + gB + '>B</option><option value="C" ' + gC + '>C</option></select></div>';
        
        // Status Select
        var sStok = data.status === 'stok' ? 'selected' : '';
        var sJual = data.status === 'terjual' ? 'selected' : '';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Status</label>';
        html += '<select name="status" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none; background:#fff;">';
        html += '<option value="stok" ' + sStok + '>Stok</option><option value="terjual" ' + sJual + '>Terjual</option></select></div>';
        
        html += '</div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Pembeli (opsional)</label>';
        html += '<input type="text" name="pembeli" value="' + (data.pembeli || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="Nama Pembeli/Toko"></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="gudang.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    // Fungsi Hapus Data Gudang
    function deleteData(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data stok ini?')) {
            Storage.delete(Storage.KEYS.GUDANG, id);
            Router.navigate('gudang');
            if(typeof Notification !== 'undefined') {
                Notification.success('Data gudang berhasil dihapus!');
            } else {
                alert('Data gudang berhasil dihapus!');
            }
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = { 
            tanaman_id: f.tanaman_id.value, 
            tanggal_masuk: f.tanggal_masuk.value, 
            bobot: parseInt(f.bobot.value) || 0, 
            grade: f.grade.value, 
            status: f.status.value, 
            pembeli: f.pembeli.value 
        };
        
        if (id) {
            Storage.update(Storage.KEYS.GUDANG, id, d);
        } else {
            Storage.create(Storage.KEYS.GUDANG, d);
        }
        
        closeModal();
        Router.navigate('gudang');
        
        if(typeof Notification !== 'undefined') {
            Notification.success('Data stok berhasil disimpan!');
        }
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    
    function formatDate(d) { 
        if(!d) return '-'; 
        var dt = new Date(d); 
        var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        return ('0' + dt.getDate()).slice(-2) + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear(); 
    }
    
    function formatWeight(g) { 
        if (!g) return '0 g'; 
        return g >= 1000 ? (g / 1000).toFixed(1) + ' kg' : g + ' g'; 
    }
    
    function getToday() { return new Date().toISOString().split('T')[0]; }

    // Ekspos deleteData agar bisa dipanggil tombol HTML
    return { render, init, showForm, editForm, deleteData, save, closeModal };
})();
