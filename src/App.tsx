import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Info, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { generateIconPng } from './utils/iconGenerator';
import { sedes } from './data/sedes';

interface SignatureData {
  nombre: string;
  apellidos: string;
  cargo: string;
  sedeId: string;
  sede: string;
  telefono: string;
  email: string;
  direccion: string;
  comuna: string;
  region: string;
  logoUrl: string;
}

export default function App() {
  const [data, setData] = useState<SignatureData>({
    nombre: 'NOMBRE',
    apellidos: 'APELLIDO APELLIDO',
    cargo: 'Nombre cargo',
    sedeId: 'san-joaquin',
    sede: 'Sede San Joaquín',
    telefono: '(56 2) 1234 5678',
    email: 'mail@duoc.cl',
    direccion: 'Av. Vicuña Mackenna 4917',
    comuna: 'San Joaquín',
    region: 'Región Metropolitana',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Logo_DuocUC.svg/960px-Logo_DuocUC.svg.png'
  });

  const [icons, setIcons] = useState({
    phone: '',
    mail: '',
    mapPin: ''
  });

  const [copied, setCopied] = useState(false);
  const signatureRef = useRef<HTMLDivElement>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSedeOpen, setIsSedeOpen] = useState(false);
  const [sedeSearch, setSedeSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSedeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadIcons = async () => {
      const phone = await generateIconPng('phone');
      const mail = await generateIconPng('mail');
      const mapPin = await generateIconPng('map-pin');
      setIcons({ phone, mail, mapPin });
    };
    loadIcons();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'sedeId') {
      const selectedSede = sedes.find(s => s.id === value);
      if (selectedSede) {
        setData({
          ...data,
          sedeId: value,
          sede: selectedSede.nombre,
          direccion: selectedSede.direccion,
          comuna: selectedSede.comuna,
          region: selectedSede.region
        });
      }
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleCopy = async () => {
    if (!signatureRef.current) return;
    
    try {
      const html = signatureRef.current.innerHTML;
      const blob = new Blob([html], { type: 'text/html' });
      const clipboardData = [new ClipboardItem({ 'text/html': blob })];
      await navigator.clipboard.write(clipboardData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy signature: ', err);
      alert('Error al copiar la firma. Intenta seleccionarla y copiarla manualmente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#002855]">Generador de Firmas Duoc UC</h1>
          <p className="text-gray-600 mt-2">Completa tus datos para generar la firma estandarizada para tu correo.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Tus Datos</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" name="nombre" value={data.nombre} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                  <input type="text" name="apellidos" value={data.apellidos} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" name="cargo" value={data.cargo} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all" />
              </div>

              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sede / Campus</label>
                <div 
                  className="w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer flex justify-between items-center focus:ring-2 focus:ring-[#FDB913] transition-all"
                  onClick={() => setIsSedeOpen(!isSedeOpen)}
                >
                  <span className="truncate">{data.sede || 'Selecciona una sede'}</span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${isSedeOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isSedeOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
                      <Search size={16} className="text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar sede..." 
                        className="w-full bg-transparent text-sm outline-none"
                        value={sedeSearch}
                        onChange={(e) => setSedeSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    </div>
                    <div className="overflow-y-auto flex-grow">
                      {sedes.filter(s => s.nombre.toLowerCase().includes(sedeSearch.toLowerCase())).map(sede => (
                        <div 
                          key={sede.id} 
                          className={`p-2 hover:bg-blue-50 cursor-pointer text-sm ${data.sedeId === sede.id ? 'bg-blue-50 font-medium text-[#002855]' : 'text-gray-700'}`}
                          onClick={() => {
                            setData({
                              ...data,
                              sedeId: sede.id,
                              sede: sede.nombre,
                              direccion: sede.direccion,
                              comuna: sede.comuna,
                              region: sede.region
                            });
                            setIsSedeOpen(false);
                            setSedeSearch('');
                          }}
                        >
                          {sede.nombre}
                        </div>
                      ))}
                      {sedes.filter(s => s.nombre.toLowerCase().includes(sedeSearch.toLowerCase())).length === 0 && (
                        <div className="p-3 text-sm text-gray-500 text-center">No se encontraron sedes</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="text" name="telefono" value={data.telefono} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={data.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all" />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-[#002855] font-medium flex items-center gap-1 hover:underline focus:outline-none"
                >
                  {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showAdvanced ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas'}
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <input type="text" name="direccion" value={data.direccion} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all text-xs" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                      <input type="text" name="comuna" value={data.comuna} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all text-xs" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
                      <input type="text" name="region" value={data.region} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all text-xs" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo (Opcional)</label>
                    <input type="text" name="logoUrl" value={data.logoUrl} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB913] focus:border-transparent outline-none transition-all text-xs" />
                    <p className="text-xs text-gray-500 mt-1">Si el logo no carga, puedes pegar aquí la URL de otra imagen.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h2 className="text-xl font-semibold text-gray-800">Vista Previa</h2>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-[#002855] text-white hover:bg-[#001f40]'}`}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? '¡Copiada!' : 'Copiar Firma'}
                </button>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 flex-grow flex items-center justify-center overflow-x-auto">
                {/* Signature Container */}
                <div ref={signatureRef} className="bg-white p-6 shadow-sm" style={{ minWidth: '600px' }}>
                  {/* The actual HTML signature */}
                  <table cellPadding="0" cellSpacing="0" border={0} style={{ fontFamily: 'Arial, sans-serif', color: '#000000', width: '600px', backgroundColor: '#ffffff', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        {/* Left Column */}
                        <td width="220" valign="top" style={{ paddingRight: '20px', paddingBottom: '20px' }}>
                          {/* duoc.cl pill */}
                          <table cellPadding="0" cellSpacing="0" border={0} style={{ marginBottom: '20px' }}>
                            <tbody>
                              <tr>
                                <td width="20" valign="middle">
                                  <div style={{ backgroundColor: '#000000', borderRadius: '50%', width: '20px', height: '20px' }}></div>
                                </td>
                                <td style={{ paddingLeft: '8px', verticalAlign: 'middle' }}>
                                  <div style={{ border: '1px solid #000000', borderRadius: '12px', padding: '4px 12px', fontWeight: 'bold', fontSize: '14px', lineHeight: '1', display: 'inline-block' }}>duoc.cl</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          
                          {/* Sede */}
                          <div style={{ fontSize: '14px', marginBottom: '20px', lineHeight: '1.4' }}>
                            <strong>Sede</strong><br/>
                            {data.sede || 'Nombre sede'}
                          </div>
                          
                          {/* Logo */}
                          {data.logoUrl ? (
                            <img src={data.logoUrl} width="150" alt="Duoc UC" style={{ display: 'block', maxWidth: '150px' }} />
                          ) : null}
                        </td>
                        
                        {/* Right Column */}
                        <td width="360" valign="top" style={{ paddingLeft: '20px', paddingBottom: '20px', borderLeft: '1px solid #e5e5e5' }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px', color: '#000000' }}>
                            {data.nombre} {data.apellidos}
                          </div>
                          <div style={{ fontSize: '14px', marginBottom: '5px', color: '#000000' }}>
                            {data.cargo || 'Nombre cargo'}
                          </div>
                          <div style={{ width: '30px', height: '3px', backgroundColor: '#FDB913', marginBottom: '15px' }}></div>
                          
                          <table cellPadding="0" cellSpacing="0" border={0} style={{ fontSize: '13px', color: '#000000' }}>
                            <tbody>
                              <tr>
                                <td width="24" height="24" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                  {icons.phone ? <img src={icons.phone} width="24" height="24" alt="Phone" style={{ display: 'block' }} /> : null}
                                </td>
                                <td style={{ paddingLeft: '10px', paddingBottom: '5px', verticalAlign: 'middle' }}>
                                  {data.telefono || '(56 2) 1234 5678'}
                                </td>
                              </tr>
                              <tr>
                                <td width="24" height="24" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                  {icons.mail ? <img src={icons.mail} width="24" height="24" alt="Email" style={{ display: 'block' }} /> : null}
                                </td>
                                <td style={{ paddingLeft: '10px', paddingBottom: '5px', verticalAlign: 'middle' }}>
                                  <a href={`mailto:${data.email}`} style={{ color: '#000000', textDecoration: 'none' }}>{data.email || 'mail@duoc.cl'}</a>
                                </td>
                              </tr>
                              <tr>
                                <td width="24" height="24" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                  {icons.mapPin ? <img src={icons.mapPin} width="24" height="24" alt="Location" style={{ display: 'block' }} /> : null}
                                </td>
                                <td style={{ paddingLeft: '10px', verticalAlign: 'middle' }}>
                                  {[data.direccion, data.comuna, data.region].filter(Boolean).join(' - ') || 'Dirección - Comuna - Región'}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        
                        {/* Yellow Right Border */}
                        <td width="20" bgcolor="#FDB913" style={{ backgroundColor: '#FDB913', width: '20px' }}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 p-4 rounded-md flex items-start gap-3 text-sm text-blue-800">
                <Info className="flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold mb-1">¿Cómo instalar tu firma en Gmail?</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Haz clic en el botón <strong>"Copiar Firma"</strong>.</li>
                    <li>Abre Gmail y ve a <strong>Configuración</strong> (el ícono de engranaje) {'>'} <strong>Ver todos los ajustes</strong>.</li>
                    <li>Baja hasta la sección <strong>Firma</strong> y crea una nueva.</li>
                    <li>Pega (Ctrl+V o Cmd+V) la firma en el cuadro de texto.</li>
                    <li>Guarda los cambios al final de la página.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
