/**
 * Cozycs Farm V2 - Chart Module
 * Simple canvas-based charts without external dependencies
 */

const Chart = (() => {
    /**
     * Create a line chart
     */
    function createLineChart(canvasId, labels, datasets, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width || canvas.offsetWidth;
        const height = canvas.height || canvas.offsetHeight;
        
        // Set canvas size
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(2, 2);
        
        const padding = options.padding || { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // Find min/max values
        let allValues = [];
        datasets.forEach(ds => allValues = allValues.concat(ds.data));
        const minValue = options.minY !== undefined ? options.minY : Math.min(...allValues, 0);
        const maxValue = options.maxY !== undefined ? options.maxY : Math.max(...allValues) * 1.1;
        const valueRange = maxValue - minValue || 1;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines
        const gridLines = 5;
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 4]);
        
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
            
            // Y-axis labels
            const value = maxValue - (valueRange / gridLines) * i;
            ctx.fillStyle = '#757575';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(value), padding.left - 8, y + 4);
        }
        ctx.setLineDash([]);
        
        // Draw X-axis labels
        const xStep = chartWidth / (labels.length - 1 || 1);
        ctx.fillStyle = '#757575';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        
        labels.forEach((label, i) => {
            const x = padding.left + xStep * i;
            ctx.fillText(label, x, padding.top + chartHeight + 20);
        });
        
        // Draw datasets
        datasets.forEach((dataset, dsIndex) => {
            const color = dataset.color || getDefaultColor(dsIndex);
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            dataset.data.forEach((value, i) => {
                const x = padding.left + xStep * i;
                const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Draw dots
            dataset.data.forEach((value, i) => {
                const x = padding.left + xStep * i;
                const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        });
        
        // Draw legend
        if (datasets.length > 1 && options.showLegend !== false) {
            let legendY = padding.top - 12;
            datasets.forEach((dataset, i) => {
                const color = dataset.color || getDefaultColor(i);
                ctx.fillStyle = color;
                ctx.fillRect(padding.left + i * 120, legendY, 12, 12);
                ctx.fillStyle = '#424242';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(dataset.label || `Data ${i + 1}`, padding.left + i * 120 + 16, legendY + 10);
            });
        }
    }

    /**
     * Create a bar chart
     */
    function createBarChart(canvasId, labels, datasets, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width || canvas.offsetWidth;
        const height = canvas.height || canvas.offsetHeight;
        
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(2, 2);
        
        const padding = options.padding || { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        // Find max value
        let allValues = [];
        datasets.forEach(ds => allValues = allValues.concat(ds.data));
        const maxValue = options.maxY || Math.max(...allValues) * 1.1;
        
        // Grid lines
        const gridLines = 5;
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 4]);
        
        for (let i = 0; i <= gridLines; i++) {
            const y = padding.top + (chartHeight / gridLines) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
            
            const value = maxValue - (maxValue / gridLines) * i;
            ctx.fillStyle = '#757575';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(value), padding.left - 8, y + 4);
        }
        ctx.setLineDash([]);
        
        // Calculate bar positions
        const totalBars = datasets.length;
        const groupWidth = chartWidth / labels.length;
        const barWidth = (groupWidth * 0.7) / totalBars;
        const groupPadding = groupWidth * 0.15;
        
        // Draw bars
        datasets.forEach((dataset, dsIndex) => {
            const color = dataset.color || getDefaultColor(dsIndex);
            
            dataset.data.forEach((value, i) => {
                const x = padding.left + groupWidth * i + groupPadding + barWidth * dsIndex;
                const barHeight = (value / maxValue) * chartHeight;
                const y = padding.top + chartHeight - barHeight;
                
                ctx.fillStyle = color;
                ctx.fillRect(x, y, barWidth, barHeight);
                
                // Bar border
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, barWidth, barHeight);
            });
        });
        
        // X-axis labels
        ctx.fillStyle = '#757575';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        
        labels.forEach((label, i) => {
            const x = padding.left + groupWidth * i + groupWidth / 2;
            ctx.fillText(label, x, padding.top + chartHeight + 20);
        });
    }

    /**
     * Create a doughnut chart
     */
    function createDoughnutChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width || canvas.offsetWidth;
        const height = canvas.height || canvas.offsetHeight;
        
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(2, 2);
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        const innerRadius = radius * 0.6;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        if (total === 0) {
            ctx.fillStyle = '#757575';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Tidak ada data', centerX, centerY);
            return;
        }
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach((item, i) => {
            const sliceAngle = (item.value / total) * Math.PI * 2;
            const color = item.color || getDefaultColor(i);
            
            // Draw slice
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            currentAngle += sliceAngle;
        });
        
        // Center text
        ctx.fillStyle = '#424242';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(total, centerX, centerY - 5);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#757575';
        ctx.fillText('Total', centerX, centerY + 12);
        
        // Legend
        if (options.showLegend !== false) {
            let legendY = height - 15;
            data.forEach((item, i) => {
                const x = 10 + (i % 3) * (width / 3);
                const y = legendY + Math.floor(i / 3) * 18;
                
                ctx.fillStyle = item.color || getDefaultColor(i);
                ctx.fillRect(x, y - 6, 10, 10);
                ctx.fillStyle = '#424242';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`${item.label} (${Math.round((item.value/total)*100)}%)`, x + 14, y + 2);
            });
        }
    }

    /**
     * Get default color for chart
     */
    function getDefaultColor(index) {
        const colors = [
            '#2E7D32', '#1976D2', '#F57C00', '#D32F2F', '#7B1FA2',
            '#00838F', '#E64A19', '#5D4037', '#455A64', '#C2185B',
            '#388E3C', '#1565C0', '#EF6C00', '#C62828', '#6A1B9A'
        ];
        return colors[index % colors.length];
    }

    /**
     * Format chart data for nutrisi (PPM/pH trends)
     */
    function formatNutrisiChartData(nutrisiData, days = 14) {
        const lastDays = Helper.getLastNDays(days);
        const ppmPagi = [];
        const ppmSore = [];
        const phPagi = [];
        const phSore = [];
        
        lastDays.forEach(day => {
            const dayData = nutrisiData.filter(n => n.tanggal === day);
            
            if (dayData.length > 0) {
                const avgPpmPagi = dayData.reduce((sum, d) => sum + (parseFloat(d.ppm_pagi) || 0), 0) / dayData.length;
                const avgPpmSore = dayData.reduce((sum, d) => sum + (parseFloat(d.ppm_sore) || 0), 0) / dayData.length;
                const avgPhPagi = dayData.reduce((sum, d) => sum + (parseFloat(d.ph_pagi) || 0), 0) / dayData.length;
                const avgPhSore = dayData.reduce((sum, d) => sum + (parseFloat(d.ph_sore) || 0), 0) / dayData.length;
                
                ppmPagi.push(Math.round(avgPpmPagi));
                ppmSore.push(Math.round(avgPpmSore));
                phPagi.push(Math.round(avgPhPagi * 10) / 10);
                phSore.push(Math.round(avgPhSore * 10) / 10);
            } else {
                ppmPagi.push(null);
                ppmSore.push(null);
                phPagi.push(null);
                phSore.push(null);
            }
        });
        
        return {
            labels: lastDays.map(d => {
                const date = new Date(d);
                return `${date.getDate()}/${date.getMonth() + 1}`;
            }),
            ppm: [
                { label: 'PPM Pagi', data: ppmPagi, color: '#2E7D32' },
                { label: 'PPM Sore', data: ppmSore, color: '#1976D2' }
            ],
            ph: [
                { label: 'pH Pagi', data: phPagi, color: '#F57C00' },
                { label: 'pH Sore', data: phSore, color: '#D32F2F' }
            ]
        };
    }

    // --- Public API ---
    return {
        createLineChart,
        createBarChart,
        createDoughnutChart,
        formatNutrisiChartData,
        getDefaultColor
    };
})();