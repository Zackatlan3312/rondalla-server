# rondalla-server

API para consultar el repertorio de la Rondalla Voces del Recuerdo del Tecnológico de Veracruz: qué canciones hay, qué voces e instrumentos lleva cada una, quién participa en cuál y las pistas para practicar. Está hecha en TypeScript con Express, y MongoDB con Mongoose.

## Qué guarda

- **Canciones**: título, tonalidad, nivel (`facil`, `medio`, `dificil`), etiquetas, pistas de voz por rango, pistas instrumentales y los miembros que participan.
- **Miembros**: nombre, roles, instrumentos y si siguen activos.
- **Materiales**: pistas o documentos de práctica ligados a una canción. Cada uno tiene tipo (`voz`, `guitarra_base`, `guitarra_requinto`, `bajo` o `teoria`), la liga al archivo y de dónde salió (`telegram`, `local` u `otro`).

Los rangos de voz son `aguda`, `segunda_aguda`, `media_aguda`, `media`, `media_grave` y `grave`.

`npm run seed` carga 30 canciones del repertorio real (16 fáciles, 9 de nivel medio y 5 difíciles), junto con miembros y materiales de ejemplo.

## Cómo correrlo

Necesitas Node.js y MongoDB, ya sea instalado o en Docker.

```bash
docker run -d --name mongo -p 27017:27017 mongo
npm install
npm run seed
npm run dev
```

Por defecto escucha en el puerto 4000 y se conecta a `mongodb://localhost:27017/rondalla`. Para cambiar eso, crea un `.env` con `PORT` y `MONGO_URI`.

Para producción: `npm run build` y luego `npm start`.

## Endpoints

`GET /health` responde si la API está arriba.

Miembros, canciones y materiales tienen CRUD completo (`GET`, `POST`, `PUT`, `DELETE`) en `/api/miembros`, `/api/canciones` y `/api/materiales`. Los listados aceptan `page` y `limit` (10 por página si no se indica), y además:

- `/api/miembros?activo=true&buscar=`
- `/api/canciones?nivel=&etiqueta=&buscar=`
- `/api/materiales?tipo=&etiqueta=&buscar=`

Búsquedas de canciones:

| Ruta | |
|---|---|
| `/api/canciones/buscar-avanzado?nivel=&voz=&instrumento=&texto=&etiqueta=` | Combina cualquiera de los filtros |
| `/api/canciones/por-nivel/:nivel` | |
| `/api/canciones/por-voz/:rango` | |
| `/api/canciones/por-instrumento/:tipo` | |
| `/api/canciones/con-miembro/:miembroId` | Canciones donde participa un miembro |

Búsquedas de materiales: `/api/materiales/por-tipo/:tipo`, `/api/materiales/por-cancion/:cancionId` y `/api/materiales/por-voz/:rango`.

Estadísticas en `/api/stats/`: `resumen-general`, `canciones-por-nivel`, `canciones-por-voz`, `distribucion-instrumentos`, `cobertura-voces`, `materiales-por-tipo`, `participaciones-miembros`, `canciones-mas-completas` y `analisis-etiquetas`.

## Probarla

`requests.http` tiene ejemplos sueltos y `test.http` tiene 57 peticiones que recorren el CRUD, los filtros, las estadísticas y algunos casos de error. Se corren desde VS Code con la extensión REST Client.

Por ejemplo, para crear una canción:

```bash
curl -X POST http://localhost:4000/api/canciones \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Sabor a Mí",
    "tonalidad": "La menor",
    "nivel": "facil",
    "etiquetas": ["bolero"]
  }'
```

## Estructura

```
src/
  app.ts            Express, middlewares y rutas
  seed.ts           datos iniciales
  config/mongo.ts   conexión
  models/           Cancion, Miembro, Material y los tipos compartidos
  routers/          miembros, canciones, material y stats
```
