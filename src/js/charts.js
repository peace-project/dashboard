/**
*	Created by David Bimamisa
*/


var barChartData =  {
    labels : ['Engine A','Engine B','Engine C','Engine D'],
    datasets : [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(220,220,220,0.2)',
            data :[28, 48, 40, 19]
        },
        {
            label: 'My Second dataset',
            backgroundColor: 'rgba(220,220,220,0.2)',
            data : [23, 58, 50, 29]
        }
    ]
};


var barChartOptions = {responsive: false};

window.onload = function(){
	//var ctx = $('#conformance-chart');
    var ctx = document.getElementById('conformance-chart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: barChartOptions
    });
};