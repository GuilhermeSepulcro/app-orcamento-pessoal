class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i == null]){
                return false
            }
        }
        return true
    }
}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }
    
    recuperarTodosRegistros(){

        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        
        //recuperar todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++){

            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //se existir a possibilidade de haver índices que foram pulados/removidos
            //nessas situações nós vamos pular esses índices
            if(despesa === null){
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa){
        
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')


    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)
        //dialog de sucesso
        document.getElementById('modal-titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal-titulo-div').className = 'modal-header text-success'
        document.getElementById('modal-conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal-btn').innerHTML = 'Voltar'
        document.getElementById('modal-btn').className = 'btn btn-success'

        $('#registraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        
    } else {
        //dialog de erro
        document.getElementById('modal-titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal-titulo-div').className = 'modal-header text-danger'
        document.getElementById('modal-conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente'
        document.getElementById('modal-btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal-btn').className = 'btn btn-danger'

        $('#registraDespesa').modal('show')
    }
    
}

function carregaListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas listando cada despesa de forma dinamica
    despesas.forEach(function(d){

        //criar linhas (tr)
        let linha = listaDespesas.insertRow()

        //criar colunas (td)
        linha.insertCell(0).innerHTML =  `${d.dia}/${d.mes}/${d.ano}` 
        
        //ajustar o tipo
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botao de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //exibir modal
            document.getElementById('modal-titulo').innerHTML = 'Excluir despesa'
            document.getElementById('modal-titulo-div').className = 'modal-header text-danger'
            document.getElementById('modal-conteudo').innerHTML = 'Deseja excluir essa despesa?'
            document.getElementById('modal-btn-sim').innerHTML = 'Sim'
            document.getElementById('modal-btn-sim').onclick = function(){
                //remover a despesa
                let btnExcluir = btn.id.replace('id_despesa_', '')

                bd.remover(btnExcluir)

                window.location.reload()

            }
            document.getElementById('modal-btn-nao').innerHTML = 'Cancelar'
            document.getElementById('modal-btn-sim').className = 'btn btn-danger'
            document.getElementById('modal-btn-nao').className = 'btn btn-secondary'

            $('#consultaDespesa').modal('show')

        }
        linha.insertCell(4).append(btn)

    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)

}