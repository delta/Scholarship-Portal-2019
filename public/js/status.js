$('.progress .circle').removeClass().addClass('circle');
$('.progress .bar').removeClass().addClass('bar');
$('.progress .circle:nth-of-type(' + 1 + ')').addClass('active');
$('.progress .circle:nth-of-type(' + 1 + ')').removeClass('active').addClass('done');
$('.progress .circle:nth-of-type(' + 1 + ') .label').html('&#10003;');

$(document).ready(function(){

    $("body").tooltip({
        selector: "[data-toggle='tooltip']",
        container: "body"
    }).popover({
            selector: "[data-toggle='popover']",
            container: "body",
            html: true
    });
    updateStatus();
});

function updateStatus(){
  let status = document.querySelector('.progress-contain').getAttribute('data-studentStatus')
  if(status == 0 ){
    // green
    $('.progress .circle:nth-of-type(' + 2 + ')').addClass('active');
    $('.progress .circle:nth-of-type(' + 2 + ')').removeClass('active').addClass('done');
    $('.progress .circle:nth-of-type(' + 2 + ') .label').html('&#10003;');
  }
  if(status == 1){
    // red
    $('.progress .circle:nth-of-type(' + 2 + ')').addClass('active');
    $('.progress .circle:nth-of-type(' + 2 + ')').removeClass('active').addClass('cross');
    $('.progress .circle:nth-of-type(' + 2 + ') .label').html('X');
  }
}
