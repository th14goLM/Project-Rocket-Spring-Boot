package br.com.rocket.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "satelites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Satelite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(unique = true, nullable = false)
    private String nome;

    @Positive(message = "Massa deve ser positiva")
    @Column(nullable = false)
    private float massaKg;

    @Column(nullable = false)
    private float energia;

    @Column(nullable = false)
    private String status = "Em solo";

    private String orbitaAlvo;
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSatelite tipoSatelite;

    @Column(nullable = false)
    private boolean paineisAtivos = false;

    // Construtor prático
    public Satelite(String nome, float massaKg, float energia, String orbitaAlvo, TipoSatelite tipoSatelite) {
        this.nome = nome;
        this.massaKg = massaKg;
        this.energia = energia;
        this.orbitaAlvo = orbitaAlvo;
        this.tipoSatelite = tipoSatelite;
        this.status = "Em solo";
        this.mensagem = tipoSatelite != null ? tipoSatelite.getMensagemPadrao() : "Sem mensagem";
    }

    // --- Regras de negócio ---

    public void ativarPaineis() {
        if ("Em solo".equals(this.status))
            throw new IllegalStateException("Não é possível abrir os painéis! Satélite ainda em solo.");
        if (this.energia >= 100)
            throw new IllegalStateException("Energia já está no máximo!");
        if (this.paineisAtivos)
            throw new IllegalStateException("Painéis já estão ativados!");
        this.paineisAtivos = true;
        recarregarEnergia();
    }

    public void recarregarEnergia() {
        if (!this.paineisAtivos)
            throw new IllegalStateException("Painéis fechados. Abra-os primeiro.");
        this.energia = Math.min(100, this.energia + 35);
    }

    public void definirOrbita(String escolha) {
        switch (escolha) {
            case "1" -> this.orbitaAlvo = "LEO";
            case "2" -> this.orbitaAlvo = "GEO";
            case "3" -> this.orbitaAlvo = "Órbita Lunar";
            default -> throw new IllegalArgumentException("Órbita inválida. Use 1 (LEO), 2 (GEO) ou 3 (Lunar).");
        }
        this.status = "Em órbita";
    }

    public void ativarSatelite() {
        if (!"Em órbita".equals(this.status))
            throw new IllegalStateException("Satélite não está em órbita. Status: " + this.status);
        this.status = "Ativo";
    }

    public String enviarDados() {
        if (!"Ativo".equals(this.status))
            throw new IllegalStateException("Satélite não está ativo. Status: " + this.status);
        if (this.energia <= 20)
            throw new IllegalStateException("Energia insuficiente! Atual: " + this.energia);
        this.energia -= 20;
        return this.mensagem;
    }

    public void definirTipo(TipoSatelite novoTipo) {
        if (novoTipo == null) throw new IllegalArgumentException("Tipo inválido.");
        this.tipoSatelite = novoTipo;
        this.mensagem = novoTipo.getMensagemPadrao();
    }
}
