    let image_alt = '';

    const skin_label_name = [ //piece skin 이름
        '1.Chessx2',
        '2.Neo',
        '3.Game Room',
        '4.Wood',
        '5.Glass',
        '6.Gothic',
        '7.Classic',
        '8.Metal',
        '9.Bases',
        '10.Neo-Wood',
        '11.Icy Sea',
        '12.Club',
        '13.Ocean',
        '14.Newspaper',
        '15.Blindfold',
        '16.Space',
        '17.Condal',
        '18.8-Bit',
        '19.Marble',
        '20.Book',
        '21.Bubblegum',
        '22.Dash',
        '23.Graffiti',
        '24.Lolz',
        '25.Luca',
        '26.Maya',
        '27.Nature',
        '28.Neon',
        '29.Sky',
        '30.Tigers',
        '31.Tournament',
        '32.Vintage',
        '33.Halloween',
        '34.Starwars'
    ]

    window.onload = function() {
        //유저 데이터로 샘플 결로 업데이트
        const sample_link = localStorage.getItem('sample');
        const sample_opt = localStorage.getItem('sample_opt');
        const gif_sample = document.getElementById('gif_sample');

        if(sample_opt >= 1)
        {
            gif_sample.src = sample_link;
        }

        else
        {
             gif_sample.src = './images/sample/0.gif';
             localStorage.setItem('sample_opt', "0");
        }

        //updateUserProduct(); //커스텀 결과물 예시 업데이트
        addSelectPiece(34); //지원 스킨 업데이트(체스닷컴의 32종류 스킨 지원)
    }

     function addSelectPiece(casecount)
     {
        images = [];
        const gallery = document.getElementById('selectpiece');

        for (let i = 1; i <= casecount; i++) {
                            const colDiv = document.createElement('div');
                            colDiv.className = 'col-md-4 mb-4';
                            // input 태그 생성
                            const cardElement = document.createElement('card');
                            cardElement.id = "card" + i.toString();
                            const cardid = "card" + i.toString();

                            //img 태그 생성
                            const imgElement = document.createElement('img');
                            imgElement.src = "./images/sample/" + i.toString() + ".png";
                            imgElement.className = 'card-img-top';
                            imgElement.alt = "skin" + i.toString();
                            imgElement.onclick = () => handleImageClick(imgElement);

                            const labelDiv = document.createElement('div');
                            labelDiv.className = 'label';
                            labelDiv.textContent = skin_label_name[i-1];
                            // colDiv에 img 태그 추가
                            colDiv.appendChild(imgElement);
                            colDiv.appendChild(cardElement);
                            colDiv.appendChild(labelDiv);
                            // gallery 요소에 colDiv 추가
                            gallery.appendChild(colDiv);
        }
     }


    function updateUserProduct() {
        const postData = {};

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };

        fetch('/api/update', fetchOptions)
            .then(response => response.json())
            .then(data => {
                //console.log(data.output_dir); // 서버의 응답을 처리합니다

                showingGifdata(data.gif_link);
            })
            .catch(error => console.error('Error:', error));
    }

    function showingGifdata(src0) {
        src0 = src0.substring(1, src0.length - 1);
        const result = src0.split(",");
        let count = 1;

        for (const src of result) {
            count = count + 1;

            if(count > 9)
            {
                break;
            }
            console.log(src0);
            const gif_gallery = document.getElementById('user_gallery');
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-4';
            // img 태그 생성
            const imgElement = document.createElement('img');
            imgElement.src = "./images/gifoutput/" + src;
            imgElement.className = 'img-fluid midium mx-2 my-2';
            imgElement.alt = src;

            // colDiv에 img 태그 추가
            colDiv.appendChild(imgElement);
            // gallery 요소에 colDiv 추가
            gif_gallery.appendChild(colDiv);
        }
    }

    // 이미지 클릭 시 호출되는 함수
    function handleImageClick(imageElement) {
        //alt 속성의 값을 가져와서 변수에 저장
        image_alt = imageElement.getAttribute('alt');
        localStorage.setItem('skin_data', image_alt);
        window.location.href = "/ptg";
        console.log('Selected Image Alt:', selectedImageAlt);
        alert('Selected Image Alt: ' + selectedImageAlt);
    }