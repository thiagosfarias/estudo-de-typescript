import { NegociacoesView, MensagemView } from '../views/index';
import { Negociacao, Negociacoes } from '../models/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoService } from '../services/index';


export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _service = new NegociacaoService();
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle()
    adiciona() {

        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if(!this._ehDiaUtil(data)) {

            this._mensagemView.update('Somente negociações em dias úteis, por favor!');
            return 
        } else {
            const negociacao = new Negociacao(
                data, 
                parseInt(this._inputQuantidade.val()),
                parseFloat(this._inputValor.val())
            );
    
            this._negociacoes.adiciona(negociacao);
    
            this._negociacoesView.update(this._negociacoes);
            this._mensagemView.update('Negociação adicionada com sucesso!');
        } 
    }

    @throttle()
    importaDados() {
 

        this._service
            .obterNegociacoes((res:Response) => {
                if(!res.ok) throw new Error(res.statusText);
                return res;
            })
            .then(negociacoes => {
                negociacoes.forEach(negociacao => 
                    this._negociacoes.adiciona(negociacao));
                this._negociacoesView.update(this._negociacoes);
                this._mensagemView.update("Negociacoes importadas com sucesso!");
            })
            .catch((err: Error) => {
                this._mensagemView.update('Não foi possivel importar os dados!');
                console.log(err.message);
            })       
    }

    private _ehDiaUtil(data: Date) {

        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }
}

enum DiaDaSemana {

    Domingo, 
    Segunda, 
    Terca, 
    Quarta, 
    Quinta, 
    Sexta, 
    Sabado
}

