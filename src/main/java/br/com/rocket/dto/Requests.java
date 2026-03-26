package br.com.rocket.dto;

import br.com.rocket.model.TipoSatelite;
import jakarta.validation.constraints.*;

// ============================================================
// REQUEST DTOs  (o que o cliente manda para a API)
// ============================================================

public class Requests {

    public record CriarFogueteRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @Positive(message = "Carga máxima deve ser positiva") float cargaMaxima,
        @PositiveOrZero float combustivelRestante
    ) {}

    public record AbastecerFogueteRequest(
        @Positive(message = "Quantidade deve ser positiva") float quantidade
    ) {}

    public record CriarSateliteRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @Positive(message = "Massa deve ser positiva") float massaKg,
        @PositiveOrZero float energia,
        String orbitaAlvo,
        @NotNull(message = "Tipo é obrigatório") TipoSatelite tipoSatelite
    ) {}

    public record DefinirOrbitaRequest(
        @NotBlank(message = "Escolha a órbita: 1 (LEO), 2 (GEO), 3 (Órbita Lunar)")
        String escolha
    ) {}

    public record IniciarMissaoRequest(
        @NotBlank(message = "Nome do foguete é obrigatório") String nomeFoguete,
        @NotBlank(message = "Nome do satélite é obrigatório") String nomeSatelite
    ) {}
}
