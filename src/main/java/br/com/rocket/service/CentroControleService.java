package br.com.rocket.service;

import br.com.rocket.dto.Requests.*;
import br.com.rocket.dto.Responses.*;
import br.com.rocket.model.Foguete;
import br.com.rocket.model.Satelite;
import br.com.rocket.repository.FogueteRepository;
import br.com.rocket.repository.SateliteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Equivalente ao CentroControle.java original.
 * Coordena as operações entre Foguete e Satélite.
 */
@Service
@Transactional
public class CentroControleService {

    private final FogueteService fogueteService;
    private final SateliteService sateliteService;
    private final FogueteRepository fogueteRepository;
    private final SateliteRepository sateliteRepository;

    public CentroControleService(FogueteService fogueteService, SateliteService sateliteService,
                                  FogueteRepository fogueteRepository, SateliteRepository sateliteRepository) {
        this.fogueteService = fogueteService;
        this.sateliteService = sateliteService;
        this.fogueteRepository = fogueteRepository;
        this.sateliteRepository = sateliteRepository;
    }

    /**
     * Inicia uma missão espacial: valida, carrega o satélite no foguete e lança.
     * Equivalente ao iniciarMissao() do CentroControle original.
     */
    public MissaoResponse iniciarMissao(IniciarMissaoRequest request) {
        Foguete foguete = fogueteService.buscarEntidade(request.nomeFoguete());
        Satelite satelite = sateliteService.buscarEntidade(request.nomeSatelite());

        // Validação de carga (lógica idêntica ao original)
        if (satelite.getMassaKg() > foguete.getCargaMaxima()) {
            return new MissaoResponse(
                false,
                "Falha: O satélite " + satelite.getNome() + " é muito pesado para o foguete " + foguete.getNome() +
                ". Massa: " + satelite.getMassaKg() + " kg / Carga máxima: " + foguete.getCargaMaxima() + " kg",
                FogueteResponse.from(foguete),
                SateliteResponse.from(satelite)
            );
        }

        // Carrega o satélite no foguete
        foguete.setSateliteCarregado(satelite);

        // Lança (pode lançar IllegalStateException se combustível insuficiente)
        foguete.lancar();

        fogueteRepository.save(foguete);
        sateliteRepository.save(satelite);

        return new MissaoResponse(
            true,
            "Missão iniciada com sucesso! " + foguete.getNome() + " lançado carregando " + satelite.getNome(),
            FogueteResponse.from(foguete),
            SateliteResponse.from(satelite)
        );
    }

    /**
     * Retorna o status completo de todos os foguetes e satélites.
     * Equivalente ao statusMissao() do CentroControle original.
     */
    public StatusMissaoResponse statusMissao() {
        List<FogueteResponse> foguetes = fogueteRepository.findAll()
                .stream().map(FogueteResponse::from).toList();

        List<SateliteResponse> satelites = sateliteRepository.findAll()
                .stream().map(SateliteResponse::from).toList();

        return new StatusMissaoResponse(foguetes, satelites);
    }
}
