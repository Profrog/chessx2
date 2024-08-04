// 토글

const toggleButton = document.querySelector('.toggle-button');

const bodyBackground = document.querySelector('body');

const headerNav = document.querySelector(".header-nav-list-wrapper");

const bookmarkWrapper = document.querySelector('bookmark-wrapper');

const searchInput = document.querySelector('#search-input');

const imaIconWrapper = document.querySelectorAll('.img-icon-wrapper');

const bookmarkText = document.querySelectorAll('.bookmark-text');

toggleButton.addEventListener('click', function(){

    if (toogleButton.textContent == "다크모드"){

        toogleButton.textContent = "일반모드";
    }

    toggleButton.textContent = "다크모드";
    toggleButton.classList.toogle('.toggle-button-darkmode');
    bodyBackground.classList.toogle('.body-background-darkmode');
    headerNav.classList.toogle("text-darkmode");

    for(let i = 0; i < imaIconWrapper.length ; i++)
    {
        imaIconWrapper[i].classList.toggle("img-icon-wrapper-darkmode");
    }


    for(let i = 0; i < bookmarkText.length ; i++)
    {
        imaIconWrapper[i].classList.toggle("text-darkmode");
    }


    if (toggleButton.classList.contains('toogle-button-darkmode')){
        toggleButton.textContent = "일반모드";
    }

    searchInput.addEventListener('keyup', function(e){
        if(e.code === "Enter"){
            if(e.target.value === "")
            {
                alert("검색어를 입력하시오");
            }

            else{
                const googleSearch = "https://www.google.com/search?q=";
                location.href = googleSearch + e.target.value;
                //window.open(googleSearch + e.target.value, "_blank")
            }
        }
    })

})