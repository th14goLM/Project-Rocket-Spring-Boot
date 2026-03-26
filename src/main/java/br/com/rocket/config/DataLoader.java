package br.com.rocket.config;

import br.com.rocket.model.*;
import br.com.rocket.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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

        // Só insere se o banco estiver vazio
        if (fogueteRepository.count() == 0) {
            fogueteRepository.save(new Foguete("Falcon XII", 800, 50));
            fogueteRepository.save(new Foguete("Apollo XI", 1200, 30));
            fogueteRepository.save(new Foguete("Roadster", 750, 100));
            System.out.println("🚀 Foguetes carregados!");
        } else {
            System.out.println("🚀 Foguetes já existem no banco, pulando inserção.");
        }

        if (sateliteRepository.count() == 0) {
            sateliteRepository.save(new Satelite("Sputnik",   250f, 90f, "A ser definida!", TipoSatelite.ESPIONAGEM));
            sateliteRepository.save(new Satelite("Hubble",    400f, 25f, "GEO",             TipoSatelite.CIENTIFICO));
            sateliteRepository.save(new Satelite("JamesWebb", 850f, 20f, "Órbita Lunar",    TipoSatelite.COMUNICACAO));
            System.out.println("🛰 Satélites carregados!");
        } else {
            System.out.println("🛰 Satélites já existem no banco, pulando inserção.");
        }

        System.out.println("✅ DataLoader concluído!");
        System.out.println("🌐 Acesse: http://localhost:8080");
    }
}
