package br.com.rocket.model;

public enum TipoSatelite {

    CIENTIFICO("Enviando dados meteorológicos sobre a Terra: 25° Graus Celsius, umidade em 90%"),
    COMUNICACAO("Estabeleceu comunicação interespacial com sucesso!"),
    ESPIONAGEM("Captando sinais e imagens estratégicas da superfície.");

    private final String mensagemPadrao;

    TipoSatelite(String mensagemPadrao) {
        this.mensagemPadrao = mensagemPadrao;
    }

    public String getMensagemPadrao() {
        return mensagemPadrao;
    }
}
