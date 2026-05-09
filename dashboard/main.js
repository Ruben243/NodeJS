import './style.css'
import { createClient } from '@supabase/supabase-js'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables);
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = 'Inter';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let topProductsChartInstance = null;
let allTopProductsData = [];

async function loadData() {
  try {
    // Fetch KPIs Globales (Vista)
    const { data: kpis, error: errKpi } = await supabase
      .from('kpi_globales')
      .select('*')
      .single();
      
    if (errKpi) throw errKpi;

    document.getElementById('kpi-revenue').innerText = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(kpis.ingresos_totales);
    document.getElementById('kpi-orders').innerText = Number(kpis.pedidos_completados).toLocaleString();
    document.getElementById('kpi-aov').innerText = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(kpis.ticket_medio);

    // Fetch Ventas Diarias (Vista)
    const { data: ventasDiarias, error: errDiarias } = await supabase
      .from('ventas_diarias')
      .select('*')
      .order('fecha', { ascending: true });

    if (errDiarias) throw errDiarias;

    // Fetch Ventas por Categoría (Vista)
    const { data: ventasCategoria, error: errCat } = await supabase
      .from('ventas_por_categoria')
      .select('*');

    if (errCat) throw errCat;

    // Fetch Estado de Pedidos (Vista)
    const { data: estados, error: errEst } = await supabase
      .from('pedidos_por_estado')
      .select('*');

    if (errEst) throw errEst;

    // Fetch Top Productos por Categoría (Vista)
    const { data: topProductosCat, error: errTopCat } = await supabase
      .from('top_productos_por_categoria')
      .select('*')
      .order('facturacion', { ascending: false });

    if (errTopCat) throw errTopCat;

    allTopProductsData = topProductosCat;

    // Poblar el selector de categorías
    const categorias = [...new Set(topProductosCat.map(d => d.categoria))].sort();
    const filterSelect = document.getElementById('categoryFilter');
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', (e) => {
      renderTopProductsChart(e.target.value);
    });

    // Fetch Métodos de Pago (Vista)
    const { data: metodosPago, error: errPago } = await supabase
      .from('pagos_por_metodo')
      .select('*');

    if (errPago) throw errPago;

    renderLineChart(ventasDiarias);
    renderPieChart(ventasCategoria);
    renderStatusBarChart(estados);
    renderCategoryBarChart(ventasCategoria);
    renderPaymentMethodChart(metodosPago);
    renderTopProductsChart('all');

  } catch (error) {
    console.error("Error cargando datos:", error);
  }
}

function renderLineChart(data) {
  const ctx = document.getElementById('salesLineChart').getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.fecha),
      datasets: [{
        label: 'Facturación EUR',
        data: data.map(d => d.facturacion_total),
        borderColor: '#3b82f6',
        backgroundColor: gradient,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          beginAtZero: true
        },
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10 }
        }
      }
    }
  });
}

function renderPieChart(data) {
  const ctx = document.getElementById('categoryPieChart').getContext('2d');
  
  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b',
    '#10b981', '#06b6d4', '#6366f1', '#a855f7', '#d946ef',
    '#e11d48', '#f97316', '#84cc16', '#14b8a6', '#0ea5e9'
  ];

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.categoria),
      datasets: [{
        data: data.map(d => d.facturacion),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, color: '#94a3b8' }
        }
      },
      cutout: '70%'
    }
  });
}

function renderStatusBarChart(estados) {
  const ctx = document.getElementById('statusBarChart').getContext('2d');
  
  const labels = estados.map(e => e.estado_pedido);
  const data = estados.map(e => e.cantidad);

  const colorsMap = {
    'completado': '#10b981',
    'cancelado': '#ef4444',
    'pendiente': '#f59e0b',
    'reembolsado': '#8b5cf6'
  };

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [{
        label: 'Pedidos',
        data: data,
        backgroundColor: labels.map(l => colorsMap[l] || '#3b82f6'),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          beginAtZero: true
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function renderCategoryBarChart(data) {
  const ctx = document.getElementById('categoryBarChart').getContext('2d');
  
  // Sort by order count
  const sorted = [...data].sort((a, b) => b.pedidos - a.pedidos);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.categoria),
      datasets: [{
        label: 'Nº Pedidos',
        data: sorted.map(d => d.pedidos),
        backgroundColor: '#8b5cf6',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          beginAtZero: true
        },
        x: {
          grid: { display: false },
          ticks: { maxRotation: 45, minRotation: 45 }
        }
      }
    }
  });
}

function renderTopProductsChart(categoria_filtro) {
  const ctx = document.getElementById('topProductsChart').getContext('2d');

  if (topProductsChartInstance) {
    topProductsChartInstance.destroy();
  }

  // Filtrar los datos
  let filteredData = allTopProductsData;
  if (categoria_filtro !== 'all') {
    filteredData = filteredData.filter(d => d.categoria === categoria_filtro);
  }

  // Coger solo los top 10
  const top10 = filteredData.slice(0, 10);

  topProductsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top10.map(d => d.producto),
      datasets: [{
        label: 'Facturación EUR',
        data: top10.map(d => d.facturacion),
        backgroundColor: '#f59e0b',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          beginAtZero: true
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function renderPaymentMethodChart(data) {
  const ctx = document.getElementById('paymentMethodChart').getContext('2d');
  
  const colorsMap = {
    'tarjeta': '#3b82f6',
    'paypal': '#10b981',
    'stripe': '#8b5cf6',
    'transferencia': '#f59e0b'
  };

  new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: data.map(d => d.metodo_pago.charAt(0).toUpperCase() + d.metodo_pago.slice(1)),
      datasets: [{
        label: 'Ingresos EUR',
        data: data.map(d => d.total_eur),
        backgroundColor: data.map(d => colorsMap[d.metodo_pago] || '#ec4899'),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, color: '#94a3b8' }
        }
      },
      scales: {
        r: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { display: false }
        }
      }
    }
  });
}

loadData();
