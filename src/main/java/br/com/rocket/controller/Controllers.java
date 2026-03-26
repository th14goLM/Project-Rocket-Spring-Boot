package br.com.rocket.controller;

import br.com.rocket.dto.Requests.*;
import br.com.rocket.dto.Responses.*;
import br.com.rocket.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
// FOGUETE CONTROLLER
// ============================================================

@RestController
@RequestMapping("/api/foguetes")
@CrossOrigin(origins = "*")
class FogueteController {

    private final FogueteService fogueteService;

    FogueteController(FogueteService fogueteService) {
        this.fogueteService = fogueteService;
    }

    @GetMapping
    public List<FogueteResponse> listarTodos() {
        return fogueteService.listarTodos();
    }

    @GetMapping("/{nome}")
    public FogueteResponse buscarPorNome(@PathVariable String nome) {
        return fogueteService.buscarPorNome(nome);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FogueteResponse criar(@Valid @RequestBody CriarFogueteRequest request) {
        return fogueteService.criar(request);
    }

    @PutMapping("/{nome}/abastecer")
    public FogueteResponse abastecer(@PathVariable String nome,
                                      @Valid @RequestBody AbastecerFogueteRequest request) {
        return fogueteService.abastecer(nome, request);
    }

    @DeleteMapping("/{nome}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable String nome) {
        fogueteService.deletar(nome);
    }
}

// ============================================================
// SATELITE CONTROLLER
// ============================================================

@RestController
@RequestMapping("/api/satelites")
@CrossOrigin(origins = "*")
class SateliteController {

    private final SateliteService sateliteService;

    SateliteController(SateliteService sateliteService) {
        this.sateliteService = sateliteService;
    }

    @GetMapping
    public List<SateliteResponse> listarTodos() {
        return sateliteService.listarTodos();
    }

    @GetMapping("/{nome}")
    public SateliteResponse buscarPorNome(@PathVariable String nome) {
        return sateliteService.buscarPorNome(nome);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SateliteResponse criar(@Valid @RequestBody CriarSateliteRequest request) {
        return sateliteService.criar(request);
    }

    @PutMapping("/{nome}/paineis")
    public SateliteResponse ativarPaineis(@PathVariable String nome) {
        return sateliteService.ativarPaineis(nome);
    }

    @PutMapping("/{nome}/orbita")
    public SateliteResponse definirOrbita(@PathVariable String nome,
                                           @Valid @RequestBody DefinirOrbitaRequest request) {
        return sateliteService.definirOrbita(nome, request);
    }

    @PutMapping("/{nome}/ativar")
    public SateliteResponse ativarSatelite(@PathVariable String nome) {
        return sateliteService.ativarSatelite(nome);
    }

    @DeleteMapping("/{nome}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable String nome) {
        sateliteService.deletar(nome);
    }
}

// ============================================================
// MISSAO CONTROLLER
// ============================================================

@RestController
@RequestMapping("/api/missoes")
@CrossOrigin(origins = "*")
class MissaoController {

    private final CentroControleService centroControleService;
    private final SateliteService sateliteService;

    MissaoController(CentroControleService centroControleService, SateliteService sateliteService) {
        this.centroControleService = centroControleService;
        this.sateliteService = sateliteService;
    }

    @PostMapping("/iniciar")
    public MissaoResponse iniciarMissao(@Valid @RequestBody IniciarMissaoRequest request) {
        return centroControleService.iniciarMissao(request);
    }

    @GetMapping("/status")
    public StatusMissaoResponse statusMissao() {
        return centroControleService.statusMissao();
    }

    @PutMapping("/{nomeSatelite}/dados")
    public DadosEnviadosResponse enviarDados(@PathVariable String nomeSatelite) {
        return sateliteService.enviarDados(nomeSatelite);
    }
}
