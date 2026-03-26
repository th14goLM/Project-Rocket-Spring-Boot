package br.com.rocket.dto;

import br.com.rocket.model.Foguete;
import br.com.rocket.model.Satelite;
import br.com.rocket.model.TipoSatelite;

// ============================================================
// RESPONSE DTOs  (o que a API devolve ao cliente)
// ============================================================

public class Responses {

    public record FogueteResponse(
        Long id,
        String nome,
        float cargaMaxima,
        float combustivelRestante,
        String status,
        String sateliteCarregado
    ) {
        // Factory method: converte a entidade para o DTO
        public static FogueteResponse from(Foguete f) {
            return new FogueteResponse(
                f.getId(),
                f.getNome(),
                f.getCargaMaxima(),
                f.getCombustivelRestante(),
                f.getStatus(),
                f.getSateliteCarregado() != null ? f.getSateliteCarregado().getNome() : null
            );
        }
    }

    public record SateliteResponse(
        Long id,
        String nome,
        float massaKg,
        float energia,
        String status,
        String orbitaAlvo,
        TipoSatelite tipoSatelite,
        boolean paineisAtivos,
        String mensagem
    ) {
        public static SateliteResponse from(Satelite s) {
            return new SateliteResponse(
                s.getId(),
                s.getNome(),
                s.getMassaKg(),
                s.getEnergia(),
                s.getStatus(),
                s.getOrbitaAlvo(),
                s.getTipoSatelite(),
                s.isPaineisAtivos(),
                s.getMensagem()
            );
        }
    }

    public record MissaoResponse(
        boolean sucesso,
        String mensagem,
        FogueteResponse foguete,
        SateliteResponse satelite
    ) {}

    public record StatusMissaoResponse(
        java.util.List<FogueteResponse> foguetes,
        java.util.List<SateliteResponse> satelites
    ) {}

    public record DadosEnviadosResponse(
        String satelite,
        String mensagem,
        float energiaRestante
    ) {}

    public record ApiError(
        int status,
        String erro,
        String mensagem
    ) {}
}
