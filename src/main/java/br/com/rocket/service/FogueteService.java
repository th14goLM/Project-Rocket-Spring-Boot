package br.com.rocket.service;

import br.com.rocket.dto.Requests.*;
import br.com.rocket.dto.Responses.*;
import br.com.rocket.model.Foguete;
import br.com.rocket.repository.FogueteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FogueteService {

    private final FogueteRepository fogueteRepository;

    public FogueteService(FogueteRepository fogueteRepository) {
        this.fogueteRepository = fogueteRepository;
    }

    public List<FogueteResponse> listarTodos() {
        return fogueteRepository.findAll()
                .stream()
                .map(FogueteResponse::from)
                .toList();
    }

    public FogueteResponse buscarPorNome(String nome) {
        return FogueteResponse.from(buscarEntidade(nome));
    }

    public FogueteResponse criar(CriarFogueteRequest request) {
        if (fogueteRepository.existsByNomeIgnoreCase(request.nome())) {
            throw new IllegalArgumentException("Já existe um foguete com o nome: " + request.nome());
        }
        Foguete foguete = new Foguete(request.nome(), request.cargaMaxima(), request.combustivelRestante());
        return FogueteResponse.from(fogueteRepository.save(foguete));
    }

    public FogueteResponse abastecer(String nome, AbastecerFogueteRequest request) {
        Foguete foguete = buscarEntidade(nome);
        foguete.abastecer(request.quantidade());
        return FogueteResponse.from(fogueteRepository.save(foguete));
    }

    public void deletar(String nome) {
        Foguete foguete = buscarEntidade(nome);
        fogueteRepository.delete(foguete);
    }

    public Foguete buscarEntidade(String nome) {
        return fogueteRepository.findByNomeIgnoreCase(nome)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Foguete não encontrado: " + nome));
    }

    public Foguete salvar(Foguete foguete) {
        return fogueteRepository.save(foguete);
    }
}
