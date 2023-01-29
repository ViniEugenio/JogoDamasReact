import { useRef ,useEffect, useState } from "react";
import { EDirecao } from "../../enums/EDirecao";
import { CasaInterface } from "../../interfaces/CasaInterface";
import { HistoricoInterface } from "../../interfaces/HistoricoInterface";
import { MovimentoPossivelInterface } from "../../interfaces/MovimentoPossivelInterface";
import { PecaInterface } from "../../interfaces/PecaInterface";
import { MainDiv, TabuleiroDiv, Casa, Peca, PecaVez, HistoricoDiv } from "./styles";

export function Tabuleiro() {

    // Seta as variáveis de controle do jogo
    let LetrasCoordenadas: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let JogadorAtual = useRef(1);
    let MovimentosPossiveis = useRef<MovimentoPossivelInterface[]>([]);
                
    // Renderiza os elementos da tela
    let [Casas, SetCasas] = useState<CasaInterface[]>([]);    
    let [Pecas, SetPecas] = useState<PecaInterface[]>([]);
    let[Historico, SetHistorico] = useState<HistoricoInterface[]>([]);
        
    useEffect(() => {
        IniciarJogo();
    }, []);

    return (
        
        <MainDiv>

            <TabuleiroDiv>

               {Casas.map(casa => (

                    <Casa onClick={() => MovimentarPeca(casa)} id={casa.Id.toString()} key={casa.Id} Color={casa.CorAtual}
                        MovimentoPeca={casa.MovimentoPeca}>                                            
                        <span>{casa.BordaLabel}</span>
                        {Pecas.map(peca => (
                            casa.CoordenadaX === peca.CoordenadaX && casa.CoordenadaY === peca.CoordenadaY && peca.Ativa ? 
                                <Peca key={peca.Id} Color={peca.Cor} Ativa={peca.Ativa}
                                    onClick={() => DestacarPossibilidadeMovimento(peca)}
                                /> : ''
                        ))}

                    </Casa>

               ))}

            </TabuleiroDiv>

            <HistoricoDiv>
                <h1>Vez das <PecaVez Color={JogadorAtual.current === 1 ? 'red' : 'blue'}>
                        {JogadorAtual.current === 1 ? 'VERMELHAS' : 'AZUIS'}
                    </PecaVez>
                    
                </h1>
                <h2>Histórico:</h2>
                {Historico.map(historico => (
                    <p key={historico.Id}>{historico.MovimentoOrigem} - {historico.MovimentoDestino} - {historico.PecaRemovida}</p>
                ))}
            </HistoricoDiv>

        </MainDiv>

    );

    // Função para iniciar o jogo
    function IniciarJogo() {

        SetCasas(RenderizarTabuleiro());
        SetPecas(OrganizarPecas());
        SetHistorico([]);
        JogadorAtual.current = 1;

    }

   // Função para setar a cor da casa
   function SetCorCasa(coordenadaX: number, coordenadaY: number): string {

        if(coordenadaY !== 9 && coordenadaX !== LetrasCoordenadas.length) {

            return coordenadaY % 2 === 0 ?
                coordenadaX % 2 === 0 ? 'white' : 'black' :
                coordenadaX % 2 === 0 ? 'black' : 'white'

        }

        return 'transparent';

   }

   // Função para setar o label da Casa
   function SetLabel(coordenadaX: number, coordenadaY: number): string {

        if(coordenadaY === 9 || coordenadaX === LetrasCoordenadas.length) {

            return coordenadaY === 9 && coordenadaX === LetrasCoordenadas.length ? '' : (
                coordenadaY === 9 ?  LetrasCoordenadas[coordenadaX] : coordenadaY ).toString();

        }

        return '';

   }
    
    // Função para renderizar o tabuleiro com suas respectivas coordenadas
    function RenderizarTabuleiro(): CasaInterface[] {
        
        let CasasMock: CasaInterface[] = [];
        let IdCount: number = 1;

        for(let coordenadaY = 9; coordenadaY >= 1; coordenadaY--) {

            for(let coordenadaX = 0; coordenadaX <= 8 ; coordenadaX++) {

                const CorAtual = SetCorCasa(coordenadaX, coordenadaY);

                CasasMock.push({

                    CoordenadaX: coordenadaX === LetrasCoordenadas.length ? '' : LetrasCoordenadas[coordenadaX],
                    CoordenadaY: coordenadaY.toString(),
                    CorAtual: SetCorCasa(coordenadaX, coordenadaY),
                    CorOriginal: CorAtual,
                    Id: IdCount,
                    MovimentoPeca: false,
                    BordaLabel: SetLabel(coordenadaX, coordenadaY)

                });

                IdCount ++;

            }

        }

        return CasasMock;

    }

    // Funcão para organizar as peças no tabuleiro
    function OrganizarPecas(): PecaInterface[] {

        let PecasMock: PecaInterface[] = [];
        let IdCount: number = 1;

        for(let x = 0; x < 3; x++) {

            let InicioIndice = x % 2 === 0 ? 1 : 0;

            for(let y = InicioIndice; y < 8; y = y + 2) {

                PecasMock.push({
                    Id: IdCount ++,
                    Jogador: 1,
                    CoordenadaX: LetrasCoordenadas[y],
                    CoordenadaY: (x + 1).toString(),
                    Cor: 'red',
                    Ativa: true
                })

            }        

            for(let y = InicioIndice; y < 8; y = y + 2) {

                PecasMock.push({
                    Id: IdCount ++,
                    Jogador: 2,
                    CoordenadaX: LetrasCoordenadas[y],
                    CoordenadaY: (x + 6).toString(),
                    Cor: 'blue',
                    Ativa: true
                })

            }

        }

        return PecasMock;

    }

    // Função para limpar possibilidades de movimento
    function LimparPossibilidades() {

        SetCasas(Casas.map(casa => {

            if(casa.CorOriginal !== casa.CorAtual) {
                casa.CorAtual = casa.CorOriginal;
                casa.MovimentoPeca = false;
            }

            return casa;

        }));

        MovimentosPossiveis.current = [];

    }
    
    // Função para verificar a possibilidade de movimento da peça
    function VerificarPossivelMovimento(CoordenadaX: string, CoordenadaY: string): boolean {

        if(Pecas.some(peca=> peca.CoordenadaX === CoordenadaX && peca.CoordenadaY === CoordenadaY && peca.Jogador === JogadorAtual.current)) {

            return false;

        }

        return true;

    }

    // Verifica se um dos movimentos possíveis pode comer uma peça do adversário
    function AdicionarMovimento(PecaSelecionadaId: number, CoordenadaX: string, CoordenadaY: string, Direcao: EDirecao): MovimentoPossivelInterface {

        // Verifica se existe uma peça adversária em uma das casas onde a peça poderá se mover
        const FoundedPecaAdversaria = Pecas.find(peca=> peca.CoordenadaX === CoordenadaX && peca.CoordenadaY === CoordenadaY && peca.Jogador !== JogadorAtual.current);
        const FoundedCasa = Casas.find(casa => casa.CoordenadaX === CoordenadaX && casa.CoordenadaY === CoordenadaY);

        // Verifica se a peça adversária não está no canto do tabuleiro tanto do lado direito quanto do lado esquerdo
        if(FoundedPecaAdversaria && FoundedCasa && 
            (LetrasCoordenadas.indexOf(FoundedPecaAdversaria.CoordenadaX) > 0 && LetrasCoordenadas.indexOf(FoundedPecaAdversaria.CoordenadaX) < LetrasCoordenadas.length - 1 )) {            

                // Troca a cor da casa da peça adversária para amarelo
                SetCasas(Casas.map(casa => {

                    if(casa.Id === FoundedCasa.Id) {
                        casa.CorAtual = 'yellow';
                    }

                    return casa;

                }))

                // Verifica o lado que a peça adversária está da peça selecionada e troca o movimento possível da peça selecionado para atrás da peça advesária
                if(Direcao === EDirecao.Esquerda) {

                    CoordenadaX = LetrasCoordenadas[LetrasCoordenadas.indexOf(FoundedPecaAdversaria.CoordenadaX) - 1];
                    
                }

                else {

                    CoordenadaX = LetrasCoordenadas[LetrasCoordenadas.indexOf(FoundedPecaAdversaria.CoordenadaX) + 1];

                }
                
                CoordenadaY = (parseInt(CoordenadaY) + 1).toString();

        }

        // Troca a cor das casas onde será possível o movimento da peça selecionada para verde
        SetCasas(Casas.map(casa => {

            if(casa.CoordenadaX === CoordenadaX && casa.CoordenadaY === CoordenadaY) {

                casa.CorAtual = 'green';
                casa.MovimentoPeca = true;

            }

            return casa;

        }));

        // retorna o movimento possível da peça selecionada
        return {
            PecaSelecionadaId,
            RemoverPecaId: FoundedPecaAdversaria?.Id,
            CoordenadaX,
            CoordenadaY
        };

    }

    // Função para destacar possibilidade de movimentos
    function DestacarPossibilidadeMovimento(PecaSelecionada: PecaInterface) {
        
        // Verifica se a peça selecionada pertence ao jogador que possuí a vez
        if(PecaSelecionada.Jogador !== JogadorAtual.current) {

            alert("Você não pode mover as peças do adversário");
            return;

        }

        // Limpa o array de possibilidades
        LimparPossibilidades();        

        // Seta a casa que a peça selecionada está no eixo X
        const IndiceX = LetrasCoordenadas.indexOf(PecaSelecionada.CoordenadaX);

        // Seta as coordenada possível a esquerda da peça selecionada
        let CoordenadaXPossivel: string = LetrasCoordenadas[IndiceX - 1];
        let CoordenadaYPossivel: string =  (parseInt(PecaSelecionada.CoordenadaY) + 1).toString();

        // Verifica se a coordenada não está no limite a esquerda do tabuleiro ou se existe uma peça do próprio jogador ocupando a casa
        if(IndiceX > 0 && VerificarPossivelMovimento(CoordenadaXPossivel, CoordenadaYPossivel)) {
            MovimentosPossiveis.current.push(AdicionarMovimento(PecaSelecionada.Id, CoordenadaXPossivel, CoordenadaYPossivel, EDirecao.Esquerda));
        }

        // Seta as coordenada possível a direita da peça selecionada
        CoordenadaXPossivel = LetrasCoordenadas[IndiceX + 1];
        CoordenadaYPossivel =  (parseInt(PecaSelecionada.CoordenadaY) + 1).toString();

        // Verifica se a coordenada não está no limite a esquerda do tabuleiro ou se existe uma peça do próprio jogador ocupando a casa
        if(IndiceX < LetrasCoordenadas.length - 1 && VerificarPossivelMovimento(CoordenadaXPossivel, CoordenadaYPossivel)) {   
            MovimentosPossiveis.current.push(AdicionarMovimento(PecaSelecionada.Id, CoordenadaXPossivel, CoordenadaYPossivel, EDirecao.Direita));
        }

        // Caso a peça não possua nenhum movimento possível no momento faz um alerta ao jogador
        if(MovimentosPossiveis.current.length === 0) {
            alert('Está peça não pode ser movida');
        }      

    }

    // Função para verificar se um movimento é válido
    function MovimentarPeca(CasaSelecionada: CasaInterface) {

        // Verifica se existe uma peça já selecionada
        if(MovimentosPossiveis.current.length > 0) {            

            // Verifica se a casa selecionada faz parte de um dos movimentos possívels da peca
            const MovimentoSelecionado = MovimentosPossiveis.current.find(movimento => movimento.CoordenadaX === CasaSelecionada.CoordenadaX 
                && movimento.CoordenadaY === CasaSelecionada.CoordenadaY);

            if(MovimentoSelecionado) {

               
                SetPecas(Pecas.map(peca => {

                     // Realiza o movimento da peça selecionada
                    if(peca.Id === MovimentoSelecionado.PecaSelecionadaId) {
                                            
                        // Adiciona um movimento no histórico da partida
                        SetHistorico([...Historico, {
                            Id: Historico.length + 1,
                            Jogador: JogadorAtual.current,
                            MovimentoOrigem: peca.CoordenadaX + peca.CoordenadaY,
                            MovimentoDestino: MovimentoSelecionado.CoordenadaX + MovimentoSelecionado.CoordenadaY,
                            PecaRemovida: MovimentoSelecionado.RemoverPecaId ? true : false
                        }]);

                         // Seta a nova posição da peça selecionada
                         peca.CoordenadaX = MovimentoSelecionado.CoordenadaX;
                         peca.CoordenadaY = MovimentoSelecionado.CoordenadaY;          

                    }

                    // Verifica se o possível movimento da peça irá comer uma das peças do adversário
                    if(MovimentoSelecionado.RemoverPecaId && peca.Id === MovimentoSelecionado.RemoverPecaId) {

                        peca.Ativa = false;

                    }

                    return peca;

                }));

                // Limpa as possibilidades possíveis da peça e passa a vez para o outro jogador
                LimparPossibilidades();
                JogadorAtual.current = JogadorAtual.current === 1 ? 2 : 1;
                
            }

        }       

    }

}