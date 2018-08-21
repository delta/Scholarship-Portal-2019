$('.progress .circle').removeClass().addClass('circle');
$('.progress .bar').removeClass().addClass('bar');
$('.progress .circle:nth-of-type(' + 1 + ')').addClass('active');
$('.progress .circle:nth-of-type(' + (1) + ')').removeClass('active').addClass('done');
$('.progress .circle:nth-of-type(' + (1) + ') .label').html('&#10003;');