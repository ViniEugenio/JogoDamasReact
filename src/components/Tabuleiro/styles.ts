import styled from 'styled-components';

export const MainDiv = styled.div`

    background-color: #D3D3D3;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;

`;

export const TabuleiroDiv = styled.div`

    height: 70%;
    width: 55%;
    display: flex;
    flex-wrap: wrap;

`;

interface CasaProps {
    Color: string;
    MovimentoPeca: boolean;
}

export const Casa = styled.div<CasaProps>`

    background-color: ${props=> props.Color};
    height: 12.5%;
    width: 11%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${props => props.MovimentoPeca ? 'pointer' : 'auto'};

    span {
        color: black;   
        font-size: 34px;
    }

`;

interface PecaProps {
    Color: string;
    Ativa: boolean;
}

export const Peca = styled.div<PecaProps>`

    background-color: ${props => props.Color};
    height: 70%;
    width: 70%;
    border-radius: 50%;
    cursor: ${props => props.Ativa ? 'pointer' : 'not-allowed'};

`;

export const HistoricoDiv = styled.div `

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    margin-top: 200px;

`;

interface PecaVezProps {
    Color: string;
}

export const PecaVez = styled.span<PecaVezProps>`

    color: ${props => props.Color}

`;