$(document).ready(function(){

    $("#smartwizard").on("showStep", function(e, anchorObject, stepNumber, stepDirection, stepPosition) {
       if(stepPosition === 'first'){
           $("#prev-btn").addClass('disabled');
       }else if(stepPosition === 'final'){
           $("#next-btn").addClass('disabled');
       }else{
           $("#prev-btn").removeClass('disabled');
           $("#next-btn").removeClass('disabled');
       }
    });

    $('#smartwizard').smartWizard({
            selected: 0,
            theme: 'default',
            keyNavigation:false,
            transitionEffect:'fade',
            showStepURLhash: true,
            toolbarSettings: {
                              toolbarButtonPosition: 'end',
                            }
    });

    $("#prev-btn").on("click", function() {
        $('#smartwizard').smartWizard("prev");
        return true;
    });

    $("#next-btn").on("click", function() {
        $('#smartwizard').smartWizard("next");
        return true;
    });

    $('#smartwizard').smartWizard("theme","arrows");
});
window.onload = function(){
    document.querySelector('.sw-btn-next').addEventListener('click',(e) => {
        window.scrollTo(0, 0);
    })
    document.querySelector('.sw-btn-prev').addEventListener('click',(e) => {
        window.scrollTo(0, 0);
    })
}
