var tanaman = (function() {
    var currentFilter = 'all';
    var currentSearch = '';

    function render() {
        var data = getFiltered();
        var greenhouse = Storage.getAll(Storage.KEYS.GREENHOUSE);
        
        var html = '<div class="module-container">';
        
        // Header & Tombol Tambah
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-seedling" style="color:#2E7D32; margin-right:8px;"></i> Tanaman</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="tanaman.showForm()">';
        html += '<i class="fas fa-plus"></i> Tambah</button></div>';
        
        // Pencarian & Filter
        html += '<div style="background:#fff; border-radius:12px; padding:12px; margin-bottom:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
        html += '<div style="display:flex; gap:10px; flex-wrap:wrap;">';
        
        // Kotak Cari
        html += '<div style="flex:1; min-width:150px; position:relative;">';
        html += '<i class="fas fa-search" style="position:absolute; left:12px; top:14px; color:#999; font-size:13px;"></i>';
        html += '<input type="text" placeholder="Cari ID atau Varietas..." value="' + currentSearch + '" oninput="tanaman.search(this.value)" style="width:100%; padding:10px 10px 10px 32px; border:1.5px solid #ddd; border-radius:8px; font-size:13px; outline:none;">';
        html += '</div>';
        
        // Kotak Filter
        html += '<select onchange="tanaman.setFilter(this.value)" style="padding:10px 12px; border:1.5px solid #ddd; border-radius:8px; font-size:13px; background:#fff; outline:none; min-width:110px;">';
        html += '<option value="all"' + (currentFilter==='all'?' selected':'') + '>Semua</option>';
        html += '<option value="hidup"' + (currentFilter==='hidup'?' selected':'') + '>🌱 Hidup</option>';
        html += '<option value="mati"' + (currentFilter==='mati'?' selected':'') + '>❌ Mati</option>';
        html += '<option value="panen"' + (currentFilter==='panen'?' selected':'') + '>🌾 Panen</option>';
        html += '</select>';
        html += '</div></div>';
        
        // Daftar Data Tanaman (Card Layout)
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-leaf" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada tanaman ditemukan</h3></div>';
        } else {
            html += '<div style="font-size:13px; font-weight:700; color:#555; margin-bottom:12px;">Menampilkan ' + data.length + ' tanaman</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.forEach(function(t) {
                var gh = greenhouse.find(function(g) { return g.id === t.greenhouse_id; });
                var ghName = gh ? gh.kode : (t.greenhouse_code || '-');
                var hst = hitungHST(t.tanggal_tanam); // Fitur hitung otomatis umur tanaman
                
                // Layout Kartu per Data
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu: ID Tanaman & Status
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:700; color:#1B5E20; font-size:15px; letter-spacing:0.5px;">' + t.id + '</div>';
                
                // Lencana Status Tanaman
                var stColor = '#777', stBg = '#f5f5f5', icon = '';
                var st = (t.status_tanaman || 'aktif').toLowerCase();
                if (st === 'aktif' || st === 'sehat') { stColor = '#2E7D32'; stBg = '#E8F5E9'; icon = 'fa-check-circle'; }
                else if (st === 'sakit') { stColor = '#F57F17'; stBg = '#FFF8E1'; icon = 'fa-exclamation-triangle'; }
                else if (st === 'mati') { stColor = '#D32F2F'; stBg = '#FFEBEE'; icon = 'fa-times-circle'; }
                
                html += '<div style="font-size:11px; color:' + stColor + '; background:' + stBg + '; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;"><i class="fas ' + icon + '" style="margin-right:4px;"></i>' + st + '</div>';
                html += '</div>';
                
                // Isi Kartu: Grid Informasi
                html += '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">';
                
                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-leaf" style="color:#7CB342; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Varietas</div><div style="font-weight:600; color:#333; font-size:13px;">' + (t.varietas || '-') + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-warehouse" style="color:#1976D2; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Greenhouse</div><div style="font-weight:600; color:#333; font-size:13px;">' + ghName + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="far fa-calendar-alt" style="color:#F57C00; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Tgl Tanam</div><div style="font-weight:600; color:#333; font-size:13px;">' + formatDate(t.tanggal_tanam) + '</div></div>';
                html += '</div>';

                html += '<div style="display:flex; align-items:flex-start; gap:8px;">';
                html += '<i class="fas fa-stopwatch" style="color:#8E24AA; font-size:14px; margin-top:2px;"></i>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Umur (HST)</div><div style="font-weight:700; color:#8E24AA; font-size:13px;">' + hst + ' Hari</div></div>';
                html += '</div>';
                
                html += '</div>'; // End Grid

                // Indikator Posisi (Talang & Lubang)
                if (t.talang || t.lubang) {
                    html += '<div style="font-size:11px; color:#666; background:#f9f9f9; padding:6px 10px; border-radius:6px; margin-bottom:12px; display:inline-block;">';
                    html += '<i class="fas fa-map-marker-alt" style="margin-right:4px; color:#999;"></i> Posisi: Talang <b>' + (t.talang||'-') + '</b> / Lubang <b>' + (t.lubang||'-') + '</b>';
                    html += '</div>';
                }

                // Footer Kartu: Tombol Aksi (Edit & Hapus)
                html += '<div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px dashed #eee; padding-top:12px;">';
                html += '<button onclick="tanaman.editForm(\'' + t.id + '\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="tanaman.deleteData(\'' + t.id + '\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
                html += '</div>';
                
                html += '</div>'; // End of Card
            });
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    function init() {}

    function getFiltered() {
        var data = Storage.getAll(Storage.KEYS.TANAMAN);
        if (currentFilter === 'hidup') data = data.filter(function(t) { return t.status_tanaman !== 'mati' && t.status_panen !== 'panen'; });
        if (currentFilter === 'mati') data = data.filter(function(t) { return t.status_tanaman === 'mati'; });
        if (currentFilter === 'panen') data = data.filter(function(t) { return t.status_panen === 'panen'; });
        if (currentSearch) {
            var s = currentSearch.toLowerCase();
            data = data.filter(function(t) { return (t.id||'').toLowerCase().indexOf(s)>=0 || (t.varietas||'').toLowerCase().indexOf(s)>=0; });
        }
        return data.sort(function(a,b){ return new Date(b.createdAt) - new Date(a.createdAt); });
    }

    function showForm(id) {
        var isEdit = !!id;
        var data = isEdit ? Storage.getById(Storage.KEYS.TANAMAN, id) : {};
        var gh = Storage.getAll(Storage.KEYS.GREENHOUSE);
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas ' + (isEdit ? 'fa-edit' : 'fa-plus-circle') + '" style="margin-right:8px;"></i>' + (isEdit ? 'Edit' : 'Tambah') + ' Tanaman</h3>';
        html += '<button onclick="tanaman.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;">';
        html += '<form onsubmit="tanaman.save(event,\'' + (id || '') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Greenhouse *</label>';
        html += '<select name="greenhouse_id" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;">';
        html += '<option value="">Pilih Greenhouse</option>';
        gh.forEach(function(g) { html += '<option value="' + g.id + '"' + (data.greenhouse_id === g.id ? ' selected' : '') + '>' + g.kode + ' - ' + g.nama + '</option>'; });
        html += '</select></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Kode GH</label><input name="greenhouse_code" value="' + (data.greenhouse_code || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="GH01"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Varietas *</label><input name="varietas" value="' + (data.varietas || '') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="Rock Melon"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Talang</label><input type="number" name="talang" value="' + (data.talang || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="1"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Lubang</label><input type="number" name="lubang" value="' + (data.lubang || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;" placeholder="1"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tgl Semai</label><input type="date" name="tanggal_semai" value="' + (data.tanggal_semai || '') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tgl Tanam *</label><input type="date" name="tanggal_tanam" value="' + (data.tanggal_tanam || '') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Status Kondisi</label>';
        
        var st = data.status_tanaman || 'aktif';
        html += '<select name="status_tanaman" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;background:#fff;outline:none;">';
        html += '<option value="aktif"' + (st==='aktif'?' selected':'') + '>✅ Aktif / Normal</option>';
        html += '<option value="sehat"' + (st==='sehat'?' selected':'') + '>💚 Sangat Sehat</option>';
        html += '<option value="sakit"' + (st==='sakit'?' selected':'') + '>⚠️ Sakit / Terinfeksi</option>';
        html += '<option value="mati"' + (st==='mati'?' selected':'') + '>❌ Mati</option>';
        html += '</select></div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Catatan (Opsional)</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;outline:none;font-family:inherit;" placeholder="Tuliskan catatan...">' + (data.catatan || '') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="tanaman.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    // Fungsi Tambahan: Hapus Data
    function deleteData(id) {
        if (confirm('Yakin ingin menghapus data tanaman ini secara permanen?')) {
            Storage.delete(Storage.KEYS.TANAMAN, id);
            Router.navigate('tanaman');
            if(typeof Notification !== 'undefined') {
                Notification.success('Data tanaman dihapus!');
            } else {
                alert('Data dihapus!');
            }
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = {
            greenhouse_id: f.greenhouse_id.value,
            greenhouse_code: f.greenhouse_code.value,
            talang: parseInt(f.talang.value) || 0,
            lubang: parseInt(f.lubang.value) || 0,
            varietas: f.varietas.value,
            tanggal_semai: f.tanggal_semai.value,
            tanggal_tanam: f.tanggal_tanam.value,
            status_tanaman: f.status_tanaman.value || 'aktif',
            status_polinasi: 'belum polinasi',
            status_buah: 'belum',
            status_panen: 'belum panen',
            catatan: f.catatan.value
        };
        
        // Buat ID otomatis jika belum ada: GH-T(xx)-L(xx)
        if (!id) d.id = (d.greenhouse_code || 'GH') + '-T' + String(d.talang).padStart(2, '0') + '-L' + String(d.lubang).padStart(2, '0');
        
        if (id) Storage.update(Storage.KEYS.TANAMAN, id, d);
        else Storage.create(Storage.KEYS.TANAMAN, d);
        
        closeModal();
        Router.navigate('tanaman');
        
        if(typeof Notification !== 'undefined') {
            Notification.success('Data tanaman berhasil disimpan!');
        }
    }

    function setFilter(f) { currentFilter = f; Router.navigate('tanaman'); }
    function search(q) { currentSearch = q; Router.navigate('tanaman'); }
    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    
    // Helper Format Tanggal (ex: 28 Jul 2026)
    function formatDate(d) { 
        if(!d) return '-'; 
        var dt = new Date(d); 
        var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        return ('0' + dt.getDate()).slice(-2) + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear(); 
    }
    
    // Helper Hitung HST
    function hitungHST(tanggalTanam) {
        if(!tanggalTanam) return 0;
        var tanam = new Date(tanggalTanam);
        var sekarang = new Date();
        var bedaWaktu = sekarang.getTime() - tanam.getTime();
        var bedaHari = Math.floor(bedaWaktu / (1000 * 3600 * 24));
        return bedaHari > 0 ? bedaHari : 0;
    }

    return { render, init, showForm, editForm, deleteData, save, setFilter, search, closeModal };
})();
