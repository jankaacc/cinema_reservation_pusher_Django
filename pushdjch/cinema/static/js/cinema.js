//window.onload = start;
//

var quantity = 0;

function start(queryset_seats = null, tickets_quan = null, taken_seats = null)
{
	var tresc_diva = "<center>";
    var row = 1;
    var col = 0;


    var table = [];
    var element_list = [];
    var len = queryset_seats.length;


    for (i = 0 ; i < len ; i++)
    {
        table.push("\'"+ queryset_seats[i] + "\'")
    }


	for (i=0; i<=39; i++)
	{
	    col = i % 8;
		var element = row + "_" + col;
		element_list.push(element);


		tresc_diva = tresc_diva + '<div class="seat" onclick="sprawdz(\''+element+'\', ['+table+']);" id="'+element+'">'+col+'</div>';
		if ((i+1) % 8 ==0)
		{

		    tresc_diva = tresc_diva + row + '<div style="clear:both;"></div>';
		    row++;
		}

    }

    quantity = tickets_quan;

    tresc_diva += "</center>";
	document.getElementById("audience").innerHTML = tresc_diva ;
//    document.getElementById("deb").innerHTML = quantity ;

    if(taken_seats) queryset_seats.push(taken_seats);


    var flag = false;

    for(i = 0 ; i < element_list.length ; i++)
    {
        for(j = 0 ; j < queryset_seats.length ; j++)
        {
            if (element_list[i] == queryset_seats[j])
            {
                flag = true
            }
        }

        if(flag)
        {
            document.getElementById(element_list[i]).style.background = "#330000";
            document.getElementById(element_list[i]).style.color = "#C00000";
            document.getElementById(element_list[i]).style.border = "3px solid #C00000";
            document.getElementById(element_list[i]).style.cursor = "default";
        }

        flag = false;
    }
}

var pusher = new Pusher('4b34c484eeb9fe4f4142');
var my_channel = pusher.subscribe('a_channel');
my_channel.bind("an_event", function(data){

//    document.getElementById("deb").innerHTML = data.message;

    for(i = 0 ; i < data.message.length ; i++)
    {
        document.getElementById(data.message[i]).style.background = "#330000";
        document.getElementById(data.message[i]).style.color = "#C00000";
        document.getElementById(data.message[i]).style.border = "3px solid #C00000";
        document.getElementById(data.message[i]).style.cursor = "default";
    }

});

var taken_seats = [];


function sprawdz(element, queryset_seats)
{
//    document.getElementById("deb").innerHTML = taken_seats;
    var flag = false;

    for (i = 0 ; i < queryset_seats.length ; i++)
    {
        if(queryset_seats[i] == element) flag = true;
    }

    for (i = 0 ; i < taken_seats.length ; i++)
    {
        if(taken_seats[i] == element) flag = true;
    }

    if(!flag && quantity)
    {
        document.getElementById(element).style.background = "#003300";
        document.getElementById(element).style.color = "#00C000";
        document.getElementById(element).style.border = "3px solid #00C000";
        document.getElementById(element).style.cursor = "pointer";
        taken_seats.push(element);
        quantity--;
    }

    if(flag)
    {
        document.getElementById(element).style.background = "#000000";
        document.getElementById(element).style.color = "lightgray";
        document.getElementById(element).style.border = "3px solid gray";
        document.getElementById(element).style.cursor = "pointer";
        var index = taken_seats.indexOf(element);
        if(index > -1){
            taken_seats.splice(index,1);
        }
        quantity++;
    }

}

$(document).ready(function(){
        $("#btn-reserve").click(function(){
             var message = taken_seats;
//             document.getElementById("deb").innerHTML = taken_seats;

            $.post({
                url: '/cinema/',
                data: {
                'message': message
                },
                success: function (data) {

                    taken_seats = [];

                }
            });

        })
    })