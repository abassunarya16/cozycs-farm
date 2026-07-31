var tanaman = (function() {
    var currentFilter = 'all';
    var currentSearch = '';

    function render() {
        var data = getFiltered();
        var greenhouse = Storage.getAll(Storage.KEYS.GREENHOUSE);
        
        var html = '<div class="module-container">';
        html += '<div class="page-title"><h2><i class="fas fa-seedling"></i> Database Tanaman</h2>';
        html += '<button class="btn btn-primary" onclick="tanaman.showForm()"><i class="fas fa-plus"></i> Tambah</button></div>';
        
        html += '<div class="card"><div style="display:flex;gap:8px;flex-wrap:wrap;">';
        html += '<input type="text" placeholder="🔍 Cari..." value="' + currentSearch + '" oninput="tanaman.search(this.value)" style="flex:1;min-width:150px;padding:10px;border:1.5px solid #ddd;border-radius:8px;font-size:13px;">';
        html += '<select onchange="tanaman.setFilter(this.value)" style="padding:10px;border:1.5px solid #ddd;border-radius:8px;font-size:13px;background:#fff;">';
        html += '<option value="all">Semua</option><option value="hidup">Hidup</option><option value="mati">Mati</option><option value="panen">Panen</option>';
        html += '</select></div></div>';
        
        if (data.length === 0) {
            html += '<div class="empty-state"><i class="fas fa-seedling"></i><h3>Belum ada tanaman</h3></div>';
        } else {
            html += '<div class="table-container"><table class="data-table"><thead><tr>';
            html += '<th>ID</th><th>Varietas</th><th>GH</th><th>Tgl Tanam</th><th>HST</th><th>Status</th><th></th>';
            html += '</tr></thead><tbody>';
            data.forEach(function(t) {
                var gh = greenhouse.find(function(g) { return g.id === t.greenhouse_id; });
                html += '<tr><td><strong>' + t.id + '</strong></td><td>' + (t.varietas || '-') + '</td><td>' + (gh ? gh.kode : '-') + '</td>';
                html += '<td>' + formatDate(t.tanggal_tanam) + '</td><td>' + (t.hst || 0) + ' hr</td>';
                html += '<td><span class="status-badge ' + getStatusClass(t.status_tanaman) + '">' + (t.status_tanaman || 'aktif') + '</span></td>';
                html += '<td><button class="btn-icon-sm" onclick="tanaman.editForm(\'' + t.id + '\')"><i class="fas fa-edit"></i></button></td></tr>';
            });
            html += '</tbody></table></div>';
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
        
        var html = '<div class="modal-header"><h3>' + (isEdit?'Edit':'Tambah') + ' Tanaman</h3><button class="btn-icon" onclick="tanaman.closeModal()"><i class="fas fa-times"></i></button></div>';
        html += '<div class="modal-body"><form onsubmit="tanaman.save(event,\'' + (id||'') + '\')">';
        html += '<div class="form-group"><label>Greenhouse *</label><select name="greenhouse_id" required><option value="">Pilih</option>';
        gh.forEach(function(g) { html += '<option value="' + g.id + '"' + (data.greenhouse_id === g.id ? ' selected' : '') + '>' + g.kode + ' - ' + g.nama + '</option>'; });
        html += '</select></div>';
        html += '<div class="form-row"><div class="form-group"><label>Kode GH</label><input name="greenhouse_code" value="' + (data.greenhouse_code||'') + '"></div>';
        html += '<div class="form-group"><label>Varietas *</label><input name="varietas" value="' + (data.varietas||'') + '" required></div></div>';
        html += '<div class="form-row"><div class="form-group"><label>Talang</label><input type="number" name="talang" value="' + (data.talang||'') + '"></div>';
        html += '<div class="form-group"><label>Lubang</label><input type="number" name="lubang" value="' + (data.lubang||'') + '"></div></div>';
        html += '<div class="form-row"><div class="form-group"><label>Tgl Semai</label><input type="date" name="tanggal_semai" value="' + (data.tanggal_semai||'') + '"></div>';
        html += '<div class="form-group"><label>Tgl Tanam *</label><input type="date" name="tanggal_tanam" value="' + (data.tanggal_tanam||'') + '" required></div></div>';
        html += '<div class="form-group"><label>Status</label><select name="status_tanaman"><option value="aktif">Aktif</option><option value="sehat">Sehat</option><option value="sakit">Sakit</option><option value="mati">Mati</option></select></div>';
        html += '<div class="form-group"><label>Catatan</label><textarea name="catatan" rows="2">' + (data.catatan||'') + '</textarea></div>';
        html += '<div class="modal-footer"><button type="button" class="btn btn-secondary" onclick="tanaman.closeModal()">Batal</button><button type="submit" class="btn btn-primary">💾 Simpan</button></div>';
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

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
        if (!id) d.id = (d.greenhouse_code || 'GH') + '-T' + String(d.talang).padStart(2,'0') + '-L' + String(d.lubang).padStart(2,'0');
        if (id) Storage.update(Storage.KEYS.TANAMAN, id, d);
        else Storage.create(Storage.KEYS.TANAMAN, d);
        closeModal();
        Router.navigate('tanaman');
        Notification.success('Tanaman disimpan!');
    }

    function setFilter(f) { currentFilter = f; Router.navigate('tanaman'); }
    function search(q) { currentSearch = q; Router.navigate('tanaman'); }
    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    function formatDate(d) { if(!d) return '-'; var dt = new Date(d); return ('0'+dt.getDate()).slice(-2)+'/'+('0'+(dt.getMonth()+1)).slice(-2)+'/'+dt.getFullYear(); }
    function getStatusClass(s) { var m = {aktif:'active',sehat:'active',mati:'danger',sakit:'warning'}; return m[(s||'').toLowerCase()] || 'inactive'; }

    return { render: render, init: init, showForm: showForm, editForm: editForm, save: save, setFilter: setFilter, search: search, closeModal: closeModal };
})();
