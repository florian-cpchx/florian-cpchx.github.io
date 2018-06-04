//API qui retourne la valeur du bitcoin sur les 31 derniers jours
const api = 'https://api.coindesk.com/v1/bpi/historical/close.json?currency=EUR';

//Ne charger les valeurs de l'API qu'apres le chargement du DOM
document.addEventListener("DOMContentLoaded", function() {
    fetch(api)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var parsedData = parseData(data);
            drawLineChart(parsedData);
        })
});

//Cette fonction cree un array d'objets qui contiennent chacun une date et la valeur du BTC a cette date
function parseData(data) {
    var array = [];
    for (var i in data.bpi) {
        array.push({
            date: new Date(i), //date
            value: +data.bpi[i] //convertit du texte en valeur, ici les euros a gauche
        });
    }
    return array;
}


function drawLineChart(data) {
    var svgWidth = 800, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 40, left: 50 };
    // On definit le width et height du chart en utilisant des soustractions avec les valeurs de marge pour qu'il s'adapte au svg et ne cache pas le texte ou les valeurs
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // on definit le width et height du svg du fichier html avec les valeurs utilisees plus haut
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //
    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.date)})
        .y(function(d) { return y(d.value)})
    x.domain(d3.extent(data, function(d) { return d.date }));
    y.domain(d3.extent(data, function(d) { return d.value }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append()
        .select(".domain")
        .remove();

    //On definit la legende en ordonnee
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Prix (€)");

    //On definit le style de la ligne
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}