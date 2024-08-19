    let image_alt = '';

    window.onload = function() {
        // localStorage에서 선택된 값 가져오기
        updateUserProduct();

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

            if(count > 99)
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