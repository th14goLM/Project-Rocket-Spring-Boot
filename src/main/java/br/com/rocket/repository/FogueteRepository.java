package br.com.rocket.repository;

import br.com.rocket.model.Foguete;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FogueteRepository extends JpaRepository<Foguete, Long> {
    Optional<Foguete> findByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCase(String nome);
}
