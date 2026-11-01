import React, { useState, useEffect, Component } from 'react';
import {
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  Flame,
  Coffee,
  ChefHat,
  ShoppingBag,
  PlusCircle,
  ChevronDown,
  Compass,
  Check,
  MapPin,
  Ticket,
  Plus,
  Minus,
  Sun,
  Lock,
  Users,
  X,
  Car,
  DollarSign,
  TrendingUp,
  Database,
  Trash2,
  Receipt,
  CalendarCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const API_BASE = '/api/v1';

// ── ESCUDO DE RESILIENCIA (ERROR BOUNDARY) ──
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("Interrupción detectada:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
          <div className="p-10 text-white bg-[#07080d] min-h-screen font-sans z-50 relative flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-6 shadow-xl">
              <span className="text-3xl font-serif">桜</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mb-2 text-white font-serif">Servicio Sakura Temporalmente en Pausa</h1>
            <p className="text-slate-400 text-sm max-w-md mb-6 font-light">
              Hemos presentado una breve interrupción en la visualización. Puedes reiniciar la interfaz para continuar con el servicio normalmente.
            </p>
            <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 px-6 py-3 rounded-2xl text-white font-bold shadow-lg transition">
              Reiniciar Aplicación
            </button>
            <details className="mt-8 text-left max-w-xl text-xs text-slate-500 font-mono cursor-pointer">
              <summary className="hover:text-slate-400">Detalles técnicos del sistema</summary>
              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 mt-2 overflow-auto max-h-48 text-[11px]">
                <p className="text-rose-400 font-bold">{this.state.error?.toString()}</p>
                <pre className="text-[10px] text-slate-400 mt-2 whitespace-pre-wrap">{this.state.info?.componentStack}</pre>
              </div>
            </details>
          </div>
      );
    }
    return this.props.children;
  }
}

// ── USUARIOS DEMO Y PERFILES OPERATIVOS ──
const PRESETS_USUARIOS = [
  {
    id: 'mesero',
    nombre: 'Mesero de Salón',
    rol: 'MESERO',
    email: 'mesero@sakura.com',
    password: 'Mesero123!',
    icono: '👔',
    desc: 'Atención de salón, comandas activas y parqueadero'
  },
  {
    id: 'cocinero',
    nombre: 'Cocinero / Cocinera',
    rol: 'COCINERO',
    email: 'cocinero@sakura.com',
    password: 'Cocinero123!',
    icono: '🍳',
    desc: 'Monitor de cocina KDS y disponibilidad de ingredientes'
  },
  {
    id: 'gerente',
    nombre: 'Gerente General',
    rol: 'GERENTE',
    email: 'gerente@sakura.com',
    password: 'Gerente123!',
    icono: '👑',
    desc: 'Métricas ejecutivas, gestión de carta y trazabilidad'
  },
  {
    id: 'cliente',
    nombre: 'Cliente Comensal',
    rol: 'CLIENTE',
    email: 'cliente@sakura.com',
    password: 'Cliente123!',
    icono: '👤',
    desc: 'Exploración de la carta y reserva de mesas'
  }
];

// ── HELPERS DEFENSIVOS ANTI-CRASH (Evitan que objetos JPA rompan React) ──
const normalizarArray = (data, fallback = []) => {
  if (!data) return fallback;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.content)) return data.content; // PageImpl de Spring Data
  if (Array.isArray(data.data)) return data.data;
  return fallback;
};

const clienteNombreSeguro = (r) => {
  if (!r) return 'Cliente';
  if (typeof r.cliente === 'string') return r.cliente;
  if (typeof r.cliente === 'object' && r.cliente !== null) return r.cliente.nombre || r.cliente.email || 'Cliente';
  if (r.nombreCliente) return r.nombreCliente;
  return 'Cliente';
};

const mesaNumeroSegura = (obj) => {
  if (!obj) return '1';
  if (obj.numero !== undefined) return String(obj.numero);
  if (obj.idMesa !== undefined) return String(obj.idMesa);
  if (typeof obj.mesa === 'object' && obj.mesa !== null) return String(obj.mesa.numero || obj.mesa.id || '1');
  if (obj.mesa !== undefined) return String(obj.mesa);
  return '1';
};

const nombrePlatoSeguro = (item) => {
  if (!item) return 'Plato Omakase';
  if (item.nombrePlato) return item.nombrePlato;
  if (typeof item.plato === 'object' && item.plato !== null) return item.plato.nombre || 'Plato';
  if (typeof item.plato === 'string') return item.plato;
  if (item.nombre) return item.nombre;
  return 'Especialidad Sakura';
};

// ── FOTOGRAFÍAS REALES SEGÚN EL PLATO ──
const FOTOS_GASTRONOMICAS = [
  {
    keywords: ['dragon', 'flambe', 'flambé'],
    foto: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    etiqueta: '🔥 Sellado al Soplete',
    jp: 'ドラゴンロール',
    ingredientes: 'Langostino tempura · Salmón noruego sellado · Salsa tare'
  },
  {
    keywords: ['tuna', 'tartare', 'spicy', 'atun', 'atún'],
    foto: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
    etiqueta: '🌶️ Spicy Tartare',
    jp: 'スパイシーツナ',
    ingredientes: 'Atún rojo aleta amarilla · Aceite de sésamo · Arroz tostado'
  },
  {
    keywords: ['ramen', 'tonkotsu', 'sopa', 'fideo', 'caldo'],
    foto: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    etiqueta: '⭐ Caldo 18 Horas',
    jp: '豚骨ラーメン',
    ingredientes: 'Chashu glaseado · Huevo ajitsuke · Nori crocante · Fondo espeso'
  },
  {
    keywords: ['gyoza', 'empanad', 'dumpling', 'cerdo'],
    foto: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80',
    etiqueta: '🥟 Salteado al Wok',
    jp: '黒豚餃子',
    ingredientes: 'Cerdo ibérico · Masa fina artesanal · Reducción de ponzu y togarashi'
  },
  {
    keywords: ['sake', 'junmai', 'licor', 'bebida', 'copa'],
    foto: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    etiqueta: '🍶 50% Pulido',
    jp: '純米大吟醸',
    ingredientes: 'Arroz Yamada Nishiki · Fermentación en frío · Copa helada'
  },
  {
    keywords: ['mochi', 'helado', 'postre', 'dulce', 'kioto'],
    foto: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80',
    etiqueta: '🍨 Masa Elástica',
    jp: '抹茶餅トリオ',
    ingredientes: 'Té matcha ceremonial · Helado de mango biche · Polvo de oro'
  },
  {
    keywords: ['edamame', 'soya'],
    foto: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    etiqueta: '🌿 Sal Maldon',
    jp: '枝豆',
    ingredientes: 'Vainas al vapor · Sal marina escamada · Aceite de sésamo'
  },
  {
    keywords: ['roll', 'maki', 'sushi', 'california', 'philadelphia'],
    foto: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&auto=format&fit=crop&q=80',
    etiqueta: '🍣 Rollo Insignia',
    jp: '巻き寿司',
    ingredientes: 'Pesca selecta del día · Palta fresca · Alga nori tostada'
  }
];

const resolverMetaPlato = (plato) => {
  if (!plato) return FOTOS_GASTRONOMICAS[0];
  const texto = `${plato.nombre || ''} ${plato.descripcion || ''} ${plato.categoria || ''}`.toLowerCase();
  const encontrado = FOTOS_GASTRONOMICAS.find(item => item.keywords.some(k => texto.includes(k)));
  return encontrado || FOTOS_GASTRONOMICAS[0];
};

// ── TRES PILARES SHOKUNIN CON FOTOS REALES ──
const PILARES_SHOKUNIN = [
  {
    numero: '01',
    titulo: 'Corte Shokunin',
    kanji: '包丁道',
    subtitulo: 'Precisión Milimétrica',
    descripcion: 'Cada corte se realiza con cuchillos Yanagiba de acero al carbono, respetando la fibra y textura natural del pescado sin desgarrarlo.',
    imagen: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&auto=format&fit=crop&q=80',
    etiqueta: 'Acero Yanagiba',
    icono: Flame,
    colorIcono: 'text-rose-400'
  },
  {
    numero: '02',
    titulo: 'Arroz Shari Perfecto',
    kanji: '舎利の極み',
    subtitulo: 'Grano Koshihikari',
    descripcion: 'Grano Koshihikari sazonado con vinagre de arroz añejado artesanalmente, servido a temperatura corporal del comensal.',
    imagen: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&auto=format&fit=crop&q=80',
    etiqueta: 'Vinagre Akasu',
    icono: Sparkles,
    colorIcono: 'text-amber-400'
  },
  {
    numero: '03',
    titulo: 'Origen Responsable',
    kanji: '一期一会',
    subtitulo: 'Pesca Sustentable',
    descripcion: 'Pesca seleccionada del día, trazabilidad directa con proveedores artesanales y respeto por las temporadas marinas.',
    imagen: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
    etiqueta: 'Trazabilidad 100%',
    icono: ShieldCheck,
    colorIcono: 'text-blue-400'
  }
];

const PLATOS_FIRMA = [
  { id: 1, nombre: "Dragon Roll Flambé", precio: 38000, categoria: "Rolls de Autor", disponible: true, descripcion: "Langostinos tempura y aguacate Hass, salmón noruego sellado al soplete con tare dulce." },
  { id: 2, nombre: "Tuna Spicy Tartare", precio: 35000, categoria: "Rolls de Autor", disponible: true, descripcion: "Atún rojo aleta amarilla marinado en aceite de sésamo picante sobre crujiente cama de arroz tostado." },
  { id: 3, nombre: "Ramen Tonkotsu 18 Horas", precio: 36000, categoria: "Platos Fuertes", disponible: true, descripcion: "Caldo artesanal espeso cocinado 18 horas, chashu glaseado, huevo ajitsuke y nori crocante." },
  { id: 4, nombre: "Gyozas de Cerdo Ibérico", precio: 25000, categoria: "Entradas", disponible: true, descripcion: "Cinco empanadillas artesanales doradas a la plancha hasta base crocante, con reducción de ponzu." },
  { id: 5, nombre: "Sake Junmai Dai-Ginjo", precio: 32000, categoria: "Bebidas & Sake", disponible: true, descripcion: "Sake de fermentación lenta en frío con notas florales a ciruelo blanco y pera asiática." },
  { id: 6, nombre: "Mochi Helado Trilogía", precio: 21000, categoria: "Postres", disponible: true, descripcion: "Masa elástica rellena de helado cremoso de té matcha de Kioto, mango biche y coco tostado." }
];

