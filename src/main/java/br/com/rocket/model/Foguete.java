package br.com.rocket.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "foguetes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Foguete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(unique = true, nullable = false)
    private String nome;

    @Positive(message = "Carga máxima deve ser positiva")
    @Column(nullable = false)
    private float cargaMaxima;

    @PositiveOrZero(message = "Combustível não pode ser negativo")
    @Column(nullable = false)
    private float combustivelRestante;

    @Column(nullable = false)
    private String status = "Pronto";

    @OneToOne
    @JoinColumn(name = "satelite_id")
    private Satelite sateliteCarregado;

    // Construtor prático (sem id, que é gerado automaticamente)
    public Foguete(String nome, float cargaMaxima, float combustivelRestante) {
        this.nome = nome;
        this.cargaMaxima = cargaMaxima;
        this.combustivelRestante = combustivelRestante;
        this.status = "Pronto";
    }

    // --- Regras de negócio ---

    public void abastecer(float quantidade) {
        if (quantidade <= 0)
            throw new IllegalArgumentException("Quantidade de combustível deve ser positiva.");
        this.combustivelRestante += quantidade;
    }

    public void lancar() {
        if ("Lançado".equals(this.status))
            throw new IllegalStateException("O foguete " + nome + " já está no espaço!");
        if (this.combustivelRestante < 50) {
            this.status = "Falha";
            throw new IllegalStateException(
                nome + " sem combustível! (Mínimo: 50 ton, atual: " + combustivelRestante + ")"
            );
        }
        this.combustivelRestante -= 50;
        this.status = "Lançado";
        if (this.sateliteCarregado != null)
            this.sateliteCarregado.setStatus("No espaço");
    }
}
