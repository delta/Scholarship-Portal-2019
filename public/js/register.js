const part_1 = document.querySelector('.part-1')
const part_2 = document.querySelector('.part-2')
const main =  document.querySelector('.main')

main.addEventListener('click',hideContent);

function hideContent(e){
    let val;
    if(e.target.tagName != 'I') return  
    val = e.target.getAttribute('data-id')
    switch(val){
        case '1':   part_1.classList.toggle("hide")
                    e.target.classList.toggle('fa-caret-down');
                    e.target.classList.toggle('fa-caret-up');
                    break;
        case '2':   part_2.classList.toggle("hide")
                    e.target.classList.toggle('fa-caret-down');
                    e.target.classList.toggle('fa-caret-up');
                    break;
    }
}