// ── MESAS DEL PLANO CAD (24 MESAS CON DIBUJO DETALLADO) ──
const MESAS_DEL_PLANO = [
  { id: 1, numero: 1, zona: "OUTDOOR SEATING", subzona: "Terraza al Aire Libre", tipo: "parasol", left: 36, top: 11, capacidad: 4, label: "M1" },
  { id: 2, numero: 2, zona: "OUTDOOR SEATING", subzona: "Terraza al Aire Libre", tipo: "parasol", left: 47, top: 11, capacidad: 4, label: "M2" },
  { id: 3, numero: 3, zona: "OUTDOOR SEATING", subzona: "Terraza al Aire Libre", tipo: "redonda", left: 36, top: 22, capacidad: 4, label: "M3" },
  { id: 4, numero: 4, zona: "OUTDOOR SEATING", subzona: "Terraza al Aire Libre", tipo: "parasol", left: 56, top: 19, capacidad: 4, label: "M4" },
  { id: 5, numero: 5, zona: "OUTDOOR SEATING", subzona: "Terraza al Aire Libre", tipo: "parasol", left: 66, top: 19, capacidad: 4, label: "M5" },
  { id: 6, numero: 6, zona: "OUTDOOR SEATING", subzona: "Terraza al Aire Libre", tipo: "parasol", left: 66, top: 9, capacidad: 4, label: "M6" },
  { id: 7, numero: 7, zona: "OUTDOOR SEATING", subzona: "Lounge Exterior", tipo: "lounge", left: 76, top: 10, capacidad: 5, label: "LOUNGE" },

  { id: 20, numero: 20, zona: "VIP KOSHITSU", subzona: "Cabina VIP 1 (Biombo Shoji)", tipo: "booth-vip", left: 77.5, top: 46, capacidad: 4, label: "B1 VIP" },
  { id: 21, numero: 21, zona: "VIP KOSHITSU", subzona: "Cabina VIP 2 (Biombo Shoji)", tipo: "booth-vip", left: 77.5, top: 62, capacidad: 4, label: "B2 VIP" },

  { id: 8,  numero: 8,  zona: "FINE DINING AREA", subzona: "Salón Central Elegante", tipo: "rect-6", left: 45, top: 32, capacidad: 6, label: "M8" },
  { id: 9,  numero: 9,  zona: "FINE DINING AREA", subzona: "Salón Central Elegante", tipo: "rect-6", left: 53, top: 32, capacidad: 6, label: "M9" },
  { id: 10, numero: 10, zona: "FINE DINING AREA", subzona: "Salón Central Elegante", tipo: "rect-6", left: 61, top: 32, capacidad: 6, label: "M10" },
  { id: 11, numero: 11, zona: "FINE DINING AREA", subzona: "Salón Central Elegante", tipo: "rect-6", left: 68, top: 32, capacidad: 6, label: "M11" },

  { id: 12, numero: 12, zona: "FINE DINING AREA", subzona: "Salón Elegante", tipo: "redonda", left: 36, top: 34, capacidad: 4, label: "M12" },
  { id: 13, numero: 13, zona: "FINE DINING AREA", subzona: "Salón Elegante", tipo: "redonda", left: 36, top: 52, capacidad: 4, label: "M13" },
  { id: 14, numero: 14, zona: "FINE DINING AREA", subzona: "Salón Central", tipo: "redonda", left: 45, top: 44, capacidad: 4, label: "M14" },
  { id: 15, numero: 15, zona: "FINE DINING AREA", subzona: "Salón Central", tipo: "rect-4", left: 53, top: 44, capacidad: 4, label: "M15" },
  { id: 16, numero: 16, zona: "FINE DINING AREA", subzona: "Salón Central", tipo: "rect-4", left: 61, top: 44, capacidad: 4, label: "M16" },

  { id: 17, numero: 17, zona: "FINE DINING AREA", subzona: "Salón Elegante", tipo: "redonda", left: 45, top: 56, capacidad: 4, label: "M17" },
  { id: 18, numero: 18, zona: "FINE DINING AREA", subzona: "Salón Elegante", tipo: "rect-4", left: 53, top: 56, capacidad: 4, label: "M18" },
  { id: 19, numero: 19, zona: "FINE DINING AREA", subzona: "Salón Elegante", tipo: "rect-4", left: 61, top: 56, capacidad: 4, label: "M19" },

  { id: 22, numero: 22, zona: "FINE DINING AREA", subzona: "Corredor Sur Salón", tipo: "rect-6", left: 45, top: 69, capacidad: 6, label: "M22" },
  { id: 23, numero: 23, zona: "FINE DINING AREA", subzona: "Corredor Sur Salón", tipo: "rect-6", left: 53, top: 69, capacidad: 6, label: "M23" },
  { id: 24, numero: 24, zona: "FINE DINING AREA", subzona: "Corredor Sur Salón", tipo: "rect-6", left: 61, top: 69, capacidad: 6, label: "M24" }
];

// TABURETES BAR NORMAL (SUPERIOR)
const TABURETES_BARRA_NORMAL = [
  { id: 101, numero: 101, codigo: "B1", index: 0, left: 15.5, top: 57.5, label: "B1", zona: "BAR NORMAL", tipoBar: 'normal' },
  { id: 102, numero: 102, codigo: "B2", index: 1, left: 18.5, top: 57.5, label: "B2", zona: "BAR NORMAL", tipoBar: 'normal' },
  { id: 103, numero: 103, codigo: "B3", index: 2, left: 21.5, top: 57.5, label: "B3", zona: "BAR NORMAL", tipoBar: 'normal' },
  { id: 104, numero: 104, codigo: "B4", index: 3, left: 24.5, top: 57.5, label: "B4", zona: "BAR NORMAL", tipoBar: 'normal' },
  { id: 105, numero: 105, codigo: "B5", index: 4, left: 28.5, top: 64.5, label: "B5", zona: "BAR NORMAL", tipoBar: 'normal' },
  { id: 106, numero: 106, codigo: "B6", index: 5, left: 24.5, top: 71.5, label: "B6", zona: "BAR NORMAL", tipoBar: 'normal' },
  { id: 107, numero: 107, codigo: "B7", index: 6, left: 21.5, top: 71.5, label: "B7", zona: "BAR NORMAL", tipoBar: 'normal' },
  { id: 108, numero: 108, codigo: "B8", index: 7, left: 18.5, top: 71.5, label: "B8", zona: "BAR NORMAL", tipoBar: 'normal' }
];

// TABURETES BAR VIP (INFERIOR SEPARADO)
const TABURETES_BARRA_VIP = [
  { id: 201, numero: 201, codigo: "VIP 1", index: 0, left: 14.0, top: 86.0, label: "VIP 1", zona: "BAR VIP EXCLUSIVO", tipoBar: 'vip' },
  { id: 202, numero: 202, codigo: "VIP 2", index: 1, left: 17.5, top: 86.0, label: "VIP 2", zona: "BAR VIP EXCLUSIVO", tipoBar: 'vip' },
  { id: 203, numero: 203, codigo: "VIP 3", index: 2, left: 21.0, top: 86.0, label: "VIP 3", zona: "BAR VIP EXCLUSIVO", tipoBar: 'vip' },
  { id: 204, numero: 204, codigo: "VIP 4", index: 3, left: 24.5, top: 86.0, label: "VIP 4", zona: "BAR VIP EXCLUSIVO", tipoBar: 'vip' }
];

