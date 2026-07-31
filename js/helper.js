/**
 * Cozycs Farm V2 - Helper Module
 * Common utility functions used across all modules
 */

const Helper = (() => {
    /**
     * Generate unique ID
     */
    function generateId(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
    }

    /**
     * Generate Tanaman ID (GH01-T03-L15 format)
     */
    function generateTanamanId(greenhouseCode, talangNumber, lubangNumber) {
        const gh = greenhouseCode.toUpperCase().padStart(4, '0').slice(-4);
        const t = String(talangNumber).padStart(2, '0');
        const l = String(lubangNumber).padStart(2, '0');
        return `${gh}-T${t}-L${l}`;
    }

    /**
     * Get today's date as YYYY-MM-DD
     */
    function today() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Get current datetime as ISO string
     */
    function now() {
        return new Date().toISOString();
    }

    /**
     * Format date to Indonesian locale
     */
    function formatDate(dateString, format = 'full') {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        
        const monthShort = [
            'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
        ];
        
        switch (format) {
            case 'short':
                return `${day} ${monthShort[month]} ${year}`;
            case 'numeric':
                return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
            case 'full':
            default:
                return `${day} ${monthNames[month]} ${year}`;
        }
    }

    /**
     * Format datetime
     */
    function formatDateTime(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        const formattedDate = formatDate(dateString, 'numeric');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${formattedDate} ${hours}:${minutes}`;
    }

    /**
     * Format time only
     */
    function formatTime(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${hours}:${minutes}`;
    }

    /**
     * Calculate days between two dates
     */
    function daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = date2 ? new Date(date2) : new Date();
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calculate HST (Hari Setelah Tanam)
     */
    function calculateHST(tanggalTanam) {
        if (!tanggalTanam) return 0;
        return daysBetween(tanggalTanam, today());
    }

    /**
     * Calculate HSP (Hari Setelah Polinasi)
     */
    function calculateHSP(tanggalPolinasi) {
        if (!tanggalPolinasi) return 0;
        return daysBetween(tanggalPolinasi, today());
    }

    /**
     * Format number with thousand separator
     */
    function formatNumber(number, decimals = 0) {
        if (number === null || number === undefined) return '0';
        return Number(number).toLocaleString('id-ID', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    /**
     * Format currency (Rupiah)
     */
    function formatCurrency(amount) {
        if (!amount && amount !== 0) return 'Rp 0';
        return 'Rp ' + formatNumber(amount, 0);
    }

    /**
     * Format weight (gram to kg if > 1000)
     */
    function formatWeight(grams) {
        if (!grams && grams !== 0) return '0 g';
        if (grams >= 1000) {
            return (grams / 1000).toFixed(2) + ' kg';
        }
        return grams + ' g';
    }

    /**
     * Format percentage
     */
    function formatPercent(value, total) {
        if (!total || total === 0) return '0%';
        return ((value / total) * 100).toFixed(1) + '%';
    }

    /**
     * Truncate text with ellipsis
     */
    function truncate(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Debounce function for search inputs
     */
    function debounce(func, delay = 300) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle function
     */
    function throttle(func, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Sanitize string for safe usage
     */
    function sanitize(text) {
        if (!text) return '';
        return String(text)
            .replace(/[<>]/g, '')
            .trim();
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /**
     * Validate phone number (Indonesian format)
     */
    function isValidPhone(phone) {
        return /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone.replace(/[\s-]/g, ''));
    }

    /**
     * Generate QR code data for tanaman
     */
    function generateQRData(tanamanId) {
        return JSON.stringify({
            type: 'tanaman',
            id: tanamanId,
            app: 'Cozycs Farm V2',
            timestamp: now()
        });
    }

    /**
     * Parse QR code data
     */
    function parseQRData(qrString) {
        try {
            return JSON.parse(qrString);
        } catch {
            return { type: 'unknown', raw: qrString };
        }
    }

    /**
     * Group array by key
     */
    function groupBy(array, key) {
        return array.reduce((result, item) => {
            const groupKey = item[key];
            if (!result[groupKey]) {
                result[groupKey] = [];
            }
            result[groupKey].push(item);
            return result;
        }, {});
    }

    /**
     * Sort array by key
     */
    function sortBy(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            
            // Handle dates
            if (typeof valA === 'string' && valA.match(/^\d{4}-\d{2}-\d{2}/)) {
                valA = new Date(valA);
                valB = new Date(valB);
            }
            
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * Deep clone object
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Check if object is empty
     */
    function isEmpty(obj) {
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object' && obj !== null) {
            return Object.keys(obj).length === 0;
        }
        return !obj;
    }

    /**
     * Get unique values from array
     */
    function unique(array) {
        return [...new Set(array)];
    }

    /**
     * Convert file to base64
     */
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Compress image before storing
     */
    function compressImage(base64String, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = base64String;
        });
    }

    /**
     * Get status color class
     */
    function getStatusClass(status) {
        const statusMap = {
            'aktif': 'active',
            'hidup': 'active',
            'sehat': 'active',
            'mati': 'danger',
            'sakit': 'warning',
            'panen': 'active',
            'sudah polinasi': 'active',
            'belum polinasi': 'warning',
            'fix buah': 'active',
            'gagal': 'danger',
            'selesai': 'active',
            'pending': 'warning',
            'progress': 'info'
        };
        
        return statusMap[status?.toLowerCase()] || 'inactive';
    }

    /**
     * Show confirmation dialog
     */
    function confirmDialog(message) {
        return new Promise((resolve) => {
            const result = window.confirm(message);
            resolve(result);
        });
    }

    /**
     * Copy text to clipboard
     */
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        }
    }

    /**
     * Download file
     */
    function downloadFile(content, filename, contentType = 'application/json') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Parse CSV content
     */
    function parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            result.push(obj);
        }
        
        return result;
    }

    /**
     * Convert data to CSV
     */
    function toCSV(data, headers) {
        const headerRow = headers.join(',');
        const rows = data.map(item => {
            return headers.map(header => {
                let value = item[header] || '';
                // Escape quotes and wrap in quotes if contains comma
                if (String(value).includes(',') || String(value).includes('"')) {
                    value = '"' + String(value).replace(/"/g, '""') + '"';
                }
                return value;
            }).join(',');
        });
        
        return [headerRow, ...rows].join('\n');
    }

    /**
     * Add ordinal suffix (Indonesian)
     */
    function ordinalNumber(num) {
        return `ke-${num}`;
    }

    /**
     * Get week number
     */
    function getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    }

    /**
     * Get array of last N days
     */
    function getLastNDays(n) {
        const dates = [];
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }

    /**
     * Get current season based on month (Indonesia)
     */
    function getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 10 || month <= 3) return 'Hujan';
        return 'Kemarau';
    }

    /**
     * Get greeting based on time
     */
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    }

    // --- Public API ---
    return {
        generateId,
        generateTanamanId,
        today,
        now,
        formatDate,
        formatDateTime,
        formatTime,
        daysBetween,
        calculateHST,
        calculateHSP,
        formatNumber,
        formatCurrency,
        formatWeight,
        formatPercent,
        truncate,
        debounce,
        throttle,
        escapeHtml,
        sanitize,
        isValidEmail,
        isValidPhone,
        generateQRData,
        parseQRData,
        groupBy,
        sortBy,
        deepClone,
        isEmpty,
        unique,
        fileToBase64,
        compressImage,
        getStatusClass,
        confirmDialog,
        copyToClipboard,
        downloadFile,
        parseCSV,
        toCSV,
        ordinalNumber,
        getWeekNumber,
        getLastNDays,
        getCurrentSeason,
        getGreeting
    };
})();