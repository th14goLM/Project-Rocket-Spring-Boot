# 🚀 Project Rocket 2026 — Spring Boot

Este projeto foi desenvolvido como uma reescrita completa do **Project Rocket 2026**, originalmente criado em Java puro durante os estudos de POO. A nova versão transforma o projeto em uma **API REST completa com interface web**, aplicando conceitos modernos de desenvolvimento com Spring Boot.

---

## 🌌 Sobre o Projeto

O sistema simula um **Centro de Controle Espacial**, permitindo gerenciar foguetes, satélites e missões espaciais através de uma interface web interativa que se comunica com uma API REST.

---

## 🗂️ Estrutura do Projeto

```
rocket2026/
│
├── pom.xml
│
└── src/main/
    ├── java/br/com/rocket/
    │   ├── ProjectRocketApplication.java
    │   ├── model/
    │   │   ├── Foguete.java
    │   │   ├── Satelite.java
    │   │   └── TipoSatelite.java
    │   ├── repository/
    │   │   ├── FogueteRepository.java
    │   │   └── SateliteRepository.java
    │   ├── dto/
    │   │   ├── Requests.java
    │   │   └── Responses.java
    │   ├── service/
    │   │   ├── FogueteService.java
    │   │   ├── SateliteService.java
    │   │   └── CentroControleService.java
    │   ├── controller/
    │   │   └── Controllers.java
    │   ├── exception/
    │   │   └── GlobalExceptionHandler.java
    │   └── config/
    │       └── DataLoader.java
    │
    └── resources/
        ├── application.properties
        └── static/
            └── index.html
```

---

## 🛠️ Tecnologias Utilizadas

* Java 21 ☕
* Spring Boot 3.2
* HTML + CSS + JavaScript
* PostgreSQL

---

## 🎯 Objetivo

* Aplicar os conceitos de POO em um projeto real com Spring Boot
* Praticar a arquitetura em camadas (Model → Repository → Service → Controller)
* Desenvolver uma API REST funcional com interface web
* Evoluir do Java puro para um framework moderno de mercado

---

## 👨‍💻 Autor

Desenvolvido por **Thiago de Lima Machado**
Estudante de programação e entusiasta de tecnologia 🚀

---

## 📌 Licença

Este projeto é apenas para fins educacionais.
