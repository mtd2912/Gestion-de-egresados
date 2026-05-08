# Sistema de Gestión de Egresados - Proyecto Unificado v2.0.0

## Descripción

Este es el proyecto unificado que combina todas las funcionalidades de los dos sistemas de gestión de egresados previamente separados. El sistema proporciona una API completa en FastAPI para la gestión de egresados, ofertas laborales, educación continua, usuarios y más.

## Cambios en la Versión 2.0.0

### Integración Completa
- ✅ Unificación de dos proyectos independientes en uno solo
- ✅ Combinación de todas las funcionalidades backend
- ✅ Integración completa de frontend (carpeta vistas)
- ✅ Sistema de autenticación OAuth2 implementado

### Funcionalidades del Proyecto Original 1 (Egresados_F-main)
- Entrevistas laborales (job_interview)
- Controllers, models y routes base

### Funcionalidades del Proyecto Original 2 (app_B)
- Sistema de usuarios y autenticación
- Gestión de facultades
- Tipos de usuarios y roles
- Frontend completo con HTML, CSS y JavaScript
- Sistema de seguridad mejorado

### Nuevas Funcionalidades Unificadas
- ✅ **Job Interview**: Sistema completo de entrevistas laborales agregado al proyecto unificado
- ✅ **Usuarios y Autenticación**: Sistema robusto de gestión de usuarios con OAuth2
- ✅ **Facultades**: Gestión de facultades integrada
- ✅ **Frontend**: Interfaz web completa incluida
- ✅ **Base de Datos**: Script SQL actualizado con todas las tablas

## Estructura del Proyecto

```
proyecto_unificado/
├── app/
│   ├── config/
│   │   ├── db_config.py       # Configuración de base de datos
│   │   └── security.py        # Configuración de seguridad OAuth2
│   ├── controllers/           # Controladores de la API
│   │   ├── academic_levels_controller.py
│   │   ├── continuing_education_controller.py
│   │   ├── contract_types_controller.py
│   │   ├── employment_statuses_controller.py
│   │   ├── faculty_controller.py
│   │   ├── graduates_controller.py
│   │   ├── job_interview_controller.py  ⭐ AGREGADO
│   │   ├── job_offer_controller.py
│   │   ├── jobs_controller.py
│   │   ├── program_controller.py
│   │   ├── sectors_controller.py
│   │   ├── user_controller.py
│   │   ├── user_type_controller.py
│   │   └── work_supervisor_controller.py
│   ├── models/                # Modelos Pydantic
│   │   ├── academic_levels_model.py
│   │   ├── continuing_education_model.py
│   │   ├── contract_types_model.py
│   │   ├── employment_statuses_model.py
│   │   ├── faculty_model.py
│   │   ├── graduates_model.py
│   │   ├── job_interview_model.py  ⭐ AGREGADO
│   │   ├── job_offer_model.py
│   │   ├── jobs_model.py
│   │   ├── program_model.py
│   │   ├── sectors_model.py
│   │   ├── user_model.py
│   │   ├── user_type_model.py
│   │   └── work_supervisor_model.py
│   ├── routes/                # Rutas de la API
│   │   ├── academic_levels_routes.py
│   │   ├── continuing_education_routes.py
│   │   ├── contract_types_routes.py
│   │   ├── employment_statuses_routes.py
│   │   ├── facultu_routes.py
│   │   ├── graduates_routes.py
│   │   ├── job_interview_routes.py  ⭐ AGREGADO
│   │   ├── job_offer_routes.py
│   │   ├── jobs_routes.py
│   │   ├── program_routes.py
│   │   ├── roles_routes.py
│   │   ├── sectors_routes.py
│   │   ├── users_routes.py
│   │   ├── user_type_routes.py
│   │   └── work_supervisor_routes.py
│   ├── sql/
│   │   ├── script.sql         # Script completo de base de datos ⭐ ACTUALIZADO
│   │   └── datos.txt          # Datos de ejemplo
│   └── main.py                # Punto de entrada de la aplicación
├── vistas/                    # Frontend completo
│   ├── css/
│   │   ├── components/
│   │   ├── global/
│   │   └── pages/
│   ├── img/
│   ├── js/
│   │   ├── components/
│   │   ├── modules/
│   │   └── shared/
│   └── pages/
├── requirements.txt           # Dependencias del proyecto
└── README.md                  # Este archivo

```

## Tecnologías Utilizadas

- **Backend**: FastAPI 0.110.0
- **Base de Datos**: PostgreSQL (psycopg2 2.9.9)
- **Autenticación**: OAuth2 con JWT (python-jose, passlib, bcrypt)
- **Validación**: Pydantic 2.10.3
- **Servidor**: Uvicorn 0.27.0
- **Reportes**: ReportLab 4.0.9
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)

## Endpoints de la API

### Gestión de Graduados
- `GET/POST /graduates` - Listar/crear graduados
- `GET/PUT/DELETE /graduates/{id}` - Operaciones sobre graduado específico

