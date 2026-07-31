var spray = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.SPRAY);
        data.sort(function(a,b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        
        var html = '<div class="module-container">';
        
        html += '<div class="page-title" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">';
        html += '<h2 style="margin:0; font-size:20px;"><i class="fas fa-spray-can" style="color:#2E7D32; margin-right:8px;"></i> Penyemprotan</h2>';
        html += '<button style="background:#2E7D32; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 2px 6px rgba(46,125,50,0.3);" onclick="spray.showForm()">';
        html += '<i class="fas fa-plus"></i> Input Semprot</button></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-spray-can" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada data penyemprotan</h3></div>';
        } else {
            html += '<div style="display:flex; flex-direction:column; gap:10px;">';
            data.forEach(function(s) {
                var jenisColor = s.jenis_semprot==='Insektisida'?'#D32F2F':s.jenis_semprot==='Fungisida'?'#1976D2':s.jenis_semprot==='Nutrisi Daun'?'#2E7D32':'#F57C00';
                var jenisBg = s.jenis_semprot==='Insektisida'?'#FFEBEE':s.jenis_semprot==='Fungisida'?'#E3F2FD':s.jenis_semprot==='Nutrisi Daun'?'#E8F5E9':'#FFF3E0';
                
                html += '<div style="background:#fff; border-radius:12px; padding:14px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">';
                html += '<div><strong style="font-size:14px; color:#1B5E20;">' + (s.jenis_semprot || '-') + '</strong><br><small style="color:#888;">' + (s.target || 'Tanpa target') + '</small></div>';
                html += '<span style="font-size:11px; background:' + jenisBg + '; color:' + jenisColor + '; padding:4px 10px; border-radius:12px; font-weight:600;">' + (s.dosis || '-') + '</span>';
                html += '</div>';
                
                html += '<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px; text-align:center; margin-bottom:10px;">';
                html += '<div style="background:#E8F5E9; padding:8px; border-radius:8px;"><div style="font-weight:700; color:#2E7D32;">' + formatDate(s.tanggal) + '</div><div style="font-size:10px; color:#666;">Tanggal</div></div>';
                html += '<div style="background:#FFF3E0; padding:8px; border-radius:8px;"><div style="font-weight:700; color:#F57C00;">' + (s.operator || '-') + '</div><div style="font-size:10px; color:#666;">Operator</div></div>';
                html += '</div>';
                
                if (s.catatan) html += '<div style="font-size:11px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:8px;">📝 ' + s.catatan + '</div>';
                
                html += '<div style="display:flex; justify-content:flex-end; gap:6px;">';
                html += '<button onclick="spray.editForm(\'' + s.id + '\')" style="padding:6px 12px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:11px; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="spray.deleteData(\'' + s.id + '\')" style="padding:6px 12px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:11px; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
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
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;">';
        html += '<h3 style="margin:0;font-size:16px;"><i class="fas '+(isEdit?'fa-edit':'fa-plus-circle')+'" style="margin-right:8px;color:#2E7D32;"></i>' + (isEdit?'Edit':'Input') + ' Penyemprotan</h3>';
        html += '<button onclick="spray.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="spray.save(event,\'' + (id||'') + '\')">';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Tanggal *</label><input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Jenis Semprot *</label><select name="jenis_semprot" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;background:#fff;"><option value="Insektisida">🐛 Insektisida</option><option value="Fungisida">🍄 Fungisida</option><option value="Nutrisi Daun">🌿 Nutrisi Daun</option><option value="Pestisida">☠️ Pestisida</option><option value="Lainnya">📋 Lainnya</option></select></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Dosis *</label><input name="dosis" value="' + (data.dosis||'') + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;" placeholder="5 ml/L"></div></div>';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Target</label><input name="target" value="' + (data.target||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;" placeholder="Kutu Daun, Jamur, dll"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Operator</label><input name="operator" value="' + (data.operator||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;" placeholder="Nama operator"></div></div>';
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Catatan</label><textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;" placeholder="Opsional...">' + (data.catatan||'') + '</textarea></div>';
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="spray.closeModal()" style="padding:12px 20px;background:#eee;border:none;border-radius:10px;font-size:14px;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">💾 Simpan</button>';
        html += '</div></form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Hapus data penyemprotan ini?')) {
            Storage.remove(Storage.KEYS.SPRAY, id);
            Router.navigate('spray');
            Notification.success('Data penyemprotan dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = { tanggal: f.tanggal.value, jenis_semprot: f.jenis_semprot.value, dosis: f.dosis.value, target: f.target.value, operator: f.operator.value, catatan: f.catatan.value };
        if (id) Storage.update(Storage.KEYS.SPRAY, id, d);
        else Storage.create(Storage.KEYS.SPRAY, d);
        closeModal();
        Router.navigate('spray');
        Notification.success('Penyemprotan disimpan!');
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    function formatDate(d) { if(!d)return'-'; var dt=new Date(d); return ('0'+dt.getDate()).slice(-2)+'/'+('0'+(dt.getMonth()+1)).slice(-2)+'/'+dt.getFullYear(); }
    function getToday() { return new Date().toISOString().split('T')[0]; }

    return { render, init, showForm, editForm, deleteData, save, closeModal };
})();