var laporan = (function() {

    function render() {
        var tanaman = Storage.getAll(Storage.KEYS.TANAMAN);
        var panen = Storage.getAll(Storage.KEYS.PANEN);
        var polinasi = Storage.getAll(Storage.KEYS.POLINASI);
        var totalKg = panen.reduce(function(s, x) { return s + (x.bobot || 0); }, 0) / 1000;
        var totalRp = panen.reduce(function(s, x) { return s + (x.harga || 0) * (x.bobot || 0) / 1000; }, 0);
        var avgBrix = panen.filter(function(p) { return p.brix; }).length > 0 ? 
            (panen.reduce(function(s, p) { return s + (p.brix || 0); }, 0) / panen.filter(function(p) { return p.brix; }).length).toFixed(1) : '-';
        
        var html = '<div class="module-container">';
        html += '<div class="page-title"><h2><i class="fas fa-file-alt"></i> Laporan</h2></div>';
        
        // Ringkasan Utama
        html += '<div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);border:1px solid #e0e0e0;">';
        html += '<div style="font-size:13px;font-weight:700;color:#1B5E20;margin-bottom:14px;"><i class="fas fa-chart-pie"></i> Ringkasan Utama</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
        html += summaryBox('#E8F5E9', '#2E7D32', tanaman.length, 'Total Tanaman');
        html += summaryBox('#FFF3E0', '#F57C00', panen.length, 'Total Panen');
        html += summaryBox('#E3F2FD', '#1976D2', totalKg.toFixed(1) + ' kg', 'Total Bobot');
        html += summaryBox('#FCE4EC', '#D32F2F', 'Rp ' + totalRp.toLocaleString('id-ID'), 'Pendapatan');
        html += summaryBox('#F3E5F5', '#7B1FA2', polinasi.length, 'Total Polinasi');
        html += summaryBox('#E0F2F1', '#00838F', avgBrix + '%', 'Rata Brix');
        html += '</div></div>';
        
        // Menu Laporan
        html += '<div style="font-size:13px;font-weight:700;color:#333;margin-bottom:10px;"><i class="fas fa-folder-open"></i> Pilih Laporan</div>';
        html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
        html += menuCard('greenhouse', 'fa-warehouse', '#E8F5E9', '#2E7D32', 'Greenhouse');
        html += menuCard('varietas', 'fa-seedling', '#FFF3E0', '#F57C00', 'Varietas');
        html += menuCard('keuangan', 'fa-money-bill-wave', '#E3F2FD', '#1976D2', 'Keuangan');
        html += menuCard('bulanan', 'fa-calendar-alt', '#FCE4EC', '#D32F2F', 'Bulanan');
        html += '</div>';
        
        html += '</div>';
        return html;
    }

    function init() {}

    function summaryBox(bg, color, value, label) {
        return '<div style="background:' + bg + ';padding:14px;border-radius:10px;text-align:center;">' +
            '<div style="font-size:20px;font-weight:700;color:' + color + ';">' + value + '</div>' +
            '<div style="font-size:11px;color:#666;">' + label + '</div></div>';
    }

    function menuCard(type, icon, bg, color, title) {
        return '<div onclick="laporan.generate(\'' + type + '\')" style="background:' + bg + ';padding:20px 16px;border-radius:12px;cursor:pointer;text-align:center;">' +
            '<i class="fas ' + icon + '" style="font-size:30px;color:' + color + ';margin-bottom:8px;"></i>' +
            '<div style="font-size:14px;font-weight:600;color:#333;">' + title + '</div></div>';
    }

    function generate(type) {
        var panen = Storage.getAll(Storage.KEYS.PANEN);
        var tanaman = Storage.getAll(Storage.KEYS.TANAMAN);
        var greenhouse = Storage.getAll(Storage.KEYS.GREENHOUSE);
        
        var title = '';
        var content = '';
        
        if (type === 'greenhouse') {
            title = '📊 Laporan Per Greenhouse';
            content = '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
                '<thead><tr style="background:#f5f5f5;">' +
                '<th style="padding:12px 8px;text-align:left;">Greenhouse</th>' +
                '<th style="padding:12px 8px;text-align:center;">Tanaman</th>' +
                '<th style="padding:12px 8px;text-align:center;">Panen</th>' +
                '<th style="padding:12px 8px;text-align:center;">Bobot</th></tr></thead><tbody>';
            
            greenhouse.forEach(function(gh, i) {
                var bg = i % 2 === 0 ? '#fff' : '#fafafa';
                var ghTanaman = tanaman.filter(function(t) { return t.greenhouse_id === gh.id; });
                var ghPanen = panen.filter(function(p) { return ghTanaman.some(function(t) { return t.id === p.tanaman_id; }); });
                var ghBobot = ghPanen.reduce(function(s, p) { return s + (p.bobot || 0); }, 0);
                
                content += '<tr style="background:' + bg + ';">' +
                    '<td style="padding:12px 8px;border-bottom:1px solid #eee;"><strong>' + gh.kode + '</strong><br><small style="color:#888;">' + (gh.nama || '') + '</small></td>' +
                    '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;">' + ghTanaman.length + '</td>' +
                    '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;">' + ghPanen.length + '</td>' +
                    '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;font-weight:600;">' + formatWeight(ghBobot) + '</td></tr>';
            });
            content += '</tbody></table>';
            
        } else if (type === 'varietas') {
            var grouped = {};
            tanaman.forEach(function(t) {
                var v = t.varietas || 'Unknown';
                if (!grouped[v]) grouped[v] = { tanam: 0, panen: 0, bobot: 0, brix: 0, brixCount: 0 };
                grouped[v].tanam++;
            });
            panen.forEach(function(p) {
                var t = tanaman.find(function(x) { return x.id === p.tanaman_id; });
                var v = t ? t.varietas : 'Unknown';
                if (!grouped[v]) grouped[v] = { tanam: 0, panen: 0, bobot: 0, brix: 0, brixCount: 0 };
                grouped[v].panen++;
                grouped[v].bobot += (p.bobot || 0);
                if (p.brix) { grouped[v].brix += p.brix; grouped[v].brixCount++; }
            });
            
            title = '📊 Laporan Per Varietas';
            content = '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
                '<thead><tr style="background:#f5f5f5;">' +
                '<th style="padding:12px 8px;text-align:left;">Varietas</th>' +
                '<th style="padding:12px 8px;text-align:center;">Tanam</th>' +
                '<th style="padding:12px 8px;text-align:center;">Panen</th>' +
                '<th style="padding:12px 8px;text-align:center;">Bobot</th>' +
                '<th style="padding:12px 8px;text-align:center;">Brix</th></tr></thead><tbody>';
            
            var keys = Object.keys(grouped);
            keys.forEach(function(v, i) {
                var bg = i % 2 === 0 ? '#fff' : '#fafafa';
                var g = grouped[v];
                var avgBrix = g.brixCount > 0 ? (g.brix / g.brixCount).toFixed(1) : '-';
                content += '<tr style="background:' + bg + ';">' +
                    '<td style="padding:12px 8px;border-bottom:1px solid #eee;"><strong>' + v + '</strong></td>' +
                    '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;">' + g.tanam + '</td>' +
                    '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;">' + g.panen + '</td>' +
                    '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;font-weight:600;">' + formatWeight(g.bobot) + '</td>' +
                    '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;">' + avgBrix + '%</td></tr>';
            });
            content += '</tbody></table>';
            
        } else if (type === 'keuangan') {
            var tp = panen.reduce(function(s, x) { return s + (x.harga || 0) * (x.bobot || 0) / 1000; }, 0);
            
            title = '💰 Laporan Keuangan';
            content = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">' +
                '<div style="background:#E8F5E9;padding:16px;border-radius:10px;text-align:center;">' +
                '<div style="font-size:24px;font-weight:700;color:#2E7D32;">' + panen.length + '</div>' +
                '<div style="font-size:11px;color:#666;">Transaksi</div></div>' +
                '<div style="background:#FFF3E0;padding:16px;border-radius:10px;text-align:center;">' +
                '<div style="font-size:24px;font-weight:700;color:#F57C00;">Rp ' + tp.toLocaleString('id-ID') + '</div>' +
                '<div style="font-size:11px;color:#666;">Pendapatan</div></div></div>';
            
            // Grade
            var grades = {};
            panen.forEach(function(p) { var g = p.grade || '-'; if (!grades[g]) grades[g] = 0; grades[g]++; });
            content += '<div style="font-size:13px;font-weight:600;margin-bottom:8px;">Distribusi Grade</div>';
            content += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
            var gradeColors = { A: '#2E7D32', B: '#1976D2', C: '#F57C00' };
            Object.keys(grades).forEach(function(g) {
                content += '<div style="background:' + (gradeColors[g] || '#666') + ';color:#fff;padding:10px 20px;border-radius:20px;font-size:13px;font-weight:600;">Grade ' + g + ': ' + grades[g] + '</div>';
            });
            content += '</div>';
            
        } else if (type === 'bulanan') {
            var monthly = {};
            panen.forEach(function(p) {
                var m = p.tanggal ? p.tanggal.substring(0, 7) : null;
                if (!m) return;
                if (!monthly[m]) monthly[m] = { count: 0, bobot: 0, total: 0 };
                monthly[m].count++;
                monthly[m].bobot += (p.bobot || 0);
                monthly[m].total += (p.harga || 0) * (p.bobot || 0) / 1000;
            });
            
            var months = Object.keys(monthly).sort().reverse();
            title = '📊 Laporan Bulanan';
            
            if (months.length > 0) {
                content = '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
                    '<thead><tr style="background:#f5f5f5;">' +
                    '<th style="padding:12px 8px;text-align:left;">Bulan</th>' +
                    '<th style="padding:12px 8px;text-align:center;">Panen</th>' +
                    '<th style="padding:12px 8px;text-align:center;">Bobot</th>' +
                    '<th style="padding:12px 8px;text-align:center;">Pendapatan</th></tr></thead><tbody>';
                
                var monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
                months.forEach(function(m, i) {
                    var bg = i % 2 === 0 ? '#fff' : '#fafafa';
                    var parts = m.split('-');
                    var label = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
                    var d = monthly[m];
                    content += '<tr style="background:' + bg + ';">' +
                        '<td style="padding:12px 8px;border-bottom:1px solid #eee;"><strong>' + label + '</strong></td>' +
                        '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;">' + d.count + '</td>' +
                        '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;font-weight:600;">' + formatWeight(d.bobot) + '</td>' +
                        '<td style="padding:12px 8px;text-align:center;border-bottom:1px solid #eee;font-weight:600;color:#2E7D32;">Rp ' + Math.round(d.total).toLocaleString('id-ID') + '</td></tr>';
                });
                content += '</tbody></table>';
            } else {
                content = '<div style="text-align:center;padding:30px;color:#888;">Belum ada data panen</div>';
            }
        }
        
        showModal(
            '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;">' +
            '<h3 style="margin:0;font-size:16px;">' + title + '</h3>' +
            '<button onclick="laporan.closeModal()" style="background:none;border:none;font-size:20px;color:#999;cursor:pointer;">✕</button></div>' +
            '<div style="padding:20px;">' + content + '</div>'
        );
    }

    function showModal(c) { document.getElementById('modalContent').innerHTML = c; document.getElementById('modalContainer').style.display = 'flex'; }
    function closeModal() { document.getElementById('modalContainer').style.display = 'none'; }
    function formatWeight(g) { if (!g) return '0 g'; return g >= 1000 ? (g / 1000).toFixed(1) + ' kg' : g + ' g'; }

    return { render: render, init: init, generate: generate, closeModal: closeModal };
})();