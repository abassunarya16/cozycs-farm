var nutrisi = (function() {

    function render() {
        var data = Storage.getAll(Storage.KEYS.NUTRISI);
        data.sort(function(a,b) { return new Date(b.tanggal) - new Date(a.tanggal); });
        var latest = data[0] || {};
        
        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title">';
        html += '<h2><i class="fas fa-flask"></i> Nutrisi</h2>';
        html += '<button class="btn btn-primary" onclick="nutrisi.showForm()"><i class="fas fa-plus"></i> Input Nutrisi</button>';
        html += '</div>';
        
        // Pembacaan Terakhir
        if (data.length > 0) {
            html += '<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e0e0e0;">';
            html += '<div style="font-size:13px;font-weight:700;color:#1B5E20;margin-bottom:12px;"><i class="fas fa-chart-bar"></i> Pembacaan Terakhir</div>';
            html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">';
            
            html += '<div style="background:#F3E5F5;padding:12px;border-radius:10px;">';
            html += '<div style="font-size:20px;font-weight:700;color:#7B1FA2;">'+(latest.ppm_pagi||'-')+'</div>';
            html += '<div style="font-size:11px;color:#666;">PPM</div></div>';
            
            html += '<div style="background:#E0F2F1;padding:12px;border-radius:10px;">';
            html += '<div style="font-size:20px;font-weight:700;color:#00838F;">'+(latest.ph_pagi||'-')+'</div>';
            html += '<div style="font-size:11px;color:#666;">pH</div></div>';
            
            html += '<div style="background:#E3F2FD;padding:12px;border-radius:10px;">';
            html += '<div style="font-size:20px;font-weight:700;color:#1976D2;">'+(latest.suhu_air?latest.suhu_air+'°C':'-')+'</div>';
            html += '<div style="font-size:11px;color:#666;">Suhu Air</div></div>';
            
            html += '</div></div>';
        }
        
        // Riwayat
        if (data.length === 0) {
            html += '<div class="empty-state"><i class="fas fa-flask"></i><h3>Belum ada data nutrisi</h3></div>';
        } else {
            html += '<div style="font-size:14px;font-weight:700;color:#333;margin-bottom:10px;"><i class="fas fa-history"></i> Riwayat Nutrisi</div>';
            
            data.slice(0, 20).forEach(function(n) {
                html += '<div style="background:#fff;border-radius:10px;padding:14px;margin-bottom:10px;box-shadow:0 2px 6px rgba(0,0,0,0.04);border:1px solid #f0f0f0;">';
                
                // Header: Tanggal + Operator
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">';
                html += '<strong style="color:#2E7D32;">' + formatDate(n.tanggal) + '</strong>';
                if (n.operator) html += '<span style="font-size:11px;color:#888;">👤 ' + n.operator + '</span>';
                html += '</div>';
                
                // Grid nilai
                html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;margin-bottom:10px;">';
                html += '<div><div style="font-size:10px;color:#888;">PPM</div><div style="font-weight:700;color:#7B1FA2;">'+(n.ppm_pagi||'-')+'</div></div>';
                html += '<div><div style="font-size:10px;color:#888;">pH</div><div style="font-weight:700;color:#00838F;">'+(n.ph_pagi||'-')+'</div></div>';
                html += '<div><div style="font-size:10px;color:#888;">Vol (L)</div><div style="font-weight:600;">'+(n.volume_air||'-')+'</div></div>';
                html += '<div><div style="font-size:10px;color:#888;">Suhu</div><div style="font-weight:600;color:#1976D2;">'+(n.suhu_air?n.suhu_air+'°C':'-')+'</div></div>';
                html += '</div>';
                
                // Catatan
                if (n.catatan) {
                    html += '<div style="font-size:11px;color:#666;background:#f9f9f9;padding:8px;border-radius:6px;margin-bottom:8px;">📝 ' + n.catatan + '</div>';
                }
                
                // Tombol
                html += '<div style="display:flex;justify-content:flex-end;gap:6px;">';
                html += '<button onclick="nutrisi.editForm(\''+n.id+'\')" style="padding:6px 12px;background:#E3F2FD;color:#1976D2;border:none;border-radius:6px;font-size:11px;cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="nutrisi.deleteData(\''+n.id+'\')" style="padding:6px 12px;background:#FFEBEE;color:#D32F2F;border:none;border-radius:6px;font-size:11px;cursor:pointer;"><i class="fas fa-trash"></i> Hapus</button>';
                html += '</div>';
                
                html += '</div>';
            });
        }
        
        html += '</div>';
        return html;
    }

    function init() {}

    function showForm(id) {
        var isEdit = !!id;
        var data = isEdit ? Storage.getById(Storage.KEYS.NUTRISI, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;">';
        html += '<h3 style="margin:0;font-size:16px;">' + (isEdit?'Edit':'Input') + ' Nutrisi</h3>';
        html += '<button onclick="nutrisi.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="nutrisi.save(event,\'' + (id||'') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Tanggal *</label>';
        html += '<input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">PPM Pagi</label><input type="number" name="ppm_pagi" value="' + (data.ppm_pagi||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">PPM Sore</label><input type="number" name="ppm_sore" value="' + (data.ppm_sore||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">pH Pagi</label><input type="number" name="ph_pagi" value="' + (data.ph_pagi||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">pH Sore</label><input type="number" name="ph_sore" value="' + (data.ph_sore||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Volume Air (L)</label><input type="number" name="volume_air" value="' + (data.volume_air||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Suhu Air (°C)</label><input type="number" name="suhu_air" value="' + (data.suhu_air||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Operator</label>';
        html += '<input name="operator" value="' + (data.operator||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;"></div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:4px;">Catatan</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:10px;font-size:14px;">' + (data.catatan||'') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="nutrisi.closeModal()" style="padding:12px 20px;background:#eee;border:none;border-radius:10px;font-size:14px;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    function deleteData(id) {
        if (confirm('Hapus data nutrisi ini?')) {
            // PERBAIKAN: Mengecek fungsi hapus yang tersedia di storage.js
            if (typeof Storage.delete === 'function') {
                Storage.delete(Storage.KEYS.NUTRISI, id);
            } else if (typeof Storage.remove === 'function') {
                Storage.remove(Storage.KEYS.NUTRISI, id);
            }
            
            Router.navigate('nutrisi');
            Notification.success('Data berhasil dihapus!');
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = {
            tanggal: f.tanggal.value,
            ppm_pagi: parseInt(f.ppm_pagi.value) || null,
            ppm_sore: parseInt(f.ppm_sore.value) || null,
            ph_pagi: parseFloat(f.ph_pagi.value) || null,
            ph_sore: parseFloat(f.ph_sore.value) || null,
            volume_air: parseInt(f.volume_air.value) || null,
            suhu_air: parseFloat(f.suhu_air.value) || null,
            operator: f.operator.value,
            catatan: f.catatan.value
        };
        if (id) Storage.update(Storage.KEYS.NUTRISI, id, d);
        else Storage.create(Storage.KEYS.NUTRISI, d);
        closeModal();
        Router.navigate('nutrisi');
        Notification.success('Data nutrisi berhasil disimpan!');
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    
    function formatDate(d) { 
        if(!d) return '-'; 
        var dt = new Date(d); 
        return ('0' + dt.getDate()).slice(-2) + '/' + ('0' + (dt.getMonth() + 1)).slice(-2) + '/' + dt.getFullYear(); 
    }
    
    function getToday() { return new Date().toISOString().split('T')[0]; }

    return { render: render, init: init, showForm: showForm, editForm: editForm, deleteData: deleteData, save: save, closeModal: closeModal };
})();
            html += '<div class="empty-state" style="text-align:center; padding:40px 20px; background:#fff; border-radius:12px; border:1px dashed #ccc;">';
            html += '<i class="fas fa-flask" style="font-size:40px; color:#ddd; margin-bottom:12px;"></i><h3 style="color:#777; font-size:16px;">Belum ada data nutrisi</h3></div>';
        } else {
            html += '<div style="font-size:14px; font-weight:700; color:#333; margin-bottom:12px; display:flex; align-items:center; gap:8px;">';
            html += '<i class="fas fa-history" style="color:#777;"></i> Riwayat Nutrisi</div>';
            
            html += '<div style="display:flex; flex-direction:column; gap:12px;">';
            data.slice(0, 20).forEach(function(n) {
                // Layout Kartu per Data
                html += '<div style="background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,0.04); border:1px solid #f0f0f0;">';
                
                // Header Kartu: Tanggal & Operator
                html += '<div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f0f0f0; padding-bottom:10px; margin-bottom:12px;">';
                html += '<div style="font-weight:600; color:#2E7D32; font-size:14px;"><i class="far fa-calendar-alt" style="margin-right:6px;"></i>'+formatDate(n.tanggal)+'</div>';
                if (n.operator) {
                    html += '<div style="font-size:11px; color:#888; background:#f5f5f5; padding:4px 8px; border-radius:4px;"><i class="fas fa-user" style="margin-right:4px;"></i>'+n.operator+'</div>';
                }
                html += '</div>';
                
                // Isi Kartu: Grid Nilai
                html += '<div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; text-align:center; margin-bottom:16px;">';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">PPM</div><div style="font-weight:700; color:#7B1FA2; font-size:14px;">'+(n.ppm_pagi||'-')+'</div></div>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">pH</div><div style="font-weight:700; color:#00838F; font-size:14px;">'+(n.ph_pagi||'-')+'</div></div>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Vol (L)</div><div style="font-weight:600; color:#424242; font-size:14px;">'+(n.volume_air||'-')+'</div></div>';
                html += '<div><div style="font-size:11px; color:#888; margin-bottom:2px;">Suhu</div><div style="font-weight:600; color:#1976D2; font-size:14px;">'+(n.suhu_air?n.suhu_air+'°C':'-')+'</div></div>';
                html += '</div>';

                // Catatan (jika ada)
                if (n.catatan) {
                    html += '<div style="font-size:12px; color:#666; background:#f9f9f9; padding:8px; border-radius:6px; margin-bottom:12px; font-style:italic;">';
                    html += '<i class="fas fa-info-circle" style="margin-right:4px;"></i> '+n.catatan+'</div>';
                }
                
                // Footer Kartu: Tombol Aksi (Edit & Hapus)
                html += '<div style="display:flex; justify-content:flex-end; gap:8px;">';
                html += '<button onclick="nutrisi.editForm(\''+n.id+'\')" style="padding:6px 14px; background:#E3F2FD; color:#1976D2; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-edit"></i> Edit</button>';
                html += '<button onclick="nutrisi.deleteData(\''+n.id+'\')" style="padding:6px 14px; background:#FFEBEE; color:#D32F2F; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;"><i class="fas fa-trash-alt"></i> Hapus</button>';
                html += '</div>';
                
                html += '</div>'; // End of Card
            });
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    function init() {
        setTimeout(function() {
            var data = Storage.getAll(Storage.KEYS.NUTRISI);
            if (data.length > 0 && document.getElementById('nutrisiChart')) {
                try { Chart.createLineChart('nutrisiChart', data.slice(-7).map(function(d){return d.tanggal}), [{label:'PPM',data:data.slice(-7).map(function(d){return d.ppm_pagi}),color:'#2E7D32'}]); } catch(e) {}
            }
        }, 500);
    }

    function showForm(id) {
        var isEdit = !!id;
        var data = isEdit ? Storage.getById(Storage.KEYS.NUTRISI, id) : {};
        
        var html = '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee; background:#fcfcfc; border-radius:16px 16px 0 0;">';
        html += '<h3 style="margin:0;font-size:16px; color:#2E7D32;"><i class="fas '+(isEdit?'fa-edit':'fa-plus-circle')+'" style="margin-right:8px;"></i>' + (isEdit?'Edit':'Input') + ' Nutrisi</h3>';
        html += '<button onclick="nutrisi.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>';
        
        html += '<div style="padding:20px;"><form onsubmit="nutrisi.save(event,\'' + (id||'') + '\')">';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Tanggal *</label>';
        html += '<input type="date" name="tanggal" value="' + (data.tanggal||getToday()) + '" required style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;"></div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">PPM Pagi</label><input type="number" name="ppm_pagi" value="' + (data.ppm_pagi||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="1200"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">PPM Sore</label><input type="number" name="ppm_sore" value="' + (data.ppm_sore||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="1180"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">pH Pagi</label><input type="number" name="ph_pagi" value="' + (data.ph_pagi||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="6.2"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">pH Sore</label><input type="number" name="ph_sore" value="' + (data.ph_sore||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="6.4"></div>';
        html += '</div>';
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Volume Air (L)</label><input type="number" name="volume_air" value="' + (data.volume_air||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="200"></div>';
        html += '<div><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Suhu Air (°C)</label><input type="number" name="suhu_air" value="' + (data.suhu_air||'') + '" step="0.1" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="26.5"></div>';
        html += '</div>';
        
        html += '<div style="margin-bottom:14px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Operator</label>';
        html += '<input name="operator" value="' + (data.operator||'') + '" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none;" placeholder="Nama Anda"></div>';
        
        html += '<div style="margin-bottom:20px;"><label style="display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:6px;">Catatan Tambahan</label>';
        html += '<textarea name="catatan" rows="2" style="width:100%;padding:12px;border:1.5px solid #ddd;border-radius:8px;font-size:14px; outline:none; font-family:inherit;" placeholder="Opsional...">' + (data.catatan||'') + '</textarea></div>';
        
        html += '<div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid #eee;">';
        html += '<button type="button" onclick="nutrisi.closeModal()" style="padding:12px 20px;background:#f5f5f5; color:#555; border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">Batal</button>';
        html += '<button type="submit" style="padding:12px 24px;background:#2E7D32;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 4px rgba(46,125,50,0.3);">💾 Simpan</button>';
        html += '</div>';
        
        html += '</form></div>';
        
        document.getElementById('modalContent').innerHTML = html;
        document.getElementById('modalContainer').style.display = 'flex';
    }

    function editForm(id) { showForm(id); }

    // Fungsi Hapus Data
    function deleteData(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data nutrisi ini?')) {
            Storage.delete(Storage.KEYS.NUTRISI, id);
            Router.navigate('nutrisi');
            if(typeof Notification !== 'undefined') {
                Notification.success('Data berhasil dihapus!');
            } else {
                alert('Data berhasil dihapus!');
            }
        }
    }

    function save(event, id) {
        event.preventDefault();
        var f = event.target;
        var d = {
            tanggal: f.tanggal.value,
            ppm_pagi: parseInt(f.ppm_pagi.value) || null,
            ppm_sore: parseInt(f.ppm_sore.value) || null,
            ph_pagi: parseFloat(f.ph_pagi.value) || null,
            ph_sore: parseFloat(f.ph_sore.value) || null,
            volume_air: parseInt(f.volume_air.value) || null,
            suhu_air: parseFloat(f.suhu_air.value) || null,
            operator: f.operator.value,
            catatan: f.catatan.value
        };
        if (id) Storage.update(Storage.KEYS.NUTRISI, id, d);
        else Storage.create(Storage.KEYS.NUTRISI, d);
        closeModal();
        Router.navigate('nutrisi');
        if(typeof Notification !== 'undefined') {
            Notification.success('Data nutrisi berhasil disimpan!');
        }
    }

    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    
    function formatDate(d) { 
        if(!d) return '-'; 
        var dt = new Date(d); 
        var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        return ('0' + dt.getDate()).slice(-2) + ' ' + months[dt.getMonth()] + ' ' + dt.getFullYear(); 
    }
    
    function getToday() { return new Date().toISOString().split('T')[0]; }

    // Ekspos deleteData agar bisa dipanggil dari HTML
    return { render, init, showForm, editForm, deleteData, save, closeModal };
})();