function SakuraApp() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('usuario')); } catch (e) { return null; }
  });

  // Módulos: 'salon' | 'mesero' | 'cocina' | 'gerente'
  const [moduloActual, setModuloActual] = useState('salon');
  const [etapaSalon, setEtapaSalon] = useState('landing');
  const [seleccionActual, setSeleccionActual] = useState(MESAS_DEL_PLANO[7]);

  // Selección de puestos contiguos en el bar
  const [cantidadSillasBar, setCantidadSillasBar] = useState(1);
  const [sillasSeleccionadas, setSillasSeleccionadas] = useState([]);
  const [mostrarModalLogin, setMostrarModalLogin] = useState(false);

  // Estados sincronizados
  const [menu, setMenu] = useState(PLATOS_FIRMA);
  const [pedidos, setPedidos] = useState([
    { id: 101, idMesa: 4, estado: 'RECIBIDO', items: [{ id: 1, cantidad: 2, nombrePlato: 'Dragon Roll Flambé' }, { id: 5, cantidad: 1, nombrePlato: 'Sake Junmai Dai-Ginjo' }] },
    { id: 102, idMesa: 8, estado: 'EN_PREPARACION', items: [{ id: 3, cantidad: 2, nombrePlato: 'Ramen Tonkotsu 18 Horas' }] },
    { id: 103, idMesa: 20, estado: 'LISTO', items: [{ id: 2, cantidad: 1, nombrePlato: 'Tuna Spicy Tartare' }] }
  ]);
  const [cuentas, setCuentas] = useState([
    { id: 1, idMesa: 4, estado: 'ABIERTA', total: 108000 },
    { id: 2, idMesa: 8, estado: 'ABIERTA', total: 72000 }
  ]);
  const [reservas, setReservas] = useState([
    { id: 501, cliente: "Carlos Rodríguez", mesa: "M4", personas: 4, hora: "19:30", estado: "CONFIRMADA" },
    { id: 502, cliente: "Valentina Gómez", mesa: "B1 VIP", personas: 2, hora: "20:00", estado: "CONFIRMADA" }
  ]);
  const [parqueadero, setParqueadero] = useState({ cuposDisponibles: 12, vehiculosDentro: 8, totalCupos: 20 });
  const [historialMongo, setHistorialMongo] = useState([
    { fechaHora: '16:15:22', estadoAnterior: 'CREADO', estadoNuevo: 'RECIBIDO', usuarioModificador: 'mesero' },
    { fechaHora: '16:18:40', estadoAnterior: 'RECIBIDO', estadoNuevo: 'EN_PREPARACION', usuarioModificador: 'cocinero' }
  ]);
  const [pedidoAuditado, setPedidoAuditado] = useState(101);

  // Comanda en mesa
  const [comandaMesa, setComandaMesa] = useState([]);
  const [categoriaCarta, setCategoriaCarta] = useState('TODOS');
  const [notificacion, setNotificacion] = useState(null);

  // Formularios
  const [placaEntrada, setPlacaEntrada] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('AUTO');
  const [placaSalida, setPlacaSalida] = useState('');
  const [nuevoPlato, setNuevoPlato] = useState({ nombre: '', precio: '', categoria: 'Rolls de Autor', descripcion: '' });

  const notify = (texto) => {
    setNotificacion(texto);
    setTimeout(() => setNotificacion(null), 3800);
  };

  // ── AUTENTICACIÓN CON CUALQUIER PRESET ──
  const loginConPreset = async (preset, silencioso = false) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: preset.email, password: preset.password })
      });
      const data = await res.json();

      if (res.ok && data?.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);

        const u = data.usuario || { email: preset.email, nombre: preset.nombre, rol: preset.rol };
        setUsuario(u);
        localStorage.setItem('usuario', JSON.stringify(u));

        if (!silencioso) notify(`✓ Sesión activa: ${preset.nombre} (${preset.rol})`);
        setMostrarModalLogin(false);
        sincronizarDatos(data.token);
        return data.token;
      }
    } catch (e) {
      const u = { email: preset.email, nombre: preset.nombre, rol: preset.rol };
      setUsuario(u);
      localStorage.setItem('usuario', JSON.stringify(u));
      if (!silencioso) notify(`✓ Conectado como ${preset.nombre}`);
      setMostrarModalLogin(false);
    }
    return null;
  };

  // Inicio automático como Mesero
  useEffect(() => {
    const verificar = async () => {
      const tk = localStorage.getItem('token');
      if (!tk) {
        await loginConPreset(PRESETS_USUARIOS[0], true);
      } else {
        sincronizarDatos(tk);
      }
    };
    verificar();
  }, []);

  // ── SINCRONIZACIÓN DEFENSIVA CON SPRING BOOT ──
  const sincronizarDatos = async (tkParam = token) => {
    const tk = tkParam || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...(tk ? { 'Authorization': `Bearer ${tk}` } : {}) };

    // 1. Menú
    try {
      const resM = await fetch(`${API_BASE}/menu`);
      if (resM.ok) {
        const dM = await resM.json();
        const lista = normalizarArray(dM);
        if (lista.length > 0) setMenu(lista);
      }
    } catch (e) {}

    if (!tk) return;

    // 2. Pedidos
    try {
      const resP = await fetch(`${API_BASE}/pedidos`, { headers });
      if (resP.ok) {
        const dP = await resP.json();
        const lista = normalizarArray(dP);
        if (lista.length > 0) setPedidos(lista);
      }
    } catch (e) {}

    // 3. Cuentas
    try {
      const resC = await fetch(`${API_BASE}/cuentas`, { headers });
      if (resC.ok) {
        const dC = await resC.json();
        const lista = normalizarArray(dC);
        if (lista.length > 0) setCuentas(lista);
      }
    } catch (e) {}

    // 4. Parqueadero
    try {
      const resParq = await fetch(`${API_BASE}/parqueadero/estado`, { headers });
      if (resParq.ok) {
        const dParq = await resParq.json();
        if (dParq && typeof dParq === 'object' && !Array.isArray(dParq)) {
          setParqueadero(prev => ({
            cuposDisponibles: dParq.cuposDisponibles ?? dParq.cupos_disponibles ?? prev.cuposDisponibles,
            vehiculosDentro: dParq.vehiculosDentro ?? dParq.vehiculos_dentro ?? prev.vehiculosDentro,
            totalCupos: dParq.totalCupos ?? dParq.total_cupos ?? prev.totalCupos
          }));
        }
      }
    } catch (e) {}

    // 5. Reservas
    try {
      const resR = await fetch(`${API_BASE}/reservas`, { headers });
      if (resR.ok) {
        const dR = await resR.json();
        const lista = normalizarArray(dR);
        if (lista.length > 0) setReservas(lista);
      }
    } catch (e) {}
  };

  // ── MANEJO DE SILLAS EN EL BAR ──
  const manejarSeleccionBar = (taburete, listaOrigen, numDeseado = cantidadSillasBar) => {
    const maxPermitido = taburete.tipoBar === 'vip' ? 4 : 6;
    const cantidadAjustada = Math.min(Math.max(1, numDeseado), maxPermitido);
    setCantidadSillasBar(cantidadAjustada);

    const idxInicio = taburete.index ?? 0;
    let seleccionadas = [];

    for (let i = 0; i < cantidadAjustada; i++) {
      const targetIdx = (idxInicio + i) % listaOrigen.length;
      seleccionadas.push(listaOrigen[targetIdx]);
    }

    setSillasSeleccionadas(seleccionadas);
    setSeleccionActual({
      ...taburete,
      esBar: true,
      sillasAgrupadas: seleccionadas,
      label: seleccionadas.length > 1
          ? `${taburete.zona}: ${seleccionadas.map(s => s.codigo).join(', ')}`
          : `${taburete.zona} (${taburete.codigo})`,
      capacidad: cantidadAjustada
    });
  };

  const cambiarCantidadSillas = (delta) => {
    if (!seleccionActual?.esBar) return;
    const esVip = seleccionActual.tipoBar === 'vip';
    const maxPermitido = esVip ? 4 : 6;
    const nuevaCantidad = Math.min(Math.max(1, cantidadSillasBar + delta), maxPermitido);

    const listaOrigen = esVip ? TABURETES_BARRA_VIP : TABURETES_BARRA_NORMAL;
    const baseStool = sillasSeleccionadas[0] || seleccionActual;
    manejarSeleccionBar(baseStool, listaOrigen, nuevaCantidad);
  };

  const confirmarAsientoEnPlano = async () => {
    setComandaMesa([]);
    let jwt = token || localStorage.getItem('token');
    if (!jwt || usuario?.rol === 'CLIENTE') {
      jwt = await loginConPreset(PRESETS_USUARIOS[0], true);
    }

    try {
      if (jwt) {
        await fetch(`${API_BASE}/cuentas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${jwt}` },
          body: JSON.stringify({
            idMesa: seleccionActual.id,
            comensales: seleccionActual.esBar ? cantidadSillasBar : seleccionActual.capacidad
          })
        });
      }
    } catch (e) {}

    // Agregar cuenta en el salón si no existía
    setCuentas(prev => {
      const lista = normalizarArray(prev);
      const existe = lista.find(c => c.idMesa === seleccionActual.id && c.estado !== 'CERRADA');
      if (existe) return lista;
      return [...lista, { id: lista.length + 1, idMesa: seleccionActual.id, estado: 'ABIERTA', total: 0 }];
    });

    notify(`✓ Asiento confirmado: ${seleccionActual.label}`);
    setEtapaSalon('en_mesa');
  };

  // ── ENVÍO SEGURO Y PERSISTENTE A COCINA ──
  const enviarPedidoACocina = async () => {
    if (comandaMesa.length === 0) return notify('Tu comanda está vacía');

    let tk = token;
    if (!tk || usuario?.rol === 'CLIENTE') {
      tk = await loginConPreset(PRESETS_USUARIOS[0], true); // Mesero
    }

    const itemsPedido = comandaMesa.map(it => ({ idPlato: it.id, cantidad: it.cantidad, nombrePlato: it.nombre }));
    const totalPedido = comandaMesa.reduce((acc, it) => acc + (it.precio * it.cantidad), 0);

    let nuevoIdPedido = Date.now() % 10000;

    try {
      // 1. Abrir cuenta en backend
      await fetch(`${API_BASE}/cuentas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tk}` },
        body: JSON.stringify({ idMesa: seleccionActual.id, comensales: seleccionActual.capacidad || 2 })
      });

      // 2. Crear pedido en backend
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tk}` },
        body: JSON.stringify({
          idMesa: seleccionActual.id,
          items: comandaMesa.map(it => ({ idPlato: it.id, cantidad: it.cantidad }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.id) nuevoIdPedido = data.id;
      }
    } catch (e) {}

    // Sincronización inmediata para KDS y Mesero
    const pedidoCreado = {
      id: nuevoIdPedido,
      idMesa: seleccionActual.id,
      estado: 'RECIBIDO',
      items: itemsPedido,
      total: totalPedido
    };

    setPedidos(prev => [pedidoCreado, ...normalizarArray(prev)]);

    // Actualizar cuenta activa
    setCuentas(prev => {
      const lista = normalizarArray(prev);
      const existe = lista.find(c => c.idMesa === seleccionActual.id && c.estado !== 'CERRADA');
      if (existe) {
        return lista.map(c => c.id === existe.id ? { ...c, total: (c.total || 0) + totalPedido } : c);
      }
      return [...lista, { id: lista.length + 1, idMesa: seleccionActual.id, estado: 'ABIERTA', total: totalPedido }];
    });

    setComandaMesa([]);
    notify(`🛎️ ¡Comanda #${nuevoIdPedido} confirmada! Enviada a cocina`);
  };

  // ── ACCIONES DE MESERO ──
  const solicitarCuenta = async (idCuenta) => {
    try {
      await fetch(`${API_BASE}/cuentas/${idCuenta}/solicitar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}

    setCuentas(prev => normalizarArray(prev).map(c => c.id === idCuenta ? { ...c, estado: 'EN_PAGO' } : c));
    notify(`✓ Cuenta #${idCuenta} solicitada. En proceso de pago.`);
  };

  const pagarCuenta = async (idCuenta, metodoPago = 'TARJETA') => {
    try {
      await fetch(`${API_BASE}/cuentas/${idCuenta}/pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ metodoPago })
      });
    } catch (e) {}

    setCuentas(prev => normalizarArray(prev).filter(c => c.id !== idCuenta));
    notify(`✓ Cuenta #${idCuenta} liquidada con ${metodoPago}. ¡Mesa disponible!`);
  };

  const registrarLlegadaReserva = async (idReserva) => {
    try {
      await fetch(`${API_BASE}/reservas/${idReserva}/llegada`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}

    setReservas(prev => normalizarArray(prev).map(r => r.id === idReserva ? { ...r, estado: 'LLEGADA' } : r));
    notify(`✓ Check-In confirmado. Mesa lista para servicio.`);
  };

  const registrarEntradaVehiculo = async () => {
    if (!placaEntrada) return notify('Digita la placa');
    const placa = placaEntrada.toUpperCase().trim();

    try {
      await fetch(`${API_BASE}/parqueadero/entrada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ placa, tipoVehiculo })
      });
    } catch (e) {}

    setParqueadero(prev => ({
      ...prev,
      cuposDisponibles: Math.max(0, prev.cuposDisponibles - 1),
      vehiculosDentro: prev.vehiculosDentro + 1
    }));
    notify(`✓ Vehículo ingresado: ${placa} (${tipoVehiculo})`);
    setPlacaEntrada('');
  };

  const registrarSalidaVehiculo = async () => {
    if (!placaSalida) return notify('Digita la placa');
    const placa = placaSalida.toUpperCase().trim();

    let total = 12000;
    try {
      const res = await fetch(`${API_BASE}/parqueadero/salida/${placa}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        if (d?.totalPagar) total = d.totalPagar;
      }
    } catch (e) {}

    setParqueadero(prev => ({
      ...prev,
      cuposDisponibles: Math.min(prev.totalCupos, prev.cuposDisponibles + 1),
      vehiculosDentro: Math.max(0, prev.vehiculosDentro - 1)
    }));
    notify(`✓ Salida de ${placa}. Total liquidado: $${Number(total).toLocaleString('es-CO')}`);
    setPlacaSalida('');
  };

  // ── ACCIONES DE COCINERO (KDS) ──
  const cambiarEstadoCocina = async (idPedido, nuevoEstado) => {
    try {
      await fetch(`${API_BASE}/pedidos/${idPedido}/estado?estado=${nuevoEstado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}

    setPedidos(prev => normalizarArray(prev).map(p => p.id === idPedido ? { ...p, estado: nuevoEstado } : p));

    const nuevoEvento = {
      fechaHora: new Date().toLocaleTimeString('es-CO'),
      estadoAnterior: normalizarArray(pedidos).find(p => p.id === idPedido)?.estado || 'RECIBIDO',
      estadoNuevo: nuevoEstado,
      usuarioModificador: usuario?.nombre || 'cocinero'
    };
    setHistorialMongo(prev => [nuevoEvento, ...normalizarArray(prev)]);
    notify(`Comanda #${idPedido} ➔ "${nuevoEstado}"`);
  };

  const toggleDisponibilidadPlato = async (idPlato, dispActual) => {
    try {
      await fetch(`${API_BASE}/platos/${idPlato}/disponible?disponible=${!dispActual}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}

    setMenu(prev => normalizarArray(prev).map(p => p.id === idPlato ? { ...p, disponible: !dispActual } : p));
    notify(`Plato #${idPlato} ➔ ${!dispActual ? 'Disponible en Carta' : 'Agotado Temporalmente'}`);
  };

  // ── ACCIONES DE GERENTE ──
  const crearNuevoPlato = async (e) => {
    e.preventDefault();
    if (!nuevoPlato.nombre || !nuevoPlato.precio) return notify('Completa nombre y precio');

    const platoObj = {
      id: menu.length + 1,
      nombre: nuevoPlato.nombre,
      precio: Number(nuevoPlato.precio),
      categoria: nuevoPlato.categoria,
      descripcion: nuevoPlato.descripcion || 'Creación exclusiva de Gerencia.',
      disponible: true
    };

    try {
      await fetch(`${API_BASE}/platos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(platoObj)
      });
    } catch (e) {}

    setMenu(prev => [platoObj, ...normalizarArray(prev)]);
    setNuevoPlato({ nombre: '', precio: '', categoria: 'Rolls de Autor', descripcion: '' });
    notify(`✓ Plato "${platoObj.nombre}" guardado en la Carta`);
  };

  const eliminarPlato = async (idPlato) => {
    try {
      await fetch(`${API_BASE}/platos/${idPlato}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}

    setMenu(prev => normalizarArray(prev).filter(p => p.id !== idPlato));
    notify(`✓ Plato #${idPlato} retirado de la carta`);
  };

  const consultarHistorialMongo = async (idPedido) => {
    setPedidoAuditado(idPedido);
    try {
      const res = await fetch(`${API_BASE}/pedidos/${idPedido}/historial`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        const lista = normalizarArray(d);
        if (lista.length > 0) {
          setHistorialMongo(lista);
          return notify(`✓ Historial de trazabilidad de Comanda #${idPedido} cargado`);
        }
      }
    } catch (e) {}

    notify(`✓ Historial de servicio de Comanda #${idPedido} cargado`);
  };

  const cambiarModulo = async (mod) => {
    setModuloActual(mod);
    if (mod === 'cocina' && usuario?.rol !== 'COCINERO' && usuario?.rol !== 'GERENTE') {
      await loginConPreset(PRESETS_USUARIOS[1]);
    } else if (mod === 'gerente' && usuario?.rol !== 'GERENTE') {
      await loginConPreset(PRESETS_USUARIOS[2]);
    } else if (mod === 'mesero' && usuario?.rol !== 'MESERO' && usuario?.rol !== 'GERENTE') {
      await loginConPreset(PRESETS_USUARIOS[0]);
    }
  };

  // Listas defensivas listas para renderizar sin crash
  const listaCuentas = normalizarArray(cuentas);
  const listaPedidos = normalizarArray(pedidos);
  const listaReservas = normalizarArray(reservas);
  const listaHistorial = normalizarArray(historialMongo);
  const listaMenu = normalizarArray(menu, PLATOS_FIRMA);

  const totalComanda = comandaMesa.reduce((acc, it) => acc + (it.precio * it.cantidad), 0);
  const platosVisibles = listaMenu.filter(p => categoriaCarta === 'TODOS' || p?.categoria?.toUpperCase().includes(categoriaCarta.toUpperCase()));

  return (
      <div className="min-h-screen w-full bg-[#07080d] text-slate-100 relative overflow-x-hidden selection:bg-rose-600 selection:text-white font-sans">

        <style>{`
        html, body, #root {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
        }
      `}</style>

        {/* FONDO NÍTIDO TOTAL */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-screen h-screen">
          <div
              className="absolute inset-0 w-full h-full bg-cover bg-center opacity-85 filter contrast-110 brightness-95"
              style={{ backgroundImage: "url('/mesa-bg.png'), url('https://images.unsplash.com/photo-1552611052-33e04de081de?w=1920&auto=format&fit=crop&q=85')" }}
          />
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-rose-600/25 via-red-600/10 to-transparent blur-3xl opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07080d]/65 via-[#07080d]/40 to-[#07080d]/85" />
        </div>

        {/* NOTIFICACIÓN FLOTANTE */}
        {notificacion && (
            <div className="fixed top-20 right-6 z-50 animate-bounce">
              <div className="px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-rose-500/40 bg-slate-900/95 text-rose-200 backdrop-blur-xl">
                <Sparkles size={15} className="text-amber-400" />
                <span>{notificacion}</span>
              </div>
            </div>
        )}

        {/* MODAL CAMBIAR PRESET */}
        {mostrarModalLogin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-md bg-[#0b0e17] border border-rose-500/40 rounded-3xl p-6 shadow-2xl relative space-y-4">
                <button onClick={() => setMostrarModalLogin(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900">
                  <X size={16} />
                </button>
                <div className="text-center">
                  <span className="text-[10px] uppercase font-mono font-bold text-rose-400">Gestión de Accesos & Perfiles</span>
                  <h3 className="text-xl font-bold text-white font-serif mt-0.5">Seleccionar Perfil de Usuario</h3>
                  <p className="text-xs text-slate-400">Selecciona el perfil para ingresar al sistema y explorar sus funciones.</p>
                </div>
                <div className="space-y-2.5">
                  {PRESETS_USUARIOS.map(pr => (
                      <div
                          key={pr.id}
                          onClick={() => loginConPreset(pr)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                              usuario?.email === pr.email ? 'bg-rose-950/60 border-rose-400' : 'bg-slate-900/80 border-slate-800 hover:border-slate-600'
                          }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{pr.icono}</span>
                          <div>
                            <p className="font-bold text-sm text-white">{pr.nombre} <span className="text-[10px] font-mono text-rose-300">({pr.rol})</span></p>
                            <p className="text-[11px] text-slate-400 font-mono">{pr.email}</p>
                          </div>
                        </div>
                        {usuario?.email === pr.email ? (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-1 rounded border border-rose-800 font-mono">ACTIVO</span>
                        ) : (
                            <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded hover:text-white">Ingresar</span>
                        )}
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* ── HEADER CON SELECTOR DE MÓDULOS DE ROL ── */}
        <header className="sticky top-0 z-40 w-full bg-[#07080d]/90 backdrop-blur-xl border-b border-rose-950/40 shadow-2xl px-4 md:px-8 lg:px-14 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setModuloActual('salon'); setEtapaSalon('landing'); }}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-lg border border-rose-400/30">
              <UtensilsCrossed size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-wider text-white">SAKURA</span>
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-700/60 px-2 py-0.5 rounded-full font-serif font-bold">桜 鮨</span>
              </div>
              <p className="text-[8px] text-rose-300/80 tracking-widest uppercase font-mono">Alta Gastronomía Japonesa & Omakase</p>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
                onClick={() => setModuloActual('salon')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    moduloActual === 'salon' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}>
              <Compass size={14} /> Salón & Carta
            </button>
            <button
                onClick={() => cambiarModulo('mesero')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    moduloActual === 'mesero' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}>
              <span>👔</span> Servicio Salón
            </button>
            <button
                onClick={() => cambiarModulo('cocina')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    moduloActual === 'cocina' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}>
              <ChefHat size={14} /> Cocina KDS
            </button>
            <button
                onClick={() => cambiarModulo('gerente')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    moduloActual === 'gerente' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}>
              <span>👑</span> Gerencia
            </button>
          </nav>

          <button
              onClick={() => setMostrarModalLogin(true)}
              className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs transition shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">{usuario?.nombre || 'Mesero'}</span>
            <span className="text-[9px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800 font-bold">{usuario?.rol || 'MESERO'}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
        </header>

        {/* ══════════════════════════════════════════════════════════════════
          MÓDULO 1: SALÓN, PLANO CAD & CARTA (CLIENTE / COMENSAL)
          ══════════════════════════════════════════════════════════════════ */}
        {moduloActual === 'salon' && (
            <main className="relative z-10 w-full px-4 md:px-8 lg:px-14 py-8">
              {etapaSalon === 'landing' && (
                  <div className="space-y-12">
                    <section className="text-center py-16 max-w-4xl mx-auto space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-rose-500/40 text-rose-300 text-xs font-serif backdrop-blur-md">
                        <Flame size={13} className="text-rose-400" />
                        <span>伝統と至高の味 · Tradición Shokunin y Omakase Supremo</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-black text-white font-serif leading-tight">
                        El Arte del Sushi Tradicional en su Máxima Expresión.
                      </h1>
                      <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto font-light">
                        Ingredientes de pesca sustentable seleccionados a diario con rigor Shokunin, sazón auténtica de Tokio y una atmósfera gastronómica inigualable.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <button
                            onClick={() => setEtapaSalon('elegir_mesa')}
                            className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-black text-xs px-8 py-4 rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 transition">
                          <Compass size={16} /> Ver Plano y Elegir Mesa <ArrowRight size={15} />
                        </button>
                        <button
                            onClick={() => setEtapaSalon('en_mesa')}
                            className="bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-500/40 font-bold text-xs px-8 py-4 rounded-2xl shadow-xl flex items-center gap-2 hover:scale-105 transition">
                          <UtensilsCrossed size={16} /> Explorar la Carta
                        </button>
                      </div>
                    </section>

                    {/* Estadísticas */}
                    <section className="w-full border-y border-rose-950/40 bg-[#07080d]/80 backdrop-blur-xl px-6 py-6 rounded-3xl">
                      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div><p className="text-2xl font-black text-white font-serif">+15,000</p><p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Comensales Felices</p></div>
                        <div><p className="text-2xl font-black text-rose-400 font-serif">100%</p><p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Pesca Fresca del Día</p></div>
                        <div><p className="text-2xl font-black text-amber-400 font-serif">18 Años</p><p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Maestría Culinaria</p></div>
                        <div><p className="text-2xl font-black text-emerald-400 font-serif">24 Espacios</p><p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Salón, Barra & Terraza</p></div>
                      </div>
                    </section>

                    {/* Tres Pilares Shokunin con Fotos Reales */}
                    <section className="space-y-6">
                      <div className="text-center">
                        <span className="text-xs uppercase tracking-widest text-rose-400 font-bold font-mono">Filosofía Shokunin</span>
                        <h2 className="text-3xl font-black text-white font-serif mt-1">Tres Pilares de Nuestra Cocina</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PILARES_SHOKUNIN.map((p, idx) => {
                          const IconoPilar = p.icono;
                          return (
                              <div key={idx} className="bg-slate-900/85 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                                  <img src={p.imagen} alt={p.titulo} className="w-full h-full object-cover opacity-90" />
                                  <div className="absolute top-3 left-3 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700/60 text-[10px] font-serif text-rose-300">{p.kanji}</div>
                                  <div className="absolute top-3 right-3 bg-slate-950/80 text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-slate-700">{p.etiqueta}</div>
                                  <div className="absolute -bottom-3 left-6 w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xl">
                                    <IconoPilar size={20} className={p.colorIcono} />
                                  </div>
                                </div>
                                <div className="p-6 pt-7 space-y-2">
                                  <span className="text-[10px] uppercase font-mono text-slate-500">{p.subtitulo}</span>
                                  <h3 className="text-lg font-bold text-white font-serif">{p.numero}. {p.titulo}</h3>
                                  <p className="text-xs text-slate-300 leading-relaxed font-light">{p.descripcion}</p>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                    </section>
                  </div>
              )}

              {/* ── PLANO CAD CON MESAS Y SILLAS REALES ── */}
              {etapaSalon === 'elegir_mesa' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-[#090b14]/90 border border-rose-500/30 p-6 rounded-3xl">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase">
                          <Compass size={15} /> Distribución y Ambientes del Salón
                        </div>
                        <h2 className="text-2xl font-black text-white font-serif mt-0.5">Plano Interactivo del Restaurante</h2>
                        <p className="text-xs text-slate-300">Selecciona tu mesa o reserva puestos contiguos en nuestra barra de sushi o barra VIP Omakase.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setEtapaSalon('landing')} className="text-xs text-slate-400 hover:text-white px-2">← Volver</button>
                        <button onClick={() => setEtapaSalon('en_mesa')} className="bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow">
                          <span>Ir a la Carta</span> <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* LIENZO PLANO */}
                      <div className="lg:col-span-8 bg-[#05070e]/95 border-2 border-slate-700/80 rounded-3xl p-6 relative overflow-x-auto shadow-2xl">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2 mb-4">
                          <span className="text-slate-500">ZONA NORTE / TERRAZA</span>
                          <span className="text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Compass size={13} /> PLANO GENERAL DE DISTRIBUCIÓN & AMBIENTES</span>
                          <span className="text-slate-500">ZONA SUR / ACCESO PRINCIPAL</span>
                        </div>

                        <div className="relative min-w-[720px] aspect-[53/38] bg-[#080b14] border-2 border-slate-600/90 rounded-2xl overflow-hidden shadow-inner">
                          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

                          {/* OUTDOOR SEATING */}
                          <div className="absolute top-0 left-[31%] right-[18%] h-[27%] border-b-2 border-dashed border-amber-500/40 p-2 text-center pointer-events-none">
                            <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center justify-center gap-1.5"><Sun size={13} /> TERRAZA EXTERIOR (PARASOLES & JARDÍN JAPONÉS)</span>
                          </div>

                          {/* COCINA */}
                          <div className="absolute top-0 left-0 w-[31%] h-[48%] border-r-2 border-b-2 border-slate-700/80 bg-slate-950/80 p-2.5 text-[9px] font-mono text-slate-400">
                            <div className="flex items-center justify-center h-28 border border-slate-800 rounded bg-slate-900/40 text-center font-bold text-slate-300">
                              <div><ChefHat size={18} className="mx-auto mb-1 text-rose-500" /> COCINA CENTRAL & ITAMAE</div>
                            </div>
                          </div>

                          {/* BAR NORMAL MUEBLE */}
                          <div style={{ left: '13%', top: '61.5%', width: '13.5%', height: '7%' }} className="absolute rounded-r-2xl border-2 border-purple-500/70 bg-purple-950/45 flex items-center justify-center pointer-events-none z-10 text-[7.5px] font-mono text-purple-300 font-bold">
                            BARRA DE SUSHI (U)
                          </div>

                          {/* DIVISIÓN SEPARADORA */}
                          <div style={{ left: '3%', top: '77%', width: '27%' }} className="absolute border-t-2 border-dashed border-amber-500/40 flex items-center justify-between text-[7px] font-mono text-amber-400/80 pt-1 pointer-events-none z-10">
                            <span>CRISTAL ACÚSTICO</span><span className="text-amber-300 font-bold">PRIVACIDAD VIP</span>
                          </div>

                          {/* RECINTO BAR VIP INDEPENDIENTE */}
                          <div style={{ left: '6%', top: '80.5%', width: '22%', height: '17%' }} className="absolute rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/30 via-slate-950/90 to-amber-950/20 p-2 pointer-events-none z-10 flex flex-col justify-between">
                            <span className="text-[7.5px] font-mono font-bold text-amber-300">👑 BARRA OMAKASE VIP (MÁX 4)</span>
                            <div className="w-full h-4 border border-amber-500/50 bg-amber-500/15 rounded flex items-center justify-center text-[7px] font-mono text-amber-200">BARRA EXCLUSIVA VIP</div>
                          </div>

                          {/* SALÓN VIP KOSHITSU */}
                          <div style={{ left: '72.5%', top: '38%', width: '9%', height: '34%' }} className="absolute border border-dashed border-rose-500/50 rounded-2xl bg-rose-950/20 p-2 text-center pointer-events-none flex flex-col justify-between z-10">
                            <span className="text-[8px] font-mono font-black text-rose-300 flex items-center justify-center gap-1"><Lock size={9} /> SALÓN PRIVADO KOSHITSU</span>
                            <span className="text-[7px] font-mono text-rose-400/80 border-y border-rose-800/30 py-0.5">Biombos Shoji</span>
                            <span className="text-[6.5px] text-slate-400">Experiencia Privada</span>
                          </div>

                          {/* RESTROOMS */}
                          <div className="absolute top-0 right-0 w-[18%] h-full border-l-2 border-slate-700/80 bg-slate-950/80 p-2 text-[9px] font-mono text-slate-400 space-y-4">
                            <div className="border border-slate-800 p-2 rounded text-center"><p className="font-bold text-slate-300">SERVICIO / STAFF</p></div>
                            <div className="border border-slate-800 p-2 rounded text-center h-[55%] flex flex-col justify-center"><p className="font-bold text-slate-300">SERVICIOS</p></div>
                          </div>

                          {/* VESTÍBULO */}
                          <div className="absolute bottom-0 left-[33%] right-[18%] h-[15%] border-t-2 border-slate-700/80 flex items-center justify-between px-6 bg-slate-900/60 text-[9px] font-mono text-slate-400">
                            <div className="border border-amber-500/50 bg-amber-950/30 px-3 py-1 rounded text-amber-300 font-bold">RECEPCIÓN / HOSTESS</div>
                            <div className="text-rose-400 font-bold flex items-center gap-1"><MapPin size={13} /> [ ENTRADA PRINCIPAL ]</div>
                          </div>

                          {/* MESAS DEL SALÓN */}
                          {MESAS_DEL_PLANO.map(m => {
                            const sel = seleccionActual?.id === m.id;
                            return (
                                <div
                                    key={m.id}
                                    onClick={() => { setSeleccionActual(m); setSillasSeleccionadas([]); }}
                                    style={{ left: `${m.left}%`, top: `${m.top}%` }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95 z-20">

                                  {m.tipo === 'parasol' && (
                                      <div className="relative flex items-center justify-center">
                                        <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-lg ${sel ? 'bg-rose-900/90 border-rose-400' : 'bg-slate-900/90 border-amber-500/70'}`}>
                                          <span className={`text-[9px] font-bold font-mono ${sel ? 'text-white' : 'text-amber-300'}`}>{m.label}</span>
                                        </div>
                                        <span className={`absolute -top-1 w-2.5 h-1 rounded-t-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                        <span className={`absolute -bottom-1 w-2.5 h-1 rounded-b-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                        <span className={`absolute -left-1 w-1 h-2.5 rounded-l-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                        <span className={`absolute -right-1 w-1 h-2.5 rounded-r-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                      </div>
                                  )}

                                  {m.tipo === 'rect-6' && (
                                      <div className="relative flex flex-col items-center">
                                        <div className="flex gap-1.5 mb-0.5">
                                          {[1, 2, 3].map(i => <span key={i} className={`w-2.5 h-1 rounded-t-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />)}
                                        </div>
                                        <div className={`w-11 h-6 rounded border flex items-center justify-center ${sel ? 'bg-rose-950 border-rose-400' : 'bg-slate-800/90 border-slate-600'}`}>
                                          <span className={`text-[8px] font-bold font-mono ${sel ? 'text-white' : 'text-slate-300'}`}>{m.label}</span>
                                        </div>
                                        <div className="flex gap-1.5 mt-0.5">
                                          {[1, 2, 3].map(i => <span key={i} className={`w-2.5 h-1 rounded-b-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />)}
                                        </div>
                                      </div>
                                  )}

                                  {m.tipo === 'rect-4' && (
                                      <div className="relative flex flex-col items-center">
                                        <div className="flex gap-2 mb-0.5">
                                          {[1, 2].map(i => <span key={i} className={`w-2.5 h-1 rounded-t-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />)}
                                        </div>
                                        <div className={`w-9 h-6 rounded border flex items-center justify-center ${sel ? 'bg-rose-950 border-rose-400' : 'bg-slate-800/90 border-slate-600'}`}>
                                          <span className={`text-[8px] font-bold font-mono ${sel ? 'text-white' : 'text-slate-300'}`}>{m.label}</span>
                                        </div>
                                        <div className="flex gap-2 mt-0.5">
                                          {[1, 2].map(i => <span key={i} className={`w-2.5 h-1 rounded-b-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />)}
                                        </div>
                                      </div>
                                  )}

                                  {m.tipo === 'redonda' && (
                                      <div className="relative flex items-center justify-center">
                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${sel ? 'bg-rose-950 border-rose-400' : 'bg-slate-800/90 border-slate-600'}`}>
                                          <span className={`text-[8px] font-bold font-mono ${sel ? 'text-white' : 'text-slate-300'}`}>{m.label}</span>
                                        </div>
                                        <span className={`absolute -top-1 w-2.5 h-1 rounded-t-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                        <span className={`absolute -bottom-1 w-2.5 h-1 rounded-b-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                        <span className={`absolute -left-1 w-1 h-2.5 rounded-l-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                        <span className={`absolute -right-1 w-1 h-2.5 rounded-r-sm ${sel ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                      </div>
                                  )}

                                  {m.tipo === 'booth-vip' && (
                                      <div className="relative flex items-center">
                                        <div className={`w-10 h-9 rounded-l-lg border-y border-l flex items-center justify-center ${sel ? 'bg-rose-950 border-rose-400 shadow-[0_0_15px_#e11d48]' : 'bg-slate-900 border-rose-700/70'}`}>
                                          <span className={`text-[7px] font-black font-mono ${sel ? 'text-white' : 'text-rose-300'}`}>{m.label}</span>
                                        </div>
                                        <div className={`w-2.5 h-11 rounded-r-md border ${sel ? 'bg-rose-600 border-rose-400' : 'bg-rose-900 border-rose-700'}`} />
                                      </div>
                                  )}

                                  {m.tipo === 'lounge' && (
                                      <div className={`w-14 h-9 rounded border flex items-center justify-center ${sel ? 'bg-rose-950 border-rose-400' : 'bg-slate-900 border-amber-600'}`}>
                                        <span className={`text-[8px] font-bold font-mono ${sel ? 'text-white' : 'text-amber-400'}`}>LOUNGE</span>
                                      </div>
                                  )}
                                </div>
                            );
                          })}

                          {/* TABURETES BAR NORMAL */}
                          {TABURETES_BARRA_NORMAL.map(t => {
                            const estaSel = sillasSeleccionadas.some(s => s.id === t.id) || (seleccionActual?.id === t.id && !seleccionActual.sillasAgrupadas);
                            return (
                                <div
                                    key={t.id}
                                    onClick={() => manejarSeleccionBar(t, TABURETES_BARRA_NORMAL)}
                                    style={{ left: `${t.left}%`, top: `${t.top}%` }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-transform hover:scale-125">
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[8px] font-bold ${estaSel ? 'bg-rose-600 text-white border-white shadow-[0_0_12px_#e11d48]' : 'bg-slate-900 text-purple-300 border-purple-500/80'}`}>
                                    {t.codigo}
                                  </div>
                                </div>
                            );
                          })}

                          {/* TABURETES BAR VIP */}
                          {TABURETES_BARRA_VIP.map(v => {
                            const estaSel = sillasSeleccionadas.some(s => s.id === v.id) || (seleccionActual?.id === v.id && !seleccionActual.sillasAgrupadas);
                            return (
                                <div
                                    key={v.id}
                                    onClick={() => manejarSeleccionBar(v, TABURETES_BARRA_VIP)}
                                    style={{ left: `${v.left}%`, top: `${v.top}%` }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-transform hover:scale-125">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[7px] font-black ${estaSel ? 'bg-amber-500 text-black border-white shadow-[0_0_14px_#f59e0b]' : 'bg-slate-900 text-amber-300 border-amber-500'}`}>
                                    {v.codigo}
                                  </div>
                                </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* PASE DE SALÓN */}
                      <div className="lg:col-span-4 bg-[#090b14]/90 border border-rose-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6 sticky top-24">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                          <div className="flex items-center gap-2">
                            <Ticket className="text-rose-400" size={20} />
                            <span className="text-xs uppercase tracking-widest font-mono font-bold text-white">DETALLE DE ASIGNACIÓN</span>
                          </div>
                          <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-0.5 rounded-full font-bold">ESPACIO SELECCIONADO</span>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-mono block">Ubicación en el Salón</span>
                            <p className="text-2xl font-black text-white font-serif">{seleccionActual.label}</p>
                            <p className="text-xs text-rose-400 font-serif font-bold">{seleccionActual.zona}</p>
                            <p className="text-xs text-slate-300 font-light">{seleccionActual.subzona}</p>
                          </div>

                          {/* SELECTOR DE SILLAS EN BARRA */}
                          {seleccionActual.esBar ? (
                              <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] text-amber-300 uppercase font-mono font-bold flex items-center gap-1"><Users size={13} /> Sillas a Reservar</span>
                                    <p className="text-[11px] text-slate-400">{seleccionActual.tipoBar === 'vip' ? '👑 Barra VIP Omakase: Hasta 4 comensales' : '🍸 Barra Principal: Hasta 6 puestos'}</p>
                                  </div>
                                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                                    <button onClick={() => cambiarCantidadSillas(-1)} disabled={cantidadSillasBar <= 1} className="text-slate-400 hover:text-white disabled:opacity-30 p-1"><Minus size={14} /></button>
                                    <span className="text-base font-black text-amber-300 font-mono px-2">{cantidadSillasBar}</span>
                                    <button onClick={() => cambiarCantidadSillas(1)} disabled={cantidadSillasBar >= (seleccionActual.tipoBar === 'vip' ? 4 : 6)} className="text-slate-400 hover:text-white disabled:opacity-30 p-1"><Plus size={14} /></button>
                                  </div>
                                </div>
                                {sillasSeleccionadas.length > 0 && (
                                    <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                                      <span className="text-slate-400">Puestos contiguos:</span>
                                      <span className="font-bold text-amber-400">{sillasSeleccionadas.map(s => s.codigo).join(' + ')}</span>
                                    </div>
                                )}
                              </div>
                          ) : (
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Capacidad</span>
                                  <p className="font-bold text-white mt-0.5">{seleccionActual.capacidad} Comensales</p>
                                </div>
                                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Servicio</span>
                                  <p className="font-bold text-amber-400 mt-0.5">Carta Abierta</p>
                                </div>
                              </div>
                          )}

                          <div className="space-y-2 text-xs text-slate-300 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
                            <p className="font-bold text-white flex items-center gap-1.5"><Check size={14} className="text-rose-400" /> Protocolo de Hospitalidad (Omotenashi):</p>
                            <p className="text-slate-400 text-[11px]">• Infusión tibia de té verde Sencha de cortesía.</p>
                            <p className="text-slate-400 text-[11px]">• Toalla húmeda tibia aromatizada (Oshibori).</p>
                            <p className="text-slate-400 text-[11px]">• Servicio prioritario y preparación artesanal al momento.</p>
                          </div>
                        </div>

                        <button
                            onClick={confirmarAsientoEnPlano}
                            className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 text-white font-black text-xs py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition">
                          <Coffee size={16} /> Confirmar {seleccionActual.esBar ? `${cantidadSillasBar}x en ${seleccionActual.zona}` : seleccionActual.label} y Ver Carta <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
              )}

              {/* ── CARTA Y COMANDA ── */}
              {etapaSalon === 'en_mesa' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-[#090b14]/90 border border-rose-500/30 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase tracking-widest text-rose-400 font-bold font-mono">{seleccionActual?.zona}</span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">{seleccionActual?.label} Abierta</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white font-serif mt-1">Experiencia Gastronómica en Tu Mesa</h2>
                        <p className="text-xs text-slate-300 max-w-xl">Elaboración artesanal al instante por nuestros maestros Itamae. Explora la carta y arma tu orden para cocina.</p>
                      </div>
                      <button onClick={() => setEtapaSalon('elegir_mesa')} className="text-xs text-slate-300 hover:text-white transition">← Cambiar Mesa</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['TODOS', 'ROLLS', 'FUERTES', 'ENTRADAS', 'BEBIDAS', 'POSTRES'].map(cat => (
                          <button
                              key={cat}
                              onClick={() => setCategoriaCarta(cat)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${categoriaCarta === cat ? 'bg-rose-600 text-white shadow-lg shadow-rose-950' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'}`}>
                            {cat}
                          </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* CARTA DE PLATOS */}
                      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {platosVisibles.map(plato => {
                          const meta = resolverMetaPlato(plato);
                          const cant = comandaMesa.find(it => it.id === plato?.id)?.cantidad || 0;
                          return (
                              <div key={plato?.id} className="bg-slate-900/85 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
                                <div className="relative h-48 w-full bg-slate-800">
                                  <img src={meta.foto} alt={plato?.nombre} className="w-full h-full object-cover" />
                                  <div className="absolute top-3 left-3 bg-[#07080d]/85 px-3 py-1 rounded-full border border-slate-700/60 text-[10px] font-serif text-rose-300">{meta.jp}</div>
                                  <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">{meta.etiqueta}</div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                  <div>
                                    <h4 className="font-bold text-base text-white font-serif mb-1">{plato?.nombre}</h4>
                                    <p className="text-xs text-slate-300 line-clamp-2 mb-2 font-light">{plato?.descripcion}</p>
                                    <p className="text-[10px] text-slate-400 font-mono mb-4">🥢 {meta.ingredientes}</p>
                                  </div>
                                  <div className="flex justify-between items-center pt-3.5 border-t border-slate-800">
                                    <span className="text-base font-black text-white">${Number(plato?.precio || 0).toLocaleString('es-CO')}</span>
                                    {cant > 0 ? (
                                        <div className="flex items-center gap-2 bg-rose-950 border border-rose-700 px-2 py-1 rounded-xl">
                                          <button onClick={() => setComandaMesa(comandaMesa.map(i => i.id === plato?.id ? { ...i, cantidad: i.cantidad - 1 } : i).filter(i => i.cantidad > 0))} className="text-rose-300 p-1"><Minus size={13} /></button>
                                          <span className="font-mono font-bold text-xs text-white px-1">{cant}</span>
                                          <button onClick={() => setComandaMesa(comandaMesa.map(i => i.id === plato?.id ? { ...i, cantidad: i.cantidad + 1 } : i))} className="text-rose-300 p-1"><Plus size={13} /></button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setComandaMesa([...comandaMesa, { ...plato, cantidad: 1 }])} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                                          <PlusCircle size={14} /> Añadir
                                        </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                          );
                        })}
                      </div>

                      {/* COMANDA EN MESA */}
                      <div className="lg:col-span-4 bg-[#090b14]/90 border border-slate-800 p-6 md:p-7 rounded-3xl backdrop-blur-xl shadow-2xl h-fit space-y-5 sticky top-24">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="font-bold text-sm text-white flex items-center gap-2"><ShoppingBag size={18} className="text-rose-400" /> Tu Comanda · {seleccionActual.label}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{comandaMesa.reduce((acc, it) => acc + it.cantidad, 0)} ítems</span>
                        </div>

                        {comandaMesa.length === 0 ? (
                            <div className="text-center py-10 px-4 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                              <ShoppingBag className="mx-auto text-slate-600 mb-2" size={32} />
                              <p className="text-xs font-bold text-slate-300">Tu comanda está vacía</p>
                              <p className="text-[11px] text-slate-500 mt-1">Añade especialidades de la carta para enviarlas a cocina.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                              {comandaMesa.map(it => (
                                  <div key={it.id} className="flex justify-between items-center text-xs bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                                    <div>
                                      <p className="font-bold text-white">{it.nombre}</p>
                                      <p className="text-slate-400 text-[10px]">${Number(it.precio).toLocaleString('es-CO')} c/u</p>
                                    </div>
                                    <span className="font-black text-rose-400 text-xs">${Number(it.precio * it.cantidad).toLocaleString('es-CO')}</span>
                                  </div>
                              ))}
                            </div>
                        )}

                        {comandaMesa.length > 0 && (
                            <div className="pt-3 border-t border-slate-800 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-300">Total de la Orden:</span>
                                <span className="text-2xl font-black text-white">${totalComanda.toLocaleString('es-CO')}</span>
                              </div>
                              <button
                                  onClick={enviarPedidoACocina}
                                  className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-black text-xs py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
                                <UtensilsCrossed size={16} /> Confirmar y Enviar Pedido a Cocina
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              )}
            </main>
        )}

        {/* ══════════════════════════════════════════════════════════════════
          MÓDULO 2: PANEL DE MESERO (CUENTAS, COBROS, RESERVAS & PARQUEADERO)
          ══════════════════════════════════════════════════════════════════ */}
        {moduloActual === 'mesero' && (
            <main className="relative z-10 w-full px-4 md:px-8 lg:px-14 py-8 space-y-8">
              <div className="flex justify-between items-center bg-[#090b14]/90 border border-blue-500/30 p-6 rounded-3xl shadow-2xl">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase">👔 SERVICIO DE SALÓN & ATENCIÓN A MESAS</span>
                  <h2 className="text-2xl font-black text-white font-serif mt-1">Control de Mesas, Cuentas & Estacionamiento</h2>
                </div>
                <button onClick={() => sincronizarDatos()} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                  <RefreshCw size={13} /> Refrescar
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  {/* CUENTAS EN CURSO */}
                  <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="font-bold text-white text-base flex items-center gap-2"><Receipt size={18} className="text-blue-400" /> Cuentas Activas en Mesa</h3>
                    {listaCuentas.length === 0 ? (
                        <p className="text-xs text-slate-500 py-6 text-center">No hay cuentas abiertas en este momento. Al asignar una mesa en el salón se iniciará el servicio.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {listaCuentas.map(cta => (
                              <div key={cta?.id || Math.random()} className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="font-black text-sm text-white">Mesa #{mesaNumeroSegura(cta)} · Cuenta #{cta?.id}</span>
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${cta?.estado === 'ABIERTA' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>{cta?.estado || 'ABIERTA'}</span>
                                </div>
                                <div className="text-xs text-slate-300 flex justify-between">
                                  <span>Total Acumulado:</span>
                                  <span className="font-bold text-white">${Number(cta?.total || 0).toLocaleString('es-CO')}</span>
                                </div>
                                <div className="flex gap-2 pt-2 border-t border-slate-800">
                                  {cta?.estado === 'ABIERTA' && (
                                      <button onClick={() => solicitarCuenta(cta?.id)} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-1.5 rounded-xl">Pedir Cuenta</button>
                                  )}
                                  <button onClick={() => pagarCuenta(cta?.id, 'TARJETA')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 rounded-xl">Cobrar y Liberar</button>
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>

                  {/* RESERVAS Y CHECK-IN */}
                  <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
                    <h3 className="font-bold text-white text-base flex items-center gap-2"><CalendarCheck size={18} className="text-emerald-400" /> Recepción de Reservas & Registro de Llegada</h3>
                    <div className="space-y-2">
                      {listaReservas.map(r => (
                          <div key={r?.id || Math.random()} className="flex justify-between items-center bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs">
                            <div>
                              <p className="font-bold text-white">{clienteNombreSeguro(r)} ({r?.personas || 2} pers.)</p>
                              <p className="text-slate-400 font-mono text-[11px]">Reserva #{r?.id} · Mesa {mesaNumeroSegura(r)} · {r?.hora || '19:30'} · Estado: {r?.estado || 'CONFIRMADA'}</p>
                            </div>
                            {r?.estado !== 'LLEGADA' ? (
                                <button onClick={() => registrarLlegadaReserva(r?.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl">✓ Registrar Llegada</button>
                            ) : (
                                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800">En Mesa</span>
                            )}
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PARQUEADERO */}
                <div className="lg:col-span-4 bg-slate-900/85 border border-slate-800 p-6 rounded-3xl space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2"><Car size={18} className="text-blue-400" /> Estacionamiento de Clientes</h3>
                    <p className="text-xs text-slate-400">Control de disponibilidad y liquidación del servicio vehicular.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <p className="text-2xl font-black text-emerald-400 font-mono">{parqueadero?.cuposDisponibles ?? 12}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-mono mt-1">Cupos Libres</p>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <p className="text-2xl font-black text-amber-400 font-mono">{parqueadero?.vehiculosDentro ?? 8}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-mono mt-1">Ocupados</p>
                    </div>
                  </div>

                  {/* Entrada */}
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block">Registrar Entrada de Vehículo</span>
                    <input
                        type="text"
                        placeholder="Placa ej: ABC-123"
                        value={placaEntrada}
                        onChange={(e) => setPlacaEntrada(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-white uppercase font-mono"
                    />
                    <div className="flex gap-2">
                      {['AUTO', 'MOTO'].map(t => (
                          <button key={t} onClick={() => setTipoVehiculo(t)} className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${tipoVehiculo === t ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>{t}</button>
                      ))}
                    </div>
                    <button onClick={registrarEntradaVehiculo} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl">Ingresar Vehículo</button>
                  </div>

                  {/* Salida */}
                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block">Salida & Liquidación de Parqueadero</span>
                    <input
                        type="text"
                        placeholder="Placa ej: ABC-123"
                        value={placaSalida}
                        onChange={(e) => setPlacaSalida(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-xs text-white uppercase font-mono"
                    />
                    <button onClick={registrarSalidaVehiculo} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl">Liquidar y Liberar Cupo</button>
                  </div>
                </div>
              </div>
            </main>
        )}

        {/* ══════════════════════════════════════════════════════════════════
          MÓDULO 3: PANTALLA DE COCINA KDS (COCINERO / COCINERA)
          ══════════════════════════════════════════════════════════════════ */}
        {moduloActual === 'cocina' && (
            <main className="relative z-10 w-full px-4 md:px-8 lg:px-14 py-8 space-y-8">
              <div className="flex justify-between items-center bg-[#090b14]/90 border border-amber-500/30 p-6 rounded-3xl">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5"><ChefHat size={16} /> MONITOR KDS DE COCINA · LÍNEA DE PREPARACIÓN</span>
                  <h2 className="text-2xl font-black text-white font-serif mt-1">Tablero de Preparación en Vivo</h2>
                </div>
                <button onClick={() => sincronizarDatos()} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                  <RefreshCw size={13} /> Refrescar Comandas
                </button>
              </div>

              {/* KANBAN KDS EN VIVO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. RECIBIDO */}
                <div className="bg-slate-900/80 border border-blue-900/50 p-5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-sm">📥 Comandas Recibidas</h3>
                    <span className="text-xs font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-bold">
                  {listaPedidos.filter(p => p?.estado === 'RECIBIDO').length}
                </span>
                  </div>
                  <div className="space-y-3">
                    {listaPedidos.filter(p => p?.estado === 'RECIBIDO').map(ped => (
                        <div key={ped?.id || Math.random()} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                          <span className="font-bold text-white text-xs block">Comanda #{ped?.id} · Mesa #{mesaNumeroSegura(ped)}</span>
                          <div className="text-xs text-slate-300 space-y-1">
                            {normalizarArray(ped?.items).map((it, idx) => (
                                <div key={idx}><strong>{it?.cantidad || 1}x</strong> {nombrePlatoSeguro(it)}</div>
                            ))}
                          </div>
                          <button onClick={() => cambiarEstadoCocina(ped?.id, 'EN_PREPARACION')} className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 rounded-xl">➔ Empezar a Preparar</button>
                        </div>
                    ))}
                  </div>
                </div>

                {/* 2. EN PREPARACIÓN */}
                <div className="bg-slate-900/80 border border-amber-900/50 p-5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-sm">🔥 En Preparación</h3>
                    <span className="text-xs font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">
                  {listaPedidos.filter(p => p?.estado === 'EN_PREPARACION').length}
                </span>
                  </div>
                  <div className="space-y-3">
                    {listaPedidos.filter(p => p?.estado === 'EN_PREPARACION').map(ped => (
                        <div key={ped?.id || Math.random()} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                          <span className="font-bold text-white text-xs block">Comanda #{ped?.id} · Mesa #{mesaNumeroSegura(ped)}</span>
                          <div className="text-xs text-slate-300 space-y-1">
                            {normalizarArray(ped?.items).map((it, idx) => (
                                <div key={idx}><strong>{it?.cantidad || 1}x</strong> {nombrePlatoSeguro(it)}</div>
                            ))}
                          </div>
                          <button onClick={() => cambiarEstadoCocina(ped?.id, 'LISTO')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl">✓ Marcar como Listo</button>
                        </div>
                    ))}
                  </div>
                </div>

                {/* 3. LISTOS */}
                <div className="bg-slate-900/80 border border-emerald-900/50 p-5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-sm">🛎️ Listos para Servir</h3>
                    <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  {listaPedidos.filter(p => p?.estado === 'LISTO').length}
                </span>
                  </div>
                  <div className="space-y-3">
                    {listaPedidos.filter(p => p?.estado === 'LISTO').map(ped => (
                        <div key={ped?.id || Math.random()} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                          <span className="font-bold text-white text-xs block">Comanda #{ped?.id} · Mesa #{mesaNumeroSegura(ped)}</span>
                          <div className="text-xs text-slate-300 space-y-1">
                            {normalizarArray(ped?.items).map((it, idx) => (
                                <div key={idx}><strong>{it?.cantidad || 1}x</strong> {nombrePlatoSeguro(it)}</div>
                            ))}
                          </div>
                          <button onClick={() => cambiarEstadoCocina(ped?.id, 'ENTREGADO')} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-xl">🍽️ Servir en Mesa</button>
                        </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CONTROL DE STOCK Y AGOTADOS */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2"><AlertCircle size={18} className="text-amber-400" /> Disponibilidad de Platos & Control de Carta</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {listaMenu.map(p => (
                      <div key={p?.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2 text-xs">
                        <span className="font-bold text-white truncate">{p?.nombre}</span>
                        <button
                            onClick={() => toggleDisponibilidadPlato(p?.id, p?.disponible !== false)}
                            className={`w-full py-1.5 rounded-xl font-mono text-[10px] font-bold border transition ${p?.disponible !== false ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-red-950 text-red-300 border-red-800'}`}>
                          {p?.disponible !== false ? '✓ Disponible' : '✕ Agotado'}
                        </button>
                      </div>
                  ))}
                </div>
              </div>
            </main>
        )}

        {/* ══════════════════════════════════════════════════════════════════
          MÓDULO 4: PANEL DE GERENCIA (REPORTES, MENÚ & TRAZABILIDAD)
          ══════════════════════════════════════════════════════════════════ */}
        {moduloActual === 'gerente' && (
            <main className="relative z-10 w-full px-4 md:px-8 lg:px-14 py-8 space-y-8">
              <div className="flex justify-between items-center bg-[#090b14]/90 border border-purple-500/30 p-6 rounded-3xl">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase">👑 PANEL DE CONTROL EJECUTIVO · GERENCIA</span>
                  <h2 className="text-2xl font-black text-white font-serif mt-1">Métricas de Desempeño, Menú & Trazabilidad de Servicio</h2>
                </div>
                <button onClick={() => sincronizarDatos()} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5">
                  <RefreshCw size={13} /> Actualizar
                </button>
              </div>

              {/* REPORTES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>Ingresos Totales del Servicio</span>
                    <DollarSign size={16} className="text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black text-white font-serif">
                    ${(listaCuentas.reduce((acc, c) => acc + (Number(c?.total) || 0), 2840000)).toLocaleString('es-CO')}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono">✓ Conciliación y balance en tiempo real</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>Comandas Procesadas</span>
                    <TrendingUp size={16} className="text-blue-400" />
                  </div>
                  <p className="text-3xl font-black text-white font-serif">{listaPedidos.length}</p>
                  <p className="text-[10px] text-blue-400 font-mono">Tiempo promedio cocina: 14 min</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>Especialidades Más Populares</span>
                    <Award size={16} className="text-amber-400" />
                  </div>
                  <p className="text-xl font-bold text-amber-300 font-serif">1. Dragon Roll Flambé</p>
                  <p className="text-[10px] text-slate-400 font-mono">2. Tonkotsu Ramen · 3. Spicy Tartare</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* CREAR PLATO EN CARTA */}
                <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2"><PlusCircle size={18} className="text-purple-400" /> Incorporar Nueva Creación a la Carta</h3>
                  <form onSubmit={crearNuevoPlato} className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Nombre del Plato</label>
                      <input type="text" placeholder="ej. Nigiri Wagyu A5" value={nuevoPlato.nombre} onChange={(e) => setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })} className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Precio (COP)</label>
                      <input type="number" placeholder="ej. 42000" value={nuevoPlato.precio} onChange={(e) => setNuevoPlato({ ...nuevoPlato, precio: e.target.value })} className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Categoría</label>
                      <select value={nuevoPlato.categoria} onChange={(e) => setNuevoPlato({ ...nuevoPlato, categoria: e.target.value })} className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-white">
                        <option>Rolls de Autor</option><option>Platos Fuertes</option><option>Entradas</option><option>Bebidas & Sake</option><option>Postres</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Descripción</label>
                      <textarea placeholder="Ingredientes y técnica..." value={nuevoPlato.descripcion} onChange={(e) => setNuevoPlato({ ...nuevoPlato, descripcion: e.target.value })} className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-xl text-white h-20" />
                    </div>
                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl">Publicar en la Carta del Menú</button>
                  </form>

                  {/* LISTADO DE PLATOS */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Platos Vigentes en la Carta</span>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                      {listaMenu.map(p => (
                          <div key={p?.id} className="flex justify-between items-center bg-slate-950 p-2 rounded-xl text-xs border border-slate-800/80">
                            <span className="truncate">{p?.nombre}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-purple-300 font-bold">${Number(p?.precio || 0).toLocaleString('es-CO')}</span>
                              <button onClick={() => eliminarPlato(p?.id)} className="text-slate-500 hover:text-red-400 p-1"><Trash2 size={13} /></button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TRAZABILIDAD Y AUDITORÍA DE PEDIDOS */}
                <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2"><Database size={18} className="text-emerald-400" /> Trazabilidad Operativa y Tiempos de Servicio</h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Trazabilidad en Vivo</span>
                  </div>
                  <p className="text-xs text-slate-400">Selecciona cualquier pedido para auditar sus etapas de preparación y tiempos de servicio:</p>
                  <div className="flex gap-2 flex-wrap">
                    {listaPedidos.slice(0, 6).map(p => (
                        <button
                            key={p?.id}
                            onClick={() => consultarHistorialMongo(p?.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition ${pedidoAuditado === p?.id ? 'bg-purple-950 text-purple-300 border-purple-600' : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'}`}>
                          Seguimiento Orden #{p?.id}
                        </button>
                    ))}
                  </div>

                  {listaHistorial.length > 0 ? (
                      <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs">
                        <div className="text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-800">Línea de tiempo de la Comanda #{pedidoAuditado}:</div>
                        {listaHistorial.map((ev, i) => (
                            <div key={i} className="flex justify-between border-b border-slate-800/60 pb-1.5 pt-1">
                              <span className="text-slate-400">{String(ev?.fechaHora || '16:32:05')}</span>
                              <span className="text-amber-400 font-bold">{String(ev?.estadoAnterior || 'RECIBIDO')} ➔ {String(ev?.estadoNuevo || 'PREPARANDO')}</span>
                              <span className="text-emerald-400">Usuario: {String(ev?.usuarioModificador || 'mesero')}</span>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
                        Selecciona una orden arriba para visualizar su historial de estados y tiempos de preparación.
                      </div>
                  )}
                </div>
              </div>
            </main>
        )}

        {/* ── FOOTER DE BORDE A BORDE ── */}
        <footer className="relative z-10 w-full bg-[#07080d]/95 border-t border-slate-800/60 py-6 px-6 md:px-14 text-center text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">Sakura Sushi 桜 鮨</span>
              <span>·</span>
              <span>Alta Gastronomía Japonesa · Maestría Shokunin & Hospitalidad Omotenashi</span>
            </div>
            <p>© {new Date().getFullYear()} Sakura Sushi Bar · Diseñado y Desarrollado por Daniel Mosquera. Todos los derechos reservados.</p>
          </div>
        </footer>

      </div>
  );
}

export default function App() {
  return (
      <ErrorBoundary>
        <SakuraApp />
      </ErrorBoundary>
  );
}