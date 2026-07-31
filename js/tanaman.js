var tanaman = (function() {
    var currentFilter = 'all';
    var currentSearch = '';

    function render() {
        var data = getFiltered();
        var greenhouse = Storage.getAll(Storage.KEYS.GREENHOUSE);
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-seedling" style="color:#2E7D32; margin-right:8px;"></i> Database Tanaman</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="tanaman.showForm()">';
        html += '<i class="fas fa-plus"></i> Tambah</button></div>';
        
        // Search & Filter
        html += '<div style="display:flex;gap:8px;margin-bottom:16px;">';
        html += '<input type="text" placeholder="🔍 Cari tanaman..." value="' + currentSearch + '" oninput="tanaman.search(this.value)" style="flex:1;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:13px;">';
        html += '<select onchange="tanaman.setFilter(this.value)" style="padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:13px;background:#fff;">';
        html += '<option value="all" ' + (currentFilter==='all'?'selected':'') + '>Semua</option>';
        html += '<option value="hidup" ' + (currentFilter==='hidup'?'selected':'') + '>Hidup</option>';
        html += '<option value="mati" ' + (currentFilter==='mati'?'selected':'') + '>Mati</option>';
        html += '<option value="panen" ' + (currentFilter==='panen'?'selected':'') + '>Panen</option>';
        html += '</select></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-seedling" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada tanaman</h3></div>';
        } else {
            html += '<div style="display:flex; flex-direction:column; gap:10px;">';
            data.forEach(function(t) {
                var gh = greenhouse.find(function(g) { return g.id === t.greenhouse_id; });
                var hst = t.hst || 0;
                var hstColor = hst >= 55 ? '#D32F2F' : hst >= 35 ? '#F57C00' : '#2E7D32';
                
                html += '<div style="background:#fff; border-radius:12px; padding:14px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header
                html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">';
                html += '<div><strong style="font-size:14px; color:#1B5E20;">' + t.id + '</strong><br><small style="color:#888;">' + (t.varietas || '-') + '</small></div>';
                html += '<span class="status-badge ' + getStatusClass(t.status_tanaman) + '">' + (t.status_tanaman || 'aktif') + '</span>';
                html += '</div>';
                
                // Info Grid
                html += '<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; text-align:center; margin-bottom:10px;">';
                html += '<div style="background:#E8F5E9; padding:8px; border-radius:8px;"><div style="font-weight:700; color:#2E7D32;">' + (gh ? gh.kode : '-') + '</div><div style="font-size:10px; color:#666;">Greenhouse</div></div>';
                html += '<div style="background:#FFF3E0; padding:8px; border-radius:8px;"><div style="font-weight:700; color:#F57C00;">' + hst + ' hr</div><div style="font-size:10px; color:#666;">HST</div></div>';
                html += '<div style="background:#E3F2FD; padding:8px; border-radius:8px;"><div style="font-weight:700; color:#1976D2;">' + formatDate(t.tanggal_tanam) + '</div><div style="font-size:10px; color:#666;">Tgl Tanam</div></div>';
                html += '</div>';
                
                if (t.catatan) html += '<div style="font-size:11px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:8px;">📝 ' + t.catatan + '</div>';
                
                html += '<div style="display:flex; justify-content:flex-end; gap:6px;">';
                html += '<button onclick="tanaman.editForm(\'' + t.id + '\')" style="padding:6px 12px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:11px; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '</div>';
                
                html += '</div>';
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
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;">';
        html += '<h3 style="margin:0;font-size:16px;"><i class="fas '+(isEdit?'fa-edit':'fa-plus-circle')+'" style="margin-right:8px;color:#2E7D32;"></i>' + (isEdit?'Edit':'Tambah') + ' Tanaman</h3>';
        html += '<button onclick="tanaman.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="tanaman.save(event,\'' + (id||'') + '\')">';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Greenhouse *</label><select name="greenhouse_id" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;background:#fff;"><option value="">Pilih</option>';
        gh.forEach(function(g) { html += '<option value="' + g.id + '"' + (data.greenhouse_id===g.id?' selected':'') + '>' + g.kode + ' - ' + g.nama + '</option>'; });
        html += '</select></div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Kode GH</label><input name="greenhouse_code" value="' + (data.greenhouse_code||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Varietas *</label><input name="varietas" value="' + (data.varietas||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div></div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Talang</label><input type="number" name="talang" value="' + (data.talang||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Lubang</label><input type="number" name="lubang" value="' + (data.lubang||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div></div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Tgl Semai</label><input type="date" name="tanggal_semai" value="' + (data.tanggal_semai||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Tgl Tanam *</label><input type="date" name="tanggal_tanam" value="' + (data.tanggal_tanam||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div></div>';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Status</label><select name="status_tanaman" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;background:#fff;"><option value="aktif">✅ Aktif</option><option value="sehat">💚 Sehat</option><option value="sakit">⚠️ Sakit</option><option value="mati">❌ Mati</option></select></div>';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Catatan</label><textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;">' + (data.catatan||'') + '</textarea></div>';
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="tanaman.closeModal()" style="padding:12px 20px;background:#eee;border:none;border-radius:10px;font-size:14px;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">💾 Simpan</button>';
        html += '</div></form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = { greenhouse_id: f.greenhouse_id.value, greenhouse_code: f.greenhouse_code.value, talang: parseInt(f.talang.value)||0, lubang: parseInt(f.lubang.value)||0, varietas: f.varietas.value, tanggal_semai: f.tanggal_semai.value, tanggal_tanam: f.tanggal_tanam.value, status_tanaman: f.status_tanaman.value||'aktif', status_polinasi: 'belum polinasi', status_buah: 'belum', status_panen: 'belum panen', catatan: f.catatan.value };
        if (!id) d.id = (d.greenhouse_code||'GH')+'-T'+String(d.talang).padStart(2,'0')+'-L'+String(d.lubang).padStart(2,'0');
        if (id) Storage.update(Storage.KEYS.TANAMAN, id, d);
        else Storage.create(Storage.KEYS.TANAMAN, d);
        closeModal();
        Router.navigate('tanaman');
        Notification.success('Tanaman disimpan!');
    }

    function setFilter(f) { currentFilter = f; Router.navigate('tanaman'); }
    function search(q) { currentSearch = q; Router.navigate('tanaman'); }
    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    function formatDate(d) { if(!d)return'-'; var dt=new Date(d); return ('0'+dt.getDate()).slice(-2)+'/'+('0'+(dt.getMonth()+1)).slice(-2)+'/'+dt.getFullYear(); }
    function getStatusClass(s) { var m={aktif:'active',sehat:'active',mati:'danger',sakit:'warning'}; return m[(s||'').toLowerCase()]||'inactive'; }

    return { render, init, showForm, editForm, save, setFilter, search, closeModal };
})();