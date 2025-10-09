# 🎵 Rondalla Tec Veracruz - API REST

**Sistema de gestión de repertorio musical para la Rondalla del Tecnológico de Veracruz**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints](#-endpoints)
- [Modelos de Datos](#-modelos-de-datos)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Contribuir](#-contribuir)

---

## ✨ Características

### 🎼 Gestión Completa del Repertorio
- **30+ canciones reales** del repertorio de la Rondalla
- Clasificación por **nivel de dificultad** (fácil, medio, difícil)
- Organización de **voces por rango** (6 rangos: aguda, segunda aguda, media aguda, media, media grave, grave)
- Gestión de **pistas instrumentales** (guitarra base, guitarra requinto, bajo)

### 🔍 Búsquedas Avanzadas
- Búsqueda **multi-criterio** (nivel + voz + instrumento + texto + etiqueta)
- Filtros específicos por nivel de dificultad
- Búsqueda por rango vocal
- Búsqueda por tipo de instrumento
- Búsqueda por participación de miembros

### 📊 Análisis y Estadísticas
- Resumen general del repertorio
- Distribución de canciones por nivel
- Cobertura de voces por canción
- Análisis de participaciones por miembro
- Canciones más completas
- Distribución de instrumentos

### 👥 Gestión de Miembros
- CRUD completo de miembros
- Roles y asignación de instrumentos
- Estado activo/inactivo
- Búsqueda y filtrado

### 📚 Materiales de Práctica
- Gestión de pistas de práctica
- Clasificación por tipo (voz, instrumentos, teoría)
- Vinculación con canciones
- Sistema de etiquetas

### ⚙️ Características Técnicas
- **API RESTful** con arquitectura limpia
- **Validaciones** robustas en todos los endpoints
- **Paginación** en listados
- **Índices optimizados** en MongoDB
- **TypeScript** para type safety
- **Documentación** completa con ejemplos

---

## 🛠 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20.x | Runtime de JavaScript |
| **TypeScript** | 5.x | Lenguaje tipado |
| **Express** | 4.x | Framework web |
| **MongoDB** | 8.x | Base de datos NoSQL |
| **Mongoose** | 8.x | ODM para MongoDB |
| **CORS** | 2.x | Cross-Origin Resource Sharing |
| **Morgan** | 1.x | HTTP request logger |
| **dotenv** | 16.x | Variables de entorno |

---

## 🚀 Instalación

### Requisitos Previos
- **Node.js** 18 o superior
- **MongoDB** 6 o superior (local o Docker)
- **npm** o **yarn**

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/rondalla-api.git
cd rondalla-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar MongoDB (opción Docker)**
```bash
docker run -d \
  --name mongo \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:latest
```

4. **Configurar variables de entorno**
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con tus configuraciones
nano .env
```

5. **Poblar la base de datos**
```bash
npm run seed
```

6. **Iniciar el servidor**
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

---

## ⚙️ Configuración

### Archivo `.env`

```env
# Puerto del servidor
PORT=4000

# URI de MongoDB
MONGO_URI=mongodb://localhost:27017/rondalla
```

### Scripts Disponibles

```json
{
  "dev": "Inicia servidor en modo desarrollo con hot-reload",
  "build": "Compila TypeScript a JavaScript",
  "start": "Ejecuta la versión compilada",
  "seed": "Puebla la base de datos con datos de prueba"
}
```

---

## 🎯 Uso

### Inicio Rápido

```bash
# 1. Levantar MongoDB
docker start mongo

# 2. Poblar base de datos
npm run seed

# 3. Iniciar API
npm run dev
```

La API estará disponible en: `http://localhost:4000`

### Health Check

```bash
curl http://localhost:4000/health
```

Respuesta:
```json
{
  "ok": true,
  "mensaje": "API funcionando"
}
```

---

## 📁 Estructura del Proyecto

```
rondalla/
├── src/
│   ├── config/
│   │   └── mongo.ts           # Conexión a MongoDB
│   ├── models/
│   │   ├── tipos.ts           # Tipos y constantes
│   │   ├── miembro.model.ts   # Modelo de Miembros
│   │   ├── cancion.model.ts   # Modelo de Canciones
│   │   └── material.model.ts  # Modelo de Materiales
│   ├── routers/
│   │   ├── miembros.ts        # Endpoints de Miembros
│   │   ├── canciones.ts       # Endpoints de Canciones
│   │   ├── material.ts        # Endpoints de Materiales
│   │   └── stats.ts           # Endpoints de Estadísticas
│   ├── app.ts                 # Configuración de Express
│   └── seed.ts                # Script de población
├── .env                       # Variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
├── requests.http              # Ejemplos de requests
└── test.http                  # Suite de pruebas
```

---

## 📡 Endpoints

### Base URL: `http://localhost:4000`

### 🏥 Health Check
```http
GET /health
```

### 👥 Miembros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/miembros` | Listar todos los miembros |
| GET | `/api/miembros?activo=true` | Filtrar por estado |
| GET | `/api/miembros?buscar=texto` | Buscar por texto |
| GET | `/api/miembros/:id` | Obtener un miembro |
| POST | `/api/miembros` | Crear miembro |
| PUT | `/api/miembros/:id` | Actualizar miembro |
| DELETE | `/api/miembros/:id` | Eliminar miembro |

### 🎼 Canciones

#### CRUD Básico
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/canciones` | Listar todas las canciones |
| GET | `/api/canciones/:id` | Obtener una canción |
| POST | `/api/canciones` | Crear canción |
| PUT | `/api/canciones/:id` | Actualizar canción |
| DELETE | `/api/canciones/:id` | Eliminar canción |

#### Filtros Simples
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/canciones?nivel=facil` | Filtrar por nivel |
| GET | `/api/canciones?etiqueta=romantica` | Filtrar por etiqueta |
| GET | `/api/canciones?buscar=texto` | Búsqueda de texto |

#### Búsquedas Específicas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/canciones/por-nivel/:nivel` | Canciones por nivel |
| GET | `/api/canciones/por-voz/:rango` | Canciones por rango vocal |
| GET | `/api/canciones/por-instrumento/:tipo` | Canciones por instrumento |
| GET | `/api/canciones/con-miembro/:id` | Canciones de un miembro |

#### Búsqueda Avanzada Multi-Criterio
```http
GET /api/canciones/buscar-avanzado?nivel=facil&voz=aguda&instrumento=guitarra_base&texto=amor&etiqueta=romantica
```

**Parámetros disponibles:**
- `nivel`: facil | medio | dificil
- `voz`: aguda | segunda_aguda | media_aguda | media | media_grave | grave
- `instrumento`: guitarra_base | guitarra_requinto | bajo
- `texto`: búsqueda en título
- `etiqueta`: nombre de etiqueta

### 📚 Materiales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/materiales` | Listar todos los materiales |
| GET | `/api/materiales/:id` | Obtener un material |
| GET | `/api/materiales/por-tipo/:tipo` | Filtrar por tipo |
| GET | `/api/materiales/por-cancion/:id` | Materiales de una canción |
| GET | `/api/materiales/por-voz/:rango` | Materiales de un rango vocal |
| POST | `/api/materiales` | Crear material |
| PUT | `/api/materiales/:id` | Actualizar material |
| DELETE | `/api/materiales/:id` | Eliminar material |

### 📊 Estadísticas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stats/resumen-general` | Resumen completo |
| GET | `/api/stats/canciones-por-nivel` | Distribución por nivel |
| GET | `/api/stats/canciones-por-voz` | Distribución por voz |
| GET | `/api/stats/distribucion-instrumentos` | Distribución de instrumentos |
| GET | `/api/stats/cobertura-voces` | Análisis de cobertura vocal |
| GET | `/api/stats/materiales-por-tipo` | Distribución de materiales |
| GET | `/api/stats/participaciones-miembros` | Participaciones por miembro |
| GET | `/api/stats/canciones-mas-completas` | Top 10 canciones completas |
| GET | `/api/stats/analisis-etiquetas` | Análisis de etiquetas |

---

## 📊 Modelos de Datos

### Miembro

```typescript
interface IMiembro {
  nombre: string;                    // Nombre completo
  roles?: string[];                  // Roles vocales
  instrumentos?: string[];           // Instrumentos que toca
  activo: boolean;                   // Estado actual
  creadoEn?: Date;
  actualizadoEn?: Date;
}
```

### Canción

```typescript
interface ICancion {
  titulo: string;                    // Título de la canción
  tonalidad?: string;                // Tonalidad musical
  nivel?: "facil" | "medio" | "dificil";  // Nivel de dificultad
  etiquetas?: string[];              // Etiquetas de clasificación
  voces?: VozTrack[];                // Pistas vocales
  instrumentales?: InstrTrack[];     // Pistas instrumentales
  notas?: string;                    // Notas adicionales
  participaciones?: Participacion[]; // Miembros que participan
  creadoEn?: Date;
  actualizadoEn?: Date;
}
```

### Material

```typescript
interface IMaterial {
  titulo: string;                    // Título del material
  cancionId?: ObjectId;              // Canción relacionada
  tipo: "voz" | "guitarra_base" |    // Tipo de material
        "guitarra_requinto" | "bajo" | "teoria";
  rangoVoz?: RangoVoz;              // Rango vocal (si aplica)
  parte?: string;                    // Sección de la canción
  url: string;                       // URL del archivo
  origen: "telegram" | "local" | "otro";
  autorId?: ObjectId;                // Autor del material
  etiquetas?: string[];              // Etiquetas de clasificación
  creadoEn?: Date;
  actualizadoEn?: Date;
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Crear una Canción Fácil

```bash
curl -X POST http://localhost:4000/api/canciones \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Sabor a Mí",
    "tonalidad": "La menor",
    "nivel": "facil",
    "etiquetas": ["bolero", "clasica"],
    "voces": [
      {
        "rango": "media",
        "parte": "Completa",
        "url": "https://drive.google.com/sabor_a_mi/voces/media.mp3",
        "origen": "local",
        "duracionSeg": 180
      }
    ],
    "instrumentales": [
      {
        "instrumento": "guitarra_base",
        "parte": "Completa",
        "url": "https://drive.google.com/sabor_a_mi/guitarra/base.mp3",
        "origen": "local",
        "duracionSeg": 180
      }
    ],
    "notas": "Bolero mexicano icónico, ideal para principiantes"
  }'
```

### Ejemplo 2: Buscar Canciones para Principiantes

```bash
# Canciones fáciles con voz media
curl "http://localhost:4000/api/canciones/buscar-avanzado?nivel=facil&voz=media"
```

### Ejemplo 3: Obtener Estadísticas del Repertorio

```bash
# Resumen general
curl http://localhost:4000/api/stats/resumen-general

# Distribución por nivel
curl http://localhost:4000/api/stats/canciones-por-nivel
```

### Ejemplo 4: Buscar Materiales de Práctica

```bash
# Materiales de guitarra base
curl http://localhost:4000/api/materiales/por-tipo/guitarra_base

# Materiales de voz media aguda
curl http://localhost:4000/api/materiales/por-voz/media_aguda
```

---

## 🎼 Repertorio Actual

La base de datos incluye **30+ canciones** clasificadas por nivel:

### Nivel Fácil (15 canciones)
- Cascabel
- Cerca de Ti
- Contigo
- Delirio
- Encampanados
- Entrega Total
- Gema
- Hoy Que Soy Mayor
- Lo Que Son Las Cosas
- Obsesión
- Sabes Una Cosa
- Sabor a Mí
- Sin Ti
- Tres Regalos
- Voces del Recuerdo
- Volverás

### Nivel Medio (9 canciones)
- Amor Marinero
- Como Quien Pierde Una Estrella
- El Andariego
- Escucha Mi Voz
- Inolvidable
- La Gloria Eres Tú
- Noa Noa
- Perdiendo La Razón
- Veracruz

### Nivel Difícil (6 canciones)
- Alma Llanera
- Como
- La Bikina
- Mi Ciudad
- No Morirá

---

## 🧪 Testing

### Ejecutar Suite de Pruebas

El archivo `test.http` incluye **50+ casos de prueba** que cubren:

- ✅ CRUD completo
- ✅ Búsquedas simples y avanzadas
- ✅ Filtros por nivel
- ✅ Estadísticas
- ✅ Validaciones de error
- ✅ Paginación
- ✅ Casos de uso reales

**Usar con VS Code + REST Client extension:**
```bash
# Instalar extensión
code --install-extension humao.rest-client

# Abrir test.http y ejecutar requests
```

---

## 🤝 Contribuir

### Proceso de Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- **TypeScript** para type safety
- **ESLint** para linting
- **Prettier** para formatting
- Comentarios en español
- Mensajes de commit descriptivos

---

## 📝 Licencia

Este proyecto es software privado desarrollado para el Tecnológico de Veracruz.

---

## 👨‍💻 Autor

**Proyecto Final - Base de Datos**  
Tecnológico de Veracruz  
2025

---

## 📞 Soporte

Para preguntas o soporte:
- 📧 Email: [tu-email@example.com](mailto:tu-email@example.com)
- 🌐 Repositorio: [GitHub](https://github.com/tu-usuario/rondalla-api)

---

## 🎉 Agradecimientos

- Rondalla del Tecnológico de Veracruz
- Profesor Arreglista
- Todos los miembros de la Rondalla

---

**¡Hecho con ❤️ para la Rondalla del Tec Veracruz! 🎵**