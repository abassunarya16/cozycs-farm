var Router = (function() {
    var PAGES = {
        dashboard:    { title: 'Dashboard',         icon: 'fa-chart-pie',       module: 'dashboard',    menu: true, bottom: true, order: 1 },
        greenhouse:   { title: 'Greenhouse',        icon: 'fa-warehouse',       module: 'greenhouse',   menu: true, bottom: false },
        tanaman:      { title: 'Database Tanaman',  icon: 'fa-seedling',        module: 'tanaman',      menu: true, bottom: true, order: 2 },
        polinasi:     { title: 'Polinasi',          icon: 'fa-feather',         module: 'polinasi',     menu: true, bottom: true, order: 3 },
        buah:         { title: 'Monitoring Buah',   icon: 'fa-apple-alt',       module: 'buah',         menu: true, bottom: false },
        nutrisi:      { title: 'Nutrisi',           icon: 'fa-flask',           module: 'nutrisi',      menu: true, bottom: true, order: 4 },
        pruning:      { title: 'Pruning',           icon: 'fa-cut',             module: 'pruning',      menu: true, bottom: false },
        hama:         { title: 'Hama & Penyakit',   icon: 'fa-bug',             module: 'hama',         menu: true, bottom: false },
        spray:        { title: 'Penyemprotan',      icon: 'fa-spray-can',       module: 'spray',        menu: true, bottom: false },
        jadwal:       { title: 'Jadwal Harian',     icon: 'fa-calendar-check',  module: 'jadwal',       menu: true, bottom: false },
        panen: { title: 'Panen', icon: 'fa-shopping-basket', module: 'panen', menu: true, bottom: false },
        gudang:       { title: 'Gudang',            icon: 'fa-box',             module: 'gudang',       menu: true, bottom: false },
        keuangan:     { title: 'Keuangan',          icon: 'fa-money-bill-wave', module: 'keuangan',     menu: true, bottom: false },
        laporan:      { title: 'Laporan',           icon: 'fa-file-alt',        module: 'laporan',      menu: true, bottom: false },
        setting:      { title: 'Pengaturan',        icon: 'fa-cog',             module: 'setting',      menu: false, bottom: true, order: 5 }
    };

    var currentPage = 'dashboard';
    var pageHistory = [];

    function navigate(page) {
        if (!PAGES[page]) return;
        
        if (currentPage !== page && currentPage !== '') {
            pageHistory.push(currentPage);
            window.history.pushState({ page: page }, '', '');
        }
        
        currentPage = page;
        document.title = 'Cozycs Farm 1.0 - ' + PAGES[page].title;
        
        var main = document.getElementById('mainContent');
        var mod = PAGES[page].module;
        
        if (main && window[mod] && typeof window[mod].render === 'function') {
            try {
                main.innerHTML = window[mod].render();
                if (typeof window[mod].init === 'function') {
                    setTimeout(function() { window[mod].init(); }, 100);
                }
            } catch(e) {}
        }
        
        updateSidebarActive(page);
        updateBottomNavActive(page);
        closeSidebar();
        window.scrollTo(0, 0);
    }

    function goBack() {
        if (pageHistory.length > 0) {
            var prevPage = pageHistory.pop();
            currentPage = prevPage;
            
            var main = document.getElementById('mainContent');
            var mod = PAGES[prevPage].module;
            
            if (main && window[mod] && typeof window[mod].render === 'function') {
                try {
                    main.innerHTML = window[mod].render();
                    if (typeof window[mod].init === 'function') {
                        setTimeout(function() { window[mod].init(); }, 100);
                    }
                } catch(e) {}
            }
            
            updateSidebarActive(prevPage);
            updateBottomNavActive(prevPage);
            closeSidebar();
            window.scrollTo(0, 0);
            document.title = 'Cozycs Farm 1.0 - ' + PAGES[prevPage].title;
        }
    }

    function updateSidebarActive(page) {
        var links = document.querySelectorAll('.sidebar-link');
        links.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) link.classList.add('active');
        });
    }

    function updateBottomNavActive(page) {
        var items = document.querySelectorAll('.bottom-nav-item');
        items.forEach(function(item) {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) item.classList.add('active');
        });
    }

    // ========================================
    // SIDEBAR COLLAPSIBLE
    // ========================================
    function buildSidebar() {
        var menu = document.getElementById('sidebarMenu');
        if (!menu) return;
        
        var groups = {
            '📊 UTAMA': ['dashboard'],
            '🏠 FASILITAS': ['greenhouse', 'gudang'],
            '🌱 TANAMAN': ['tanaman', 'polinasi', 'buah', 'pruning'],
            '🧪 MONITORING': ['nutrisi', 'hama', 'spray', 'jadwal'],
            '🌾 HASIL': ['panen', 'keuangan', 'laporan']
        };
        
        var html = '';
        Object.keys(groups).forEach(function(groupName) {
            html += '<div class="sidebar-group">';
            
            // Group header (bisa diklik)
            html += '<div class="sidebar-group-title" onclick="Router.toggleGroup(this)" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">';
            html += '<span>' + groupName + '</span>';
            html += '<i class="fas fa-chevron-down" style="font-size:10px;transition:transform 0.2s;"></i>';
            html += '</div>';
            
            // Group content
            html += '<div class="sidebar-group-content">';
            groups[groupName].forEach(function(key) {
                var p = PAGES[key];
                if (p && p.menu) {
                    html += '<a class="sidebar-link" data-page="' + key + '">';
                    html += '<i class="fas ' + p.icon + '"></i>';
                    html += '<span>' + p.title + '</span>';
                    html += '</a>';
                }
            });
            html += '</div>';
            
            html += '</div>';
        });
        
        menu.innerHTML = html;
        
        // Click events untuk link
        menu.querySelectorAll('.sidebar-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigate(this.getAttribute('data-page'));
            });
        });
    }

    // Toggle grup sidebar
    function toggleGroup(header) {
        var content = header.nextElementSibling;
        var icon = header.querySelector('.fa-chevron-down');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.style.transform = 'rotate(0deg)';
        } else {
            content.style.display = 'none';
            icon.style.transform = 'rotate(-90deg)';
        }
    }

        function buildBottomNav() {
        var nav = document.getElementById('bottomNav');
        if (!nav) return;
        
        var bottomPages = [
            { key: 'dashboard', icon: 'fa-chart-pie', title: 'Dashboard' },
            { key: 'tanaman', icon: 'fa-seedling', title: 'Tanaman' },
            { key: 'polinasi', icon: 'fa-feather', title: 'Polinasi' },
            { key: 'nutrisi', icon: 'fa-flask', title: 'Nutrisi' },
            { key: 'setting', icon: 'fa-cog', title: 'Pengaturan' }
        ];
        
        var html = '';
        bottomPages.forEach(function(p) {
            // PERBAIKAN: Menambahkan onclick langsung supaya anti-gagal saat disentuh
            html += '<button class="bottom-nav-item" data-page="' + p.key + '" onclick="Router.navigate(\'' + p.key + '\')">';
            html += '<i class="fas ' + p.icon + '"></i>';
            html += '<span>' + p.title + '</span>';
            html += '</button>';
        });
        
        nav.innerHTML = html;
        
        // Memastikan event listener tetap terpasang dengan aman
        nav.querySelectorAll('.bottom-nav-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                var targetPage = this.getAttribute('data-page');
                navigate(targetPage);
            });
        });
    }


    function toggleSidebar() {
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.add('open');
        if (overlay) overlay.classList.add('show');
    }

    function closeSidebar() {
        var sidebar = document.getElementById('sidebar');
        var overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }

    function getCurrentPage() { return currentPage; }

    function init() {
        buildSidebar();
        buildBottomNav();
        
        document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
        document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
        document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);
        
        document.getElementById('btnNotification').addEventListener('click', function() {
            if (Notification && Notification.showNotificationPanel) Notification.showNotificationPanel();
        });
        
        document.getElementById('btnSettings').addEventListener('click', function(e) {
            e.preventDefault(); navigate('setting');
        });
        
        document.getElementById('btnBackupRestore').addEventListener('click', function(e) {
            e.preventDefault(); navigate('setting');
        });
        
        window.addEventListener('popstate', function() {
            if (pageHistory.length > 0) goBack();
        });
        
        window.history.pushState({ page: 'dashboard' }, '', '');
        navigate('dashboard');
    }

    return {
        PAGES: PAGES,
        navigate: navigate,
        goBack: goBack,
        getCurrentPage: getCurrentPage,
        toggleSidebar: toggleSidebar,
        closeSidebar: closeSidebar,
        toggleGroup: toggleGroup,
        init: init
    };

})();
