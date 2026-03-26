package br.com.rocket.config;

import br.com.rocket.model.*;
import br.com.rocket.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Popula o banco com os mesmos dados do MissaoEspacial.java original
 * assim que a aplicação inicia.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final FogueteRepository fogueteRepository;
    private final SateliteRepository sateliteRepository;

    public DataLoader(FogueteRepository fogueteRepository, SateliteRepository sateliteRepository) {
        this.fogueteRepository = fogueteRepository;
        this.sateliteRepository = sateliteRepository;
    }

    @Override
    public void run(String... args) {
        // Foguetes (mesmos do original)
        fogueteRepository.save(new Foguete("Falcon XII", 800, 50));
        fogueteRepository.save(new Foguete("Apollo XI", 1200, 30));
        fogueteRepository.save(new Foguete("Roadster", 750, 100));

        // Satélites (mesmos do original)
        sateliteRepository.save(new Satelite("Sputnik", 250f, 90f, "A ser definida!", TipoSatelite.ESPIONAGEM));
        sateliteRepository.save(new Satelite("Hubble", 400f, 25f, "GEO", TipoSatelite.CIENTIFICO));
        sateliteRepository.save(new Satelite("JamesWebb", 850f, 20f, "Órbita Lunar", TipoSatelite.COMUNICACAO));

        System.out.println("✅ Dados iniciais carregados com sucesso!");
        System.out.println("🚀 Foguetes: Falcon XII, Apollo XI, Roadster");
        System.out.println("🛰 Satélites: Sputnik, Hubble, JamesWebb");
        System.out.println("🌐 Acesse: http://localhost:8080");
    }
}
