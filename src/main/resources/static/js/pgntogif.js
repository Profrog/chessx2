
let dir_link = './images/';
let image_link = '';
let images =[];
let gif_src;
let gif_id;

const label_name = [
    'board',
    'white pawn',
    'white night',
    'white bishop',
    'white rook',
    'white queen',
    'white king',
    'black pawn',
    'black night',
    'black bishop',
    'black rook',
    'black queen',
    'black king',
]
let pgndata = '';
let black_bottom_opt = 0;

 window.onload = function() {
        // localStorage에서 선택된 값 가져오기
        const selectedValue = localStorage.getItem('skin_data');
        if (selectedValue) {
            // 콤보박스 요소 가져오기
            const selectElement = document.getElementById('skinselect');
            // 콤보박스 값 설정
            selectElement.value = selectedValue;
            image_link = selectedValue;
        }

        addImage(".png");
   }


 function addImage(imagetype)
 {
    images = [];
    for (let i = 0; i <= 12; i++) {
        images.push(dir_link + image_link + "/" + i.toString().padStart(2, '0') + imagetype);
    }


     const gallery = document.getElementById('image_gallery');
     idx = 0;
        // 이미지 배열을 순회하여 갤러리에 추가
        images.forEach(src => {
            // div.col 생성
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-4';
            // img 태그 생성
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.className = 'img-fluid mini';
            imgElement.alt = src;
            imgElement.id = label_name[idx];

            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = label_name[idx];
            idx = idx + 1;
            // colDiv에 img 태그 추가
            colDiv.appendChild(imgElement);
            colDiv.appendChild(labelDiv);
            // gallery 요소에 colDiv 추가
            gallery.appendChild(colDiv);
        });
 }

  function getDropdownValue() {
             // 드롭다운 요소 가져오기
            const selectedValue = document.getElementById('skinselect').value;
            if (selectedValue) {
                // 콤보박스 요소 가져오기
                localStorage.setItem('skin_data', selectedValue);
                image_link = selectedValue;

                  for (let i = 0; i <= 12; i++) {
                        images[i] = dir_link + image_link + "/" + i.toString().padStart(2, '0') + ".png";
                        document.getElementById(label_name[i]).src = images[i];
                        document.getElementById(label_name[i]).alt = images[i];
                    }
            }
         }


  function makeGIF()
  {
    pgndata = document.getElementById('pgndata').value;
    const checkedRadio = document.querySelector('input[name="sideRadios"]:checked');
    if(checkedRadio.textContent == 'black')
    {
        black_bottom_opt = 1;
    }

    else
    {
       black_bottom_opt = 0;
    }

    const checkedSpeed = document.querySelector('input[name="Speeds"]:checked');
    let speed0 = checkedSpeed.value;

    const postData = {
      pgndata: pgndata,
      black_bottom_opt: black_bottom_opt,
      input_link : dir_link + image_link,
      delay : speed0
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    };

    fetch('/api/pgntogif', fetchOptions)
      .then(response => response.json())
      .then(data => {
        //console.log(data.output_dir); // 서버의 응답을 처리합니다

        gif_src = data.output_dir;
        gif_id = data.id;
        showingGifdata();
      })
      .catch(error =>console.error('Error:', error));
  }

  function showingGifdata()
  {
     let src0 = gif_src;
     let id0 = gif_id;
     console.log(src0);
     const gif_gallery = document.getElementById('gif_gallery');
       const colDiv = document.createElement('div');
         colDiv.className = 'col-md-4';
         // img 태그 생성
         const imgElement = document.createElement('img');
         imgElement.src = src0;
         imgElement.className = 'img-fluid midium';
         imgElement.alt = src0;
         imgElement.id = id0;
          imgElement.addEventListener('click', () => {
               const link = document.createElement('a');
               link.href = src0;
               link.download = 'result.gif';  // 원하는 파일 이름document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
          });

         const labelDiv = document.createElement('div');
         labelDiv.className = 'label';
         labelDiv.textContent = "gif result";
         // colDiv에 img 태그 추가
         colDiv.appendChild(imgElement);
         colDiv.appendChild(labelDiv);
         // gallery 요소에 colDiv 추가
         gif_gallery.appendChild(colDiv);
  }





