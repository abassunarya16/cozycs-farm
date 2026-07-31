var polinasi = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.POLINASI);
        data.sort(function(a,b) { return new Date(b.createdAt) - new Date(a.createdAt); });
        
        var html = '<div class="module-container">';
        html += '<div class="page-title"><h2><i class="fas fa-feather"></i> Polinasi</h2>';
        html += '<button class="btn btn-primary" onclick="polinasi.showForm()"><i class="fas fa-plus"></i> Input</button></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state"><i class="fas fa-feather"></i><h3>Belum ada data</h3></div>';
        } else {
            html += '<div class="table-container"><table class="data-table"><thead><tr>';
            html += '<th>Tanggal</th><th>Tanaman</th><th>Ruas</th><th>Operator</th><th>Status</th><th></th>';
            html += '</tr></thead><tbody>';
            data.forEach(function(p) {
                html += '<tr><td>' + formatDate(p.tanggal) + '</td><td><strong>' + p.tanaman_id + '</strong></td>';
                html += '<td>' + (p.ruas || '-') + '</td><td>' + (p.operator || '-') + '</td>';
                html += '<td><span class="status-badge ' + (p.status==='berhasil'?'active':'danger') + '">' + p.status + '</span></td>';
                html += '<td><button class="btn-icon-sm" onclick="polinasi.editForm(\'' + p.id + '\')"><i class="fas fa-edit"></i></button></td></tr>';
            });
            html += '</tbody></table></div>';
        }
        html += '</div>';
        return html;
    }

    function init() {}

    function showForm(id) {
        var isEdit = !!id;
        var data = isEdit ? Storage.getById(Storage.KEYS.POLINASI, id) : {};
        
        var html = '<div class="modal-header"><h3>' + (isEdit?'Edit':'Input') + ' Polinasi</h3><button class="btn-icon" onclick="polinasi.closeModal()"><i class="fas fa-times"></i></button></div>';
        html += '<div class="modal-body"><form onsubmit="polinasi.save(event,\'' + (id||'') + '\')">';
        html += '<div class="form-group"><label>Tanaman *</label><select name="tanaman_id" required><option value="">Pilih</option>';
        var tanaman = Storage.query(Storage.KEYS.TANAMAN, function(t) { return t.status_tanaman !== 'mati' && t.status_panen !== 'panen'; });
        tanaman.forEach(function(t) { html += '<option value="' + t.id + '"' + (data.tanaman_id===t.id?' selected':'') + '>' + t.id + ' - ' + t.varietas + '</option>'; });
        html += '</select></div>';
        html += '<div class="form-row"><div class="form-group"><label>Tanggal *</label><input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required></div>';
        html += '<div class="form-group"><label>Jam</label><input type="time" name="jam" value="' + (data.jam||'') + '"></div></div>';
        html += '<div class="form-row"><div class="form-group"><label>Ruas</label><input name="ruas" value="' + (data.ruas||'') + '"></div>';
        html += '<div class="form-group"><label>Operator</label><input name="operator" value="' + (data.operator||'') + '"></div></div>';
        html += '<div class="form-group"><label>Status *</label><select name="status" required><option value="berhasil">Berhasil</option><option value="gagal">Gagal</option></select></div>';
        html += '<div class="form-group"><label>Catatan</label><textarea name="catatan" rows="2">' + (data.catatan||'') + '</textarea></div>';
        html += '<div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="polinasi.closeModal()">Batal</button><button type="submit" class="btn btn-primary">💾 Simpan</button></div>';
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = { tanaman_id: f.tanaman_id.value, tanggal: f.tanggal.value, jam: f.jam.value, ruas: f.ruas.value, operator: f.operator.value, status: f.status.value, catatan: f.catatan.value };
        if (id) Storage.update(Storage.KEYS.POLINASI, id, d);
        else Storage.create(Storage.KEYS.POLINASI, d);
        if (d.status === 'berhasil') Storage.update(Storage.KEYS.TANAMAN, d.tanaman_id, { status_polinasi: 'sudah polinasi' });
        closeModal();
        Router.navigate('polinasi');
        Notification.success('Polinasi disimpan!');
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    function formatDate(d) { if(!d) return '-'; var dt = new Date(d); return ('0'+dt.getDate()).slice(-2)+'/'+('0'+(dt.getMonth()+1)).slice(-2)+'/'+dt.getFullYear(); }
    function getToday() { return new Date().toISOString().split('T')[0]; }

    return { render: render, init: init, showForm: showForm, editForm: editForm, save: save, closeModal: closeModal };
})();
