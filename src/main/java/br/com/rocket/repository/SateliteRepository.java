package br.com.rocket.repository;

import br.com.rocket.model.Satelite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SateliteRepository extends JpaRepository<Satelite, Long> {
    Optional<Satelite> findByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCase(String nome);
}