### Trabajos y Ofertas Laborales
- `GET/POST /jobs` - Gestión de trabajos
- `GET/POST /job_offers` - Gestión de ofertas laborales
- `GET/POST /job_interviews` ⭐ - Gestión de entrevistas laborales

### Educación y Programas
- `GET/POST /programs` - Programas académicos
- `GET/POST /academic_levels` - Niveles académicos
- `GET/POST /continuing_education` - Educación continua
- `GET/POST /faculties` - Facultades

### Administración
- `GET/POST /users` - Gestión de usuarios
- `GET/POST /user_types` - Tipos de usuario
- `GET/POST /roles` - Roles del sistema
- `POST /auth/login` - Autenticación

### Catálogos
- `GET/POST /sectors` - Sectores laborales
- `GET/POST /contract_types` - Tipos de contrato
- `GET/POST /employment_statuses` - Estados de empleo
- `GET/POST /work_supervisors` - Supervisores de trabajo

## Instalación

### Requisitos Previos
- Python 3.8+
- PostgreSQL 12+
- pip

### Pasos de Instalación

1. **Clonar o extraer el proyecto**
```bash
cd proyecto_unificado
```

2. **Crear entorno virtual**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar base de datos**
   - Crear una base de datos PostgreSQL
   - Ejecutar el script SQL: `app/sql/script.sql`
   - Configurar credenciales en `app/config/db_config.py`

5. **Ejecutar la aplicación**
```bash
cd app
python main.py
```

La aplicación estará disponible en: `http://localhost:8000`

## Configuración de Base de Datos

Editar `app/config/db_config.py`:

```python
DB_CONFIG = {
    "host": "localhost",
    "database": "nombre_db",
    "user": "usuario",
    "password": "contraseña",
    "port": 5432
}
```

## Características de Seguridad

- **Autenticación OAuth2**: Sistema de tokens JWT
- **Encriptación de contraseñas**: Bcrypt para hash de contraseñas
- **CORS**: Configurado para desarrollo y producción
- **Roles y permisos**: Sistema de autorización basado en roles

## Base de Datos

El sistema utiliza PostgreSQL con las siguientes tablas principales:

### Tablas Core
- `faculty` - Facultades
- `program` - Programas académicos
- `academic_levels` - Niveles académicos
- `graduates` - Información de egresados

### Tablas Laborales
- `jobs` - Trabajos de los egresados
- `job_offers` - Ofertas laborales publicadas
- `job_interview` ⭐ - Entrevistas laborales (NUEVA)
- `contract_types` - Tipos de contrato
- `employment_statuses` - Estados laborales
- `sectors` - Sectores económicos
- `work_supervisor` - Supervisores de trabajo

### Tablas de Sistema
- `users` - Usuarios del sistema
- `user_types` - Tipos de usuario
- `roles` - Roles del sistema

### Tablas Educativas
- `continuing_education` - Educación continua de egresados

## Frontend

El frontend está completamente integrado en la carpeta `vistas/`:

- **Páginas HTML**: Interfaces de usuario completas
- **CSS Modular**: Estilos organizados por componentes
- **JavaScript**: Lógica de frontend con módulos
- **Imágenes**: Recursos gráficos del sistema

El frontend se sirve automáticamente en la ruta raíz (`/`) a través de FastAPI StaticFiles.

## Comparación de Versiones

| Característica | Proyecto 1 | Proyecto 2 | Unificado |
|---------------|-----------|-----------|-----------|
| Job Interview | ✅ | ❌ | ✅ |
| Usuarios/Auth | ❌ | ✅ | ✅ |
| Facultades | ❌ | ✅ | ✅ |
| Frontend | ❌ | ✅ | ✅ |
| Security OAuth2 | ❌ | ✅ | ✅ |
| Script SQL completo | ⚠️ Básico | ✅ | ✅ |
| Roles del sistema | ❌ | ✅ | ✅ |

## Próximos Pasos Recomendados

1. **Pruebas**: Implementar tests unitarios y de integración
2. **Documentación API**: Expandir documentación con ejemplos
3. **Deployment**: Configurar para producción con variables de entorno
4. **Caché**: Implementar caché con Redis para mejor rendimiento
5. **Logs**: Sistema de logging más robusto
6. **Monitoreo**: Integrar herramientas de monitoreo y métricas

## Notas de Desarrollo

- Todos los triggers de actualización automática (`update_date`) están implementados
- Campo `active` en todas las tablas para soft-delete
- Timestamps en formato `TIMESTAMPTZ` para mejor manejo de zonas horarias
- Foreign keys correctamente implementadas para integridad referencial

## Soporte y Contacto

Para preguntas o soporte, consultar la documentación de FastAPI:
- Documentación interactiva: `http://localhost:8000/docs`
- Documentación alternativa: `http://localhost:8000/redoc`

## Licencia

[Especificar licencia del proyecto]

---

**Versión**: 2.0.0  
**Fecha de Unificación**: Mayo 2026  
**Estado**: ✅ Completamente Funcional
