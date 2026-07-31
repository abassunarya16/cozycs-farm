/**
 * Cozycs Farm V2 - Storage Module
 * Handles all data persistence using LocalStorage
 * Designed for easy migration to Firebase/Supabase/MySQL
 */

const Storage = (() => {
    // Storage keys
    const KEYS = {
        GREENHOUSE: 'cozycs_greenhouse',
        TANAMAN: 'cozycs_tanaman',
        POLINASI: 'cozycs_polinasi',
        BUAH: 'cozycs_buah',
        NUTRISI: 'cozycs_nutrisi',
        PRUNING: 'cozycs_pruning',
        HAMA: 'cozycs_hama',
        SPRAY: 'cozycs_spray',
        JADWAL: 'cozycs_jadwal',
        PANEN: 'cozycs_panen',
        GUDANG: 'cozycs_gudang',
        KEUANGAN: 'cozycs_keuangan',
        SETTINGS: 'cozycs_settings',
        BACKUP_META: 'cozycs_backup_meta'
    };

    const DEFAULT_SETTINGS = {
        farmName: 'Cozycs Farm',
        farmAddress: '',
        ownerName: '',
        phone: '',
        language: 'id',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light',
        autoBackup: true,
        backupInterval: 7,
        storageWarning: 80,
        lastBackup: null,
        version: '2.0.0'
    };

    // ========================================
    // PRIVATE FUNCTIONS
    // ========================================

    function generateId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${random}`;
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function saveCollection(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`[Storage] Error saving ${key}:`, error);
            if (error.name === 'QuotaExceededError') {
                throw new Error('Penyimpanan penuh!');
            }
            throw error;
        }
    }

    function getCollection(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`[Storage] Error reading ${key}:`, error);
            return [];
        }
    }

    // ========================================
    // CRUD FUNCTIONS
    // ========================================

    function getAll(collection) {
        return getCollection(collection);
    }

    function getById(collection, id) {
        return getCollection(collection).find(r => r.id === id) || null;
    }

    function query(collection, filterFn) {
        const records = getCollection(collection);
        return typeof filterFn === 'function' ? records.filter(filterFn) : records;
    }

    function create(collection, data) {
        const records = getCollection(collection);
        if (!data.id) data.id = generateId();
        const now = new Date().toISOString();
        data.createdAt = data.createdAt || now;
        data.updatedAt = now;
        records.push(data);
        saveCollection(collection, records);
        return data;
    }

    function update(collection, id, updates) {
        const records = getCollection(collection);
        const index = records.findIndex(r => r.id === id);
        if (index === -1) return null;
        records[index] = { ...records[index], ...updates, id, updatedAt: new Date().toISOString() };
        saveCollection(collection, records);
        return records[index];
    }

    function remove(collection, id) {
        const records = getCollection(collection).filter(r => r.id !== id);
        saveCollection(collection, records);
        return true;
    }

    function removeMany(collection, filterFn) {
        const records = getCollection(collection);
        const toKeep = records.filter(r => !filterFn(r));
        saveCollection(collection, toKeep);
        return records.length - toKeep.length;
    }

    function bulkCreate(collection, dataArray) {
        const records = getCollection(collection);
        const now = new Date().toISOString();
        dataArray.forEach(d => {
            d.id = d.id || generateId();
            d.createdAt = d.createdAt || now;
            d.updatedAt = now;
            records.push(d);
        });
        saveCollection(collection, records);
        return dataArray.length;
    }

    function count(collection, filterFn) {
        return filterFn ? query(collection, filterFn).length : getCollection(collection).length;
    }

    function exists(collection, id) {
        return getById(collection, id) !== null;
    }

    // ========================================
    // SETTINGS
    // ========================================

    function getSettings() {
        return getCollection(KEYS.SETTINGS)[0] || DEFAULT_SETTINGS;
    }

    function updateSettings(updates) {
        const current = getSettings();
        const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
        saveCollection(KEYS.SETTINGS, [updated]);
        return updated;
    }

    // ========================================
    // BACKUP & RESTORE
    // ========================================

    function exportAll() {
        const data = {};
        Object.entries(KEYS).forEach(([k, sk]) => {
            if (sk === KEYS.BACKUP_META) return;
            data[k.toLowerCase()] = getCollection(sk);
        });
        data.settings = getSettings();
        data.exportDate = new Date().toISOString();
        data.version = '2.0.0';
        return data;
    }

    function importAll(data) {
        if (!data || !data.version) throw new Error('Invalid format');
        const map = {
            greenhouse: KEYS.GREENHOUSE, tanaman: KEYS.TANAMAN,
            polinasi: KEYS.POLINASI, buah: KEYS.BUAH,
            nutrisi: KEYS.NUTRISI, pruning: KEYS.PRUNING,
            hama: KEYS.HAMA, spray: KEYS.SPRAY,
            jadwal: KEYS.JADWAL, panen: KEYS.PANEN,
            gudang: KEYS.GUDANG, keuangan: KEYS.KEUANGAN
        };
        let count = 0;
        Object.entries(map).forEach(([dk, sk]) => {
            if (data[dk] && Array.isArray(data[dk])) {
                saveCollection(sk, data[dk]);
                count += data[dk].length;
            }
        });
        if (data.settings) saveCollection(KEYS.SETTINGS, [data.settings]);
        return count;
    }

    function clearAll() {
        Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }

    function getStorageInfo() {
        let total = 0;
        Object.values(KEYS).forEach(k => {
            const d = localStorage.getItem(k);
            if (d) total += new Blob([d]).size;
        });
        return {
            totalSize: total,
            totalSizeFormatted: formatBytes(total),
            usagePercentage: Math.round((total / (5 * 1024 * 1024)) * 100)
        };
    }

    function createBackup() {
        const backup = exportAll();
        const key = `cozycs_backup_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify(backup));
        return key;
    }

    function getBackupList() {
        const list = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('cozycs_backup_')) {
                try {
                    const d = JSON.parse(localStorage.getItem(k));
                    list.push({ key: k, date: d.exportDate, size: new Blob([localStorage.getItem(k)]).size });
                } catch (e) {}
            }
        }
        return list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function restoreBackup(key) {
        const d = localStorage.getItem(key);
        if (!d) throw new Error('Not found');
        return importAll(JSON.parse(d));
    }

    function deleteBackup(key) {
        localStorage.removeItem(key);
    }

    // ========================================
    // SEED DATA (HARDCODED - NO FETCH)
    // ========================================

    function updateAllHST() {
        const tanaman = getCollection(KEYS.TANAMAN);
        const today = new Date().toISOString().split('T')[0];
        let updated = 0;
        tanaman.forEach(t => {
            if (t.tanggal_tanam) {
                const hst = Math.ceil((new Date(today) - new Date(t.tanggal_tanam)) / 86400000);
                if (t.hst !== hst) { t.hst = hst; updated++; }
            }
        });
        if (updated > 0) saveCollection(KEYS.TANAMAN, tanaman);
        return updated;
    }

    function loadSeedData() {
        // Cek apakah sudah ada data
        if (getCollection(KEYS.GREENHOUSE).length > 0) {
            console.log('[Seed] Data sudah ada, skip');
            return 0;
        }

        console.log('[Seed] Memuat data awal...');
        const now = new Date().toISOString();
        let loaded = 0;

        // Greenhouse
        const gh = [
            { id: 'gh-001', kode: 'GH01', nama: 'Greenhouse Utara', kapasitas: 200, jumlah_talang: 20, lokasi: 'Blok Utara', status: 'aktif', catatan: 'GH utama Rock Melon' },
            { id: 'gh-002', kode: 'GH02', nama: 'Greenhouse Selatan', kapasitas: 150, jumlah_talang: 15, lokasi: 'Blok Selatan', status: 'aktif', catatan: 'GH Golden Melon' },
            { id: 'gh-003', kode: 'GH03', nama: 'Greenhouse Timur', kapasitas: 180, jumlah_talang: 18, lokasi: 'Blok Timur', status: 'aktif', catatan: 'GH campuran' }
        ];
        gh.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.GREENHOUSE, gh);
        loaded += gh.length;

        // Tanaman
        const tn = [
            { id: 'GH01-T01-L01', greenhouse_id: 'gh-001', greenhouse_code: 'GH01', talang: 1, lubang: 1, varietas: 'Rock Melon', tanggal_semai: '2026-06-25', tanggal_tanam: '2026-07-01', hst: 0, hsp: 0, status_tanaman: 'aktif', status_polinasi: 'belum polinasi', status_buah: 'belum', status_panen: 'belum panen', catatan: 'Kondisi awal baik', foto: '' },
            { id: 'GH01-T01-L02', greenhouse_id: 'gh-001', greenhouse_code: 'GH01', talang: 1, lubang: 2, varietas: 'Rock Melon', tanggal_semai: '2026-06-25', tanggal_tanam: '2026-07-01', hst: 0, hsp: 0, status_tanaman: 'aktif', status_polinasi: 'sudah polinasi', status_buah: 'fix buah', status_panen: 'belum panen', catatan: 'Perkembangan bagus', foto: '' },
            { id: 'GH01-T02-L05', greenhouse_id: 'gh-001', greenhouse_code: 'GH01', talang: 2, lubang: 5, varietas: 'Rock Melon', tanggal_semai: '2026-06-20', tanggal_tanam: '2026-06-26', hst: 0, hsp: 0, status_tanaman: 'sehat', status_polinasi: 'sudah polinasi', status_buah: 'fix buah', status_panen: 'siap panen', catatan: 'Mendekati panen', foto: '' },
            { id: 'GH02-T01-L01', greenhouse_id: 'gh-002', greenhouse_code: 'GH02', talang: 1, lubang: 1, varietas: 'Golden Melon', tanggal_semai: '2026-06-28', tanggal_tanam: '2026-07-04', hst: 0, hsp: 0, status_tanaman: 'aktif', status_polinasi: 'belum polinasi', status_buah: 'belum', status_panen: 'belum panen', catatan: '', foto: '' },
            { id: 'GH02-T01-L02', greenhouse_id: 'gh-002', greenhouse_code: 'GH02', talang: 1, lubang: 2, varietas: 'Golden Melon', tanggal_semai: '2026-06-28', tanggal_tanam: '2026-07-04', hst: 0, hsp: 0, status_tanaman: 'sakit', status_polinasi: 'belum polinasi', status_buah: 'belum', status_panen: 'belum panen', catatan: 'Daun menguning', foto: '' },
            { id: 'GH02-T02-L03', greenhouse_id: 'gh-002', greenhouse_code: 'GH02', talang: 2, lubang: 3, varietas: 'Golden Melon', tanggal_semai: '2026-06-15', tanggal_tanam: '2026-06-21', hst: 0, hsp: 0, status_tanaman: 'aktif', status_polinasi: 'sudah polinasi', status_buah: 'fix buah', status_panen: 'panen', catatan: 'Sudah dipanen', foto: '' },
            { id: 'GH03-T01-L01', greenhouse_id: 'gh-003', greenhouse_code: 'GH03', talang: 1, lubang: 1, varietas: 'Rock Melon', tanggal_semai: '2026-06-30', tanggal_tanam: '2026-07-06', hst: 0, hsp: 0, status_tanaman: 'aktif', status_polinasi: 'belum polinasi', status_buah: 'belum', status_panen: 'belum panen', catatan: 'Baru tanam', foto: '' }
        ];
        tn.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.TANAMAN, tn);
        loaded += tn.length;

        // Polinasi
        const pl = [
            { id: 'pol-001', tanaman_id: 'GH01-T01-L02', tanggal: '2026-07-20', jam: '07:30', ruas: '12-14', bunga: 'betina', operator: 'Andi', status: 'berhasil', catatan: '' },
            { id: 'pol-002', tanaman_id: 'GH01-T02-L05', tanggal: '2026-07-10', jam: '08:00', ruas: '11-13', bunga: 'hermafrodit', operator: 'Budi', status: 'berhasil', catatan: '' },
            { id: 'pol-003', tanaman_id: 'GH02-T02-L03', tanggal: '2026-07-05', jam: '07:30', ruas: '12-14', bunga: 'betina', operator: 'Andi', status: 'berhasil', catatan: '' }
        ];
        pl.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.POLINASI, pl);
        loaded += pl.length;

        // Buah
        const bh = [
            { id: 'buah-001', tanaman_id: 'GH01-T01-L02', tanggal: '2026-07-25', diameter: 45, keliling: 141, estimasi_bobot: 400, warna: 'Hijau muda', net: 'halus', retak: 'tidak', fix_buah: 'fix buah', hsp: 5, catatan: '' },
            { id: 'buah-002', tanaman_id: 'GH01-T02-L05', tanggal: '2026-07-20', diameter: 100, keliling: 314, estimasi_bobot: 1500, warna: 'Hijau kekuningan', net: 'kasar', retak: 'tidak', fix_buah: 'fix buah', hsp: 10, catatan: 'Mendekati panen' }
        ];
        bh.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.BUAH, bh);
        loaded += bh.length;

        // Nutrisi
        const nt = [
            { id: 'nut-001', tanggal: '2026-07-28', greenhouse_id: 'gh-001', ppm_pagi: 1200, ppm_sore: 1180, ph_pagi: 6.2, ph_sore: 6.4, volume_air: 200, suhu_air: 26.5, operator: 'Andi', catatan: 'Stabil' },
            { id: 'nut-002', tanggal: '2026-07-27', greenhouse_id: 'gh-001', ppm_pagi: 1250, ppm_sore: 1220, ph_pagi: 6.0, ph_sore: 6.1, volume_air: 190, suhu_air: 26, operator: 'Andi', catatan: '' },
            { id: 'nut-003', tanggal: '2026-07-28', greenhouse_id: 'gh-002', ppm_pagi: 1100, ppm_sore: 1080, ph_pagi: 6.3, ph_sore: 6.5, volume_air: 180, suhu_air: 26.2, operator: 'Budi', catatan: 'GH02 normal' }
        ];
        nt.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.NUTRISI, nt);
        loaded += nt.length;

        // Panen
        const pn = [
            { id: 'panen-001', tanaman_id: 'GH02-T02-L03', tanggal: '2026-07-27', jam: '08:00', bobot: 1580, brix: 14.5, grade: 'A', harga: 35000, pembeli: 'Toko Buah Segar', operator: 'Andi', catatan: 'Golden Melon premium' }
        ];
        pn.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.PANEN, pn);
        loaded += pn.length;

        // Hama
        const hm = [
            { id: 'hama-001', tanaman_id: 'GH02-T01-L02', tanggal: '2026-07-26', jenis: 'Kutu Daun', tingkat: 'Sedang', penanganan: 'Semprot insektisida nabati', catatan: '' }
        ];
        hm.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.HAMA, hm);
        loaded += hm.length;

        // Gudang
        const gd = [
            { id: 'gdg-001', tanaman_id: 'GH02-T02-L03', varietas: 'Golden Melon', tanggal_masuk: '2026-07-27', bobot: 1580, grade: 'A', brix: 14.5, harga_per_kg: 35000, pembeli: 'Toko Buah Segar', status: 'terjual', catatan: 'Dari panen' }
        ];
        gd.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.GUDANG, gd);
        loaded += gd.length;

        // Spray
        const sp = [
            { id: 'spray-001', tanggal: '2026-07-26', jenis_semprot: 'Insektisida', dosis: '5 ml/L', target: 'Kutu Daun', operator: 'Budi', catatan: '' }
        ];
        sp.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.SPRAY, sp);
        loaded += sp.length;

        // Pruning
        const pr = [
            { id: 'prun-001', tanaman_id: 'GH01-T01-L02', tanggal: '2026-07-22', jenis_pruning: 'Pucuk', operator: 'Andi', catatan: '' }
        ];
        pr.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.PRUNING, pr);
        loaded += pr.length;

        // Jadwal
        const jd = [
            { id: 'jdwl-001', tanggal: '2026-07-28', cek_ppm_pagi: true, cek_ph_pagi: true, polinasi: false, seleksi_buah: true, pruning: false, penyemprotan: true, cek_akar: true, cek_hama: true }
        ];
        jd.forEach(d => { d.createdAt = now; d.updatedAt = now; });
        bulkCreate(KEYS.JADWAL, jd);
        loaded += jd.length;

        // Update HST
        updateAllHST();

        console.log(`[Seed] Total ${loaded} data awal dimuat!`);
        return loaded;
    }

    // ========================================
    // INIT
    // ========================================

    function init() {
        Object.values(KEYS).forEach(key => {
            if (key === KEYS.BACKUP_META) return;
            if (!localStorage.getItem(key)) saveCollection(key, []);
        });

        if (!localStorage.getItem(KEYS.SETTINGS)) {
            saveCollection(KEYS.SETTINGS, [{ ...DEFAULT_SETTINGS }]);
        }

        if (!localStorage.getItem(KEYS.BACKUP_META)) {
            saveCollection(KEYS.BACKUP_META, [{ lastBackup: null, totalBackups: 0, backupHistory: [] }]);
        }

        // Load seed data
        loadSeedData();

        console.log('[Storage] Initialized successfully');
        return true;
    }

    // ========================================
    // PUBLIC API
    // ========================================

    return {
        KEYS,
        init,
        getAll,
        getById,
        query,
        create,
        update,
        remove,
        removeMany,
        bulkCreate,
        count,
        exists,
        getSettings,
        updateSettings,
        exportAll,
        importAll,
        clearAll,
        getStorageInfo,
        createBackup,
        getBackupList,
        restoreBackup,
        deleteBackup,
        loadSeedData,
        updateAllHST
    };
})();