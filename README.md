# Sakura Sushi - Frontend Restaurante Full Stack

Proyecto web desarrollado para la gestión operativa y de cara al cliente de un restaurante de alta cocina japonesa. La solución implementa una arquitectura desacoplada conectada a una API REST en Spring Boot, integrando almacenamiento relacional con PostgreSQL y almacenamiento no relacional con MongoDB para auditoría y trazabilidad.

---

## Enlaces del Proyecto

* Repositorio Frontend: https://github.com/Danielmmartinez/SakuraSushi-Front
* Repositorio Backend: https://github.com/Danielmmartinez/restaurante
* Video Demostrativo: [demo-sakura-sushi.mp4](./demo-sakura-sushi.mp4)

---

## Demostración en Video del Sistema

* Archivo local en repositorio: [Ver / Descargar demo-sakura-sushi.mp4](./demo-sakura-sushi.mp4)
* Enlace directo en GitHub: https://github.com/Danielmmartinez/SakuraSushi-Front/raw/main/demo-sakura-sushi.mp4

### Contenido Demostrado en el Video

1. Modulo Salon y Carta:
   * Visualizacion de la carta de platos con precios, ingredientes y categorias.
   * Navegacion en el plano interactivo de distribucion (mesas de salon, terraza exterior y cabinas privadas VIP Koshitsu).
   * Seleccion y agrupamiento de puestos contiguos en la barra principal y barra VIP.
   * Apertura de comanda en tiempo real y transmision hacia cocina.

2. Modulo de Servicio (Mesero):
   * Visualizacion y seguimiento de cuentas activas por mesa.
   * Solicitud de cobro y liquidacion con liberacion automatica del espacio.
   * Verificacion y Check-In de llegadas de clientes con reserva confirmada.
   * Registro de entrada vehicular por placa y liquidacion tarifaria de estacionamiento.

3. Modulo de Cocina KDS (Cocinero):
   * Tablero Kanban operativo en tiempo real: Comandas Recibidas, En Preparacion y Listos para Servir.
   * Transicion secuencial de estados de preparacion.
   * Conmutacion de disponibilidad de platos (disponible / agotado).

4. Modulo Ejecutivo (Gerencia General):
   * Balance de ingresos acumulados del servicio y total de comandas procesadas.
   * Identificacion de las especialidades mas vendidas.
   * Creacion y publicacion de nuevos platos en la carta (Spring Data JPA).
   * Consulta de la linea de tiempo cronologica y auditoria de estados de pedidos (MongoDB).

---

## Modulos y Funcionalidades de la Plataforma

### 1. Salon y Experiencia de Cliente
* Plano Interactivo: Distribucion a escala con 24 mesas individuales y compartidas con identificadores unicos.
* Sistema de Barra: Algoritmo de seleccion contigua para reservar de 1 a 6 taburetes en barra general o hasta 4 en barra VIP Omakase.
* Menu Gastronomico: Filtros por tipo de producto (Rolls de Autor, Platos Fuertes, Entradas, Bebidas y Postres).
* Gestion de Comanda: Adicion dinamica de items con actualizacion automatica del total a pagar.

### 2. Panel de Servicio de Salon (Mesero)
* Control de Cuentas: Monitoreo de consumos abiertos, montos acumulados y estados de facturacion.
* Cobro y Cierre: Registro de pago y liberacion inmediata de la mesa en el sistema.
* Gestion de Reservas: Confirmacion de asistencia de comensales e inicio de servicio en mesa.
* Control de Parqueadero: Registro de ingreso (auto / moto), conteo de cupos disponibles y liquidacion por tiempo de permanencia.

### 3. Pantalla de Cocina KDS (Cocinero)
* Flujo de Preparacion Kanban:
  * Recibido: Pedidos ingresados desde las mesas.
  * En Preparacion: Comandas en proceso de elaboracion.
  * Listo: Platos listos para ser llevados a mesa.
* Control de Carta: Habilitacion o bloqueo de platos agotados para evitar pedidos de recetas no disponibles.

### 4. Panel de Control Ejecutivo (Gerencia)
* Indicadores de Desempeño: Metricas financieras y volumen de ordenes gestionadas.
* Administracion de Menu: Formulario para crear platos (nombre, precio, categoria y descripcion) y eliminacion de recetas obsoletas.
* Trazabilidad y Auditoria: Consulta detallada de cambios de estado, usuarios modificadores y marcas de tiempo por cada pedido.

---

## Usuarios Demo y Credenciales de Acceso

La aplicacion incluye un selector de perfiles para verificar el comportamiento de cada rol operativo:

| Rol | Perfil / Cargo | Correo Electronico | Contraseña | Alcance Operativo |
| --- | --- | --- | --- | --- |
| Mesero | Mesero de Salon | mesero@sakura.com | Mesero123! | Comandas, cuentas, reservas y parqueadero |
| Cocinero | Chef de Cocina | cocinero@sakura.com | Cocinero123! | Monitor KDS y control de stock de platos |
| Gerente | Gerente General | gerente@sakura.com | Gerente123! | Metricas, edicion de carta y trazabilidad |
| Cliente | Cliente Comensal | cliente@sakura.com | Cliente123! | Consulta de carta y eleccion de mesas |

---

## Tecnologias Empleadas

### Frontend
* React 19 (19.3.1)
* Vite 8 (8.3.5)
* Tailwind CSS 3
* Lucide React 1.66
* Error Boundary nativo de React para tolerancia a fallos

### Backend y Persistencia
* Java 17+ / 21
* Spring Boot 3.3
* Spring Security con autenticacion basada en tokens JWT
* PostgreSQL (persistencia relacional para mesas, platos, pedidos, cuentas, reservas y parqueadero)
* MongoDB (persistencia no relacional para auditoria y eventos historicos de pedidos)

---

## Instrucciones de Instalacion y Ejecucion

### Requisitos Previos
* Node.js version 18.0 o superior
* Gestor de paquetes npm version 9.0 o superior
* Backend Spring Boot activo en http://127.0.0.1:8080 (opcional; el frontend opera con datos defensivos de respaldo si la API no se encuentra en ejecucion)

### Pasos de Puesta en Marcha

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Danielmmartinez/SakuraSushi-Front.git
   cd SakuraSushi-Front/sakura-sushi-front
   ```

2. Instalar dependencias del proyecto:
   ```bash
   npm install
   ```

3. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```
   http://localhost:5173
   ```

5. Compilacion de produccion (opcional):
   ```bash
   npm run build
   npm run preview
   ```

---

## Configuracion del Proxy en Desarrollo

El archivo vite.config.js redirige las solicitudes dirigidas a /api hacia el servidor de backend en el puerto 8080:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

---
