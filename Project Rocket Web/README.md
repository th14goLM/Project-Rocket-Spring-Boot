# 🚀 Project Rocket 2026 — Spring Boot

Reescrita completa do projeto original de POO em Java puro, agora como uma **API REST com interface web**, usando Spring
Boot.

---

## 📁 Estrutura do Projeto

```
project-rocket-2026/
│
├── pom.xml
│
└── src/main/
    ├── java/br/com/rocket/
    │   ├── ProjectRocketApplication.java   ← Classe principal
    │   │
    │   ├── model/
    │   │   ├── Foguete.java                ← Entidade JPA
    │   │   ├── Satelite.java               ← Entidade JPA
    │   │   └── TipoSatelite.java           ← Enum
    │   │
    │   ├── repository/
    │   │   ├── FogueteRepository.java      ← Spring Data JPA
    │   │   └── SateliteRepository.java
    │   │
    │   ├── dto/
    │   │   ├── Requests.java               ← O que a API recebe
    │   │   └── Responses.java              ← O que a API devolve
    │   │
    │   ├── service/
    │   │   ├── FogueteService.java         ← Regras de negócio
    │   │   ├── SateliteService.java
    │   │   └── CentroControleService.java  ← Coordena missões
    │   │
    │   ├── controller/
    │   │   └── Controllers.java            ← Endpoints REST
    │   │
    │   ├── exception/
    │   │   └── GlobalExceptionHandler.java ← Tratamento de erros
    │   │
    │   └── config/
    │       └── DataLoader.java             ← Dados iniciais
    │
    └── resources/
        ├── application.properties          ← Configurações
        └── static/
            └── index.html                  ← Interface web
```

---

## ▶️ Como Rodar

### Pré-requisitos

- Java 21+
- Maven 3.8+

### Passos

```bash
# 1. Entrar na pasta do projeto
cd project-rocket-2026

# 2. Compilar e rodar
./mvnw spring-boot:run

# Se não tiver o mvnw, use:
mvn spring-boot:run
```

### Acessar

| URL                                | O quê               |
|------------------------------------|---------------------|
| `http://localhost:8080`            | Interface web       |
| `http://localhost:8080/h2-console` | Banco de dados (H2) |

---

## 🌐 Endpoints da API

### Foguetes

| Método | URL                              | Descrição      |
|--------|----------------------------------|----------------|
| GET    | `/api/foguetes`                  | Lista todos    |
| GET    | `/api/foguetes/{nome}`           | Busca por nome |
| POST   | `/api/foguetes`                  | Cadastra novo  |
| PUT    | `/api/foguetes/{nome}/abastecer` | Abastece       |

### Satélites

| Método | URL                             | Descrição      |
|--------|---------------------------------|----------------|
| GET    | `/api/satelites`                | Lista todos    |
| GET    | `/api/satelites/{nome}`         | Busca por nome |
| POST   | `/api/satelites`                | Cadastra novo  |
| PUT    | `/api/satelites/{nome}/paineis` | Ativa painéis  |
| PUT    | `/api/satelites/{nome}/orbita`  | Define órbita  |
| PUT    | `/api/satelites/{nome}/ativar`  | Ativa satélite |

### Missões

| Método | URL                         | Descrição       |
|--------|-----------------------------|-----------------|
| POST   | `/api/missoes/iniciar`      | Inicia missão   |
| GET    | `/api/missoes/status`       | Status completo |
| PUT    | `/api/missoes/{nome}/dados` | Envia dados     |

---

## 📦 Exemplos de Requisição (curl)

```bash
# Listar foguetes
curl http://localhost:8080/api/foguetes

# Criar foguete
curl -X POST http://localhost:8080/api/foguetes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Saturn V","cargaMaxima":2000,"combustivelRestante":150}'

# Abastecer
curl -X PUT http://localhost:8080/api/foguetes/Falcon%20XII/abastecer \
  -H "Content-Type: application/json" \
  -d '{"quantidade":50}'

# Iniciar missão
curl -X POST http://localhost:8080/api/missoes/iniciar \
  -H "Content-Type: application/json" \
  -d '{"nomeFoguete":"Falcon XII","nomeSatelite":"Hubble"}'

# Ativar painéis
curl -X PUT http://localhost:8080/api/satelites/Hubble/paineis

# Definir órbita (1=LEO, 2=GEO, 3=Lunar)
curl -X PUT http://localhost:8080/api/satelites/Hubble/orbita \
  -H "Content-Type: application/json" \
  -d '{"escolha":"2"}'

# Ativar satélite
curl -X PUT http://localhost:8080/api/satelites/Hubble/ativar

# Enviar dados
curl -X PUT http://localhost:8080/api/missoes/Hubble/dados
```

---

## 🔄 O que Mudou do Projeto Original

| Original (Java puro)                   | Spring Boot                              |
|----------------------------------------|------------------------------------------|
| `CentroControle` com listas em memória | Banco H2 com JPA                         |
| `IO.println()` no terminal             | Respostas JSON via HTTP                  |
| `MissaoEspacial.java` (script linear)  | Interface web interativa                 |
| Sem tratamento de erros estruturado    | `GlobalExceptionHandler` com HTTP status |
| Busca com `==` em String               | `.equalsIgnoreCase()` nos Repositories   |

---

## 💡 Próximos Passos Sugeridos

- Trocar H2 por **PostgreSQL** ou **MySQL** (só mudar o `application.properties`)
- Adicionar **autenticação** com Spring Security
- Criar **testes** com `@SpringBootTest`
- Publicar na nuvem com **Railway** ou **Render** (gratuito)
