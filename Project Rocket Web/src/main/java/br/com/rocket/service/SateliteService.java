package br.com.rocket.service;

import br.com.rocket.dto.Requests.*;
import br.com.rocket.dto.Responses.*;
import br.com.rocket.model.Satelite;
import br.com.rocket.repository.SateliteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SateliteService {

    private final SateliteRepository sateliteRepository;

    public SateliteService(SateliteRepository sateliteRepository) {
        this.sateliteRepository = sateliteRepository;
    }

    public List<SateliteResponse> listarTodos() {
        return sateliteRepository.findAll()
                .stream()
                .map(SateliteResponse::from)
                .toList();
    }

    public SateliteResponse buscarPorNome(String nome) {
        return SateliteResponse.from(buscarEntidade(nome));
    }

    public SateliteResponse criar(CriarSateliteRequest request) {
        if (sateliteRepository.existsByNomeIgnoreCase(request.nome())) {
            throw new IllegalArgumentException("Já existe um satélite com o nome: " + request.nome());
        }
        Satelite satelite = new Satelite(
                request.nome(), request.massaKg(), request.energia(),
                request.orbitaAlvo(), request.tipoSatelite()
        );
        return SateliteResponse.from(sateliteRepository.save(satelite));
    }

    public SateliteResponse ativarPaineis(String nome) {
        Satelite satelite = buscarEntidade(nome);
        satelite.ativarPaineis();
        return SateliteResponse.from(sateliteRepository.save(satelite));
    }

    public SateliteResponse definirOrbita(String nome, DefinirOrbitaRequest request) {
        Satelite satelite = buscarEntidade(nome);
        satelite.definirOrbita(request.escolha());
        return SateliteResponse.from(sateliteRepository.save(satelite));
    }

    public SateliteResponse ativarSatelite(String nome) {
        Satelite satelite = buscarEntidade(nome);
        satelite.ativarSatelite();
        return SateliteResponse.from(sateliteRepository.save(satelite));
    }

    public DadosEnviadosResponse enviarDados(String nome) {
        Satelite satelite = buscarEntidade(nome);
        String mensagem = satelite.enviarDados();
        sateliteRepository.save(satelite);
        return new DadosEnviadosResponse(satelite.getNome(), mensagem, satelite.getEnergia());
    }

    // Método interno
    public Satelite buscarEntidade(String nome) {
        return sateliteRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Satélite não encontrado: " + nome));
    }

    public Satelite salvar(Satelite satelite) {
        return sateliteRepository.save(satelite);
    }
}
