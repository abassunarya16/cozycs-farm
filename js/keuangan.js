var keuangan = (function() {

    function render() {
        var panen = Storage.getAll(Storage.KEYS.PANEN);
        var totalPendapatan = 0;
        var totalBobot = 0;

        panen.forEach(function(item) {
            totalPendapatan += ((item.harga || 0) * (item.bobot || 0) / 1000);
            totalBobot += (item.bobot || 0);
        });

        var html = '<div class="module-container">';
        
        // Header
        html += '<div class="page-title"><h2><i class="fas fa-money-bill-wave"></i> Keuangan</h2></div>';
        
        // Summary Cards
        html += '<div class="stats-grid">';
        html += makeStatCard('Pendapatan', 'fa-wallet', '#E8F5E9', '#2E7D32', 'Rp ' + totalPendapatan.toLocaleString('id-ID'));
        html += makeStatCard('Total Bobot', 'fa-weight-hanging', '#FFF3E0', '#F57C00', formatWeight(totalBobot));
        html += makeStatCard('Transaksi', 'fa-receipt', '#E3F2FD', '#1976D2', panen.length);
        html += makeStatCard('Rata-rata', 'fa-chart-line', '#FCE4EC', '#D32F2F', panen.length ? 'Rp ' + Math.round(totalPendapatan / panen.length).toLocaleString('id-ID') : 'Rp 0');
        html += '</div>';
        
        // Transaction History
        html += '<div class="card">';
        html += '<div class="card-header"><h3 class="card-title"><i class="fas fa-history"></i> Riwayat Penjualan</h3></div>';
        html += '<div class="card-body">';

        if (panen.length === 0) {
            html += '<div class="empty-state"><i class="fas fa-box-open"></i><h3>Belum ada transaksi</h3></div>';
        } else {
            var list = panen.slice().sort(function(a, b) {
                return new Date(b.tanggal) - new Date(a.tanggal);
            });

            list.forEach(function(item) {
                var subtotal = ((item.harga || 0) * (item.bobot || 0) / 1000);
                
                html += '<div style="background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:14px;margin-bottom:10px;">';
                
                // Header
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
                html += '<strong><i class="fas fa-seedling" style="color:#2E7D32;"></i> ' + (item.tanaman_id || '-') + '</strong>';
                html += '<span class="status-badge ' + (item.grade === 'A' ? 'active' : 'info') + '">Grade ' + (item.grade || '-') + '</span>';
                html += '</div>';
                
                // Details
                html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:13px;">';
                html += '<div><span style="color:#888;">Tanggal</span></div><div style="text-align:right;">' + formatDate(item.tanggal) + '</div>';
                html += '<div><span style="color:#888;">Bobot</span></div><div style="text-align:right;">' + formatWeight(item.bobot) + '</div>';
                html += '<div><span style="color:#888;">Harga/kg</span></div><div style="text-align:right;">Rp ' + (item.harga || 0).toLocaleString('id-ID') + '</div>';
                html += '<div><span style="color:#888;">Pembeli</span></div><div style="text-align:right;">' + (item.pembeli || '-') + '</div>';
                html += '</div>';
                
                // Total
                html += '<div style="border-top:1px solid #eee;margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;align-items:center;">';
                html += '<strong>Total</strong>';
                html += '<strong style="color:#2E7D32;font-size:16px;">Rp ' + subtotal.toLocaleString('id-ID') + '</strong>';
                html += '</div>';
                
                html += '</div>';
            });
        }

        html += '</div></div>';
        html += '</div>';
        
        return html;
    }

    function init() {}

    function makeStatCard(label, icon, bg, color, value) {
        return '<div class="stat-card">' +
            '<div class="stat-icon" style="background:' + bg + '"><i class="fas ' + icon + '" style="color:' + color + '"></i></div>' +
            '<div class="stat-info"><span class="stat-value">' + value + '</span><span class="stat-label">' + label + '</span></div>' +
            '</div>';
    }

    function formatWeight(g) {
        g = Number(g) || 0;
        if (g >= 1000) return (g / 1000).toFixed(1) + ' kg';
        return g + ' g';
    }

    function formatDate(d) {
        if (!d) return '-';
        var dt = new Date(d);
        return ('0' + dt.getDate()).slice(-2) + '/' + ('0' + (dt.getMonth() + 1)).slice(-2) + '/' + dt.getFullYear();
    }

    return { render: render, init: init };

})();